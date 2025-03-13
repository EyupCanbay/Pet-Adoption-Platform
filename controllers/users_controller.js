const responseHandler = require("../utils/responseHandler")
const { User } = require('../models/index')

async function getAllUsers(req,res,next) {
    try{
        const user = await User.find({})

        return responseHandler.success({res, statusCode:200, message:"User successfuly fetched",data:user})
    }catch ( error){
        return responseHandler.error({res, statusCode:500, message:"Could not fecth users", error})
    }
}

module.exports = {
    getAllUsers
}