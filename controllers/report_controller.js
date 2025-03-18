const { User, Report, } = require('../models/index')
const responseHandler = require('../utils/responseHandler')

async function reportUser(req,res,next) {
    try {
        const report = await Report.create({
            reporter: req.user._id,
            reportedUser: req.params.user_id,
            reportedPetListing_id: req.body.reportedPetListing_id ,
            reportedLostPetListing_id: req.body.reportedLostPetListing_id ,
            reason: req.body.reason,
            status: false
        })
        return responseHandler.success({res, statusCode:200, message:"User successfuly is reported", data: report})
    } catch (error) {
        return responseHandler.error({res, statusCode: 500,message: "User do not report", error})
    }
}

async function getAllReport(req,res,next) {
    try {
        const report = await Report.find()
        .populate("reporter", "name surname userName")
        .populate("reportedUser", "name surname userName");       

        if(!report) return responseHandler.error({res, statusCode:400, message:"Reports not found"})
            
        return responseHandler.success({res, statusCode:200, message: "Successfuly fetch all reports", data: report})
    } catch (error) {
        return responseHandler.error({res, statusCode: 500, message: "Reports did not fetch", error})
    }
}

async function forbiddenUser(req,res,next) {
    try {
        const { user_id } = req.params;
        const { banDuration } = req.body; 

        const forbiddenUntil = new Date();
        forbiddenUntil.setDate(forbiddenUntil.getDate() + banDuration); // Gün ekleyerek yasak bitiş süresini belirlenir

        await User.findByIdAndUpdate(user_id, {
            is_active: false,
            forbiddenTime: forbiddenUntil,
            banCount: banCount + 1
        });
        
        return responseHandler.success({res, statusCode:200, message: `Until ${forbiddenUntil} forbiden user `, data: forbiddenUntil})
    } catch (error) {
        return responseHandler.error({res, statusCode: 500, message: "User do not ban the system", error})
    }
}

module.exports = {
    reportUser,
    getAllReport,
    forbiddenUser
}

