const responseHandler = require("../utils/responseHandler")
const { User } = require('../models/index')

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

module.exports = {
    getAllUsers,
    getUser,
    blockedUser
}