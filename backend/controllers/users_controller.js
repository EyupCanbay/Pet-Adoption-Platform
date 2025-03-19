const responseHandler = require("../utils/responseHandler")
const { User, Address } = require('../models/index')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Auditlog = require("../utils/auditlog_save")


async function getAllUsers(req,res,next) {
    try{
        const userId = req.user._id; 
        const user = await User.findById(userId).select('blockedUser role');

        if (!user) {
            return responseHandler.error({ res, statusCode: 404, message: "User not found" });
        }

        const blockedByOthers = await User.find({ blockedUser: userId }).select('_id');

        const excludedUsers = [...user.blockedUser, ...blockedByOthers.map(u => u._id)];
        
        let users
        if(user.role === "USER"){
            users = await User.find({
                _id: { $nin: excludedUsers }, 
                role: { $ne: 'ADMIN' }
            }).select("name surname userName email phoneNumber");
        } else {
            users = await User.find({
                _id: { $nin: excludedUsers }, 
            }).select("name surname userName email phoneNumber role");
        }

        Auditlog.info(req.user?.userName,"Users","Get","Fetch all users") 
        return responseHandler.success({res, statusCode:200, message:"User successfuly fetched",data:users})
    }catch ( error){
        return responseHandler.error({res, statusCode:500, message:"Could not fecth users", error})
    }
}

async function getUser(req,res,next) {
    try{    
        const user = await User.findOne({ _id: req.params.user_id }).select("-password")

        Auditlog.info(req.user?.userName,"Users","Get","Fetch a user") 
        if(!user) return responseHandler.error({res, statusCode: 500, message:"User not found"})
        return responseHandler.success({res, statusCode: 200, message:"User successfuly fetched", data: user})
    } catch(error){
        return responseHandler.error({res, statusCode: 500, message:"User do not fetch", error})
    }
}

async function getUserMe(req,res,next) {
    try {
        const userId = req.user._id

        const user = await User.findById({_id: userId}).select("-password");

        const location = await Address.find({user_id: userId})
        
        if(!location) return responseHandler.error({res, statusCode: 404, message: "User not found"})

        Auditlog.info(req.user?.userName,"Users","Get","Fetch user me page") 
        return responseHandler.success({res, statusCode:200, message: "Successfuly fetch user data", data: {user, location}})
    } catch (error) {
        return responseHandler.error({res, statusCode: 500, message: "User data do not fetch", error})
    }
}

async function putUserMe(req,res,next) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try{
        const userId  = req.user._id
        const { userData, addressData } = req.body


        console.log(req.user._id)
      
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { ...userData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        
        let updatedAddress;
        console.log(userId)

        if (addressData) {
            updatedAddress = await Address.findOneAndUpdate(
                { user_id: userId },
                { ...addressData, updatedAt: new Date() },
                { new: true, upsert: true, runValidators: true } 
            );
        }

        const data = {updatedUser, updatedAddress}
        await session.commitTransaction();
        session.endSession();

        Auditlog.info(req.user?.userName,"Users","Update","Update user me page") 
        return responseHandler.success({res, statusCode: 201, message: "Successfuly update users's data ", data: data})

    } catch (error){
        await session.abortTransaction();
        session.endSession();
        return responseHandler.error({res, statusCode: 500, message: "Could not update user data"})

    }
}

async function blockedUser(req,res,next) {
    try{
        const blockedUserId  = req.params.user_id;
        const userId = req.user.id; 

        if (userId === blockedUserId) {
            return responseHandler({ res, statusCode:500, message:"Do not ban yourself" })
        }

        await User.findByIdAndUpdate(userId, { 
            $addToSet: { blockedUser: blockedUserId } 
        });

        Auditlog.info(req.user?.userName,"Users","Put","Added user block") 
        return responseHandler.success({res, statusCode: 201, message:"User was forbidden"})
    } catch (error) {
        return responseHandler.error({res, statusCode:500, message:"user do not forbidden", error})
    }
}

async function deleteUserBlock(req,res,next) {
    try{

        const userId = req.user._id
        const blockedUserId = req.params.user_id
 
        const user = await User.findById(userId).select("blockedUser")
        
        if (!user) {
            return responseHandler.error({ res, statusCode: 404, message: "User not found" });
        }

        user.blockedUser = user.blockedUser.filter(bu => bu.toString() !== blockedUserId);

        await user.save();

        Auditlog.info(req.user?.userName,"Users","Put","Remove user block") 
        return responseHandler.success({res, statusCode: 201, message:"Remove user block"})
    } catch (error) {
        return responseHandler.error({res, statusCode:500, message:"Did not remove user block", error})
    }
}

async function getBlockUsers(req,res,next) {
    try{
        const userId = req.user._id

        const blockedUsers = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } }, // Kullanıcıyı bulur
            { $lookup: { 
                from: "users",      // "users" koleksiyonunda (tablosunda) arar
                localField: "blockedUser",  // Kullanıcının "blockedUser" listesindeki ID’leri alır
                foreignField: "_id",    // Bu ID’lerle eşleşen kullanıcıları bulur
                as: "blockedUsers"      // Sonucu "blockedUsers" olarak kaydeter    
            }},
            { $project: { 
                blockedUsers: { name: 1, surname: 1, userName: 1, role: 1, phoneNumber: 1, email: 1 } 
            }}
        ]);

        if (!blockedUsers.length) {
            return responseHandler.error({ res, statusCode: 404, message: "User not found" });
        }

        Auditlog.info(req.user?.userName,"Users","Get","Fetch blocked user") 
        return responseHandler.success({
            res,
            statusCode: 200,
            message: "Blocked users fetched successfully",
            data: blockedUsers[0].blockedUsers || []  // agregate pipline returned a array
        });    
    } catch (error) {
        return responseHandler.error({res, statusCode:500, message:"Did not fetch block user", error})
    }
}

module.exports = {
    getAllUsers,
    getUser,
    putUserMe,
    getUserMe,
    deleteUserBlock,
    blockedUser,
    getBlockUsers
}