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
        Auditlog.info(req.user?.userName,"Report","Post","Create user report") 
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
            
        Auditlog.info(req.user?.userName,"Report","Get","Fetch all report user")
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
        
        Auditlog.info(req.user?.userName,"Report","Put","Foebidden the user on system")
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

