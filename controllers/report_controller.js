const { User, Report, } = require('../models/index')
const responseHandler = require('../utils/responseHandler')

async function reportUser(req,res,next) {
    try {
        const report = await Report.create({
            reporter: req.user._id,
            reportedUser: req.params.id,
            reportedPetListing_id: req.body.reportedPetListing_id ,
            reportedLostPetListing_id: req.body.reportedLostPetListing_id ,
            reason: req.body.reason,
            status: false
        })

        return responseHandler.success({res, statusCode:200, message:"User successfuly is reported"})
    } catch (error) {
        return responseHandler.error({res, statusCode: 500,message: "User do not report", error})
    }
}

module.exports = {
    reportUser
}