const responseHandler = require("../utils/responseHandler");
const { Auditlogs } = require('../models/index');
const { validateObjectId } = require("../validators/object_validate");
const Enum = require("../config/enum");
const Auditlog = require("../utils/auditlog_save");

async function getAuditlogs(req,res,next) {
    const userId = validateObjectId(req.user._id)
    try {   
        const page = Number(req.query.page) || 1; 
        const limit = Number(req.query.limit) || 30; 
        const skip = (page - 1) * limit; 

        const auditlogs = await Auditlogs.find({})
            .sort({ createdAt: -1 }) 
            .skip(skip) 
            .limit(limit);

        Auditlog.info(req.user?.userName,"Auditlog","GET","Fetch auditlogs")
        
        return responseHandler.success({ res, statusCode: Enum.HTTP_CODES.OK, message: "successfuly fetch aouditlogs", data: auditlogs})
    } catch (error) {
        return responseHandler.error({ res, statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR, message: "face an error fetching auditlogs", error})
    }
}


module.exports = {
    getAuditlogs
}