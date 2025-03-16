const responseHandler = require("../utils/responseHandler")
const { User, Address } = require('../models/index')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

async function getAllUsers(req,res,next) {
    try{
        const userId = req.user._id; 
        const user = await User.findById(userId).select('blockedUser role');

        if (!user) {
            return responseHandler.error({ res, statusCode: 404, message: "User not found" });
        }

        const blockedByOthers = await User.find({ blockedUser: userId }).select('_id');

        const excludedUsers = [...user.blockedUser, ...blockedByOthers.map(u => u._id)];

        const users = await User.find({
            _id: { $nin: excludedUsers }, 
            role: { $ne: 'ADMIN' }
        }).select("-password");
        

        return responseHandler.success({res, statusCode:200, message:"User successfuly fetched",data:users})
    }catch ( error){
        return responseHandler.error({res, statusCode:500, message:"Could not fecth users", error})
    }
}

async function getUser(req,res,next) {
    try{    
        const user = await User.findOne({ _id: req.params.user_id }).select("-password")

        if(!user) return responseHandler.error({res, statusCode: 500, message:"User not found"})
        return responseHandler.success({res, statusCode: 200, message:"User successfuly fetched", data: user})
    } catch(error){
        return responseHandler.error({res, statusCode: 500, message:"User do not fetch", error})
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


        return responseHandler.success({res, statusCode: 201, message:"User was forbidden"})
    } catch (error) {
        return responseHandler.error({res, statusCode:500, message:"user do not forbidden", error})
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

        return responseHandler.success({res, statusCode: 201, message: "Successfuly update users's data ", data: data})

    } catch (error){
        await session.abortTransaction();
        session.endSession();
        return responseHandler.error({res, statusCode: 500, message: "Could not update user data"})

    }
}

async function getUserMe(req,res,next) {
    try {
        const userId = req.user._id

        const user = await User.findById(userId).select("-password");
        const [blockUsers, ratesByUser, location] = await Promise.all([
            User.find({ _id: { $in: user.blockedUser } }).select("name surname userName"),
            User.find({ _id: { $in: user.rates.user}}).select("name surname userName"),
            Address.findOne({ user_id: userId })
        ]);

        data = {user, blockUsers, ratesByUser, location}

        return responseHandler.success({res, statusCode:200, message: "Successfuly fetch user data", data: data})
    } catch (error) {
        return responseHandler.error({res, statusCode: 500, message: "User data do not fetch", error})
    }
}


module.exports = {
    getAllUsers,
    getUser,
    blockedUser,
    putUserMe,
    getUserMe
}