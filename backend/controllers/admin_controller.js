const responseHandler = require("../utils/responseHandler");
const { User, Auditlogs } = require('../models/index');
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

        if( !req.user.userName ){
            req.user.userName = "anonim"
        }
        Auditlog.info(req.user?.userName,"Auditlog","GET","Fetch auditlogs")
        
        return responseHandler.success({ res, statusCode: Enum.HTTP_CODES.OK, message: "successfuly fetch aouditlogs", data: auditlogs})
    } catch (error) {
        return responseHandler.error({ res, statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR, message: "face an error fetching auditlogs", error})
    }
}

async function updateRole(req,res,next) {
    const changing_user_id = validateObjectId(req.params.user_id)
    const userId = validateObjectId(req.user._id)
    try{

        const user = await User.findByIdAndUpdate(changing_user_id, {
            $set: {
                role: req.body.role
            }
        }, {new: true})

        Auditlog.info(req.user?.userName,"Auditlog","PUT","Update user role")

        return responseHandler.success({ res, statusCode: Enum.HTTP_CODES.OK, message: "successfuly changing user role"})
    } catch(error ) {
        return responseHandler.error({res, statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR, message: "face an error updateing user role", error})
    }
}

module.exports = {
    getAuditlogs,
    updateRole
}