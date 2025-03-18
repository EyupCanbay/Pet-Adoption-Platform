const responseHandler = require("../utils/responseHandler")

function validateReportData(req,res,next) {

    if(!req.body.reason) return responseHandler.error({res, statusCode:500, message: "reason is required field"})
    
    next()
}


module.exports ={ validateReportData}