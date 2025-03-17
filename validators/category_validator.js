const responseHandler = require("../utils/responseHandler")

async function validateCategory(req,res,next) {
    try{
        if(!req.body.name) return responseHandler.error({res, statusCode: 500, message: "Must be category name feild required"})
        
        if(!req.user) return responseHandler.error({res, statusCode: 500, message: "Do not allow admin"})

        next()
    }catch ( error ){
        return responseHandler.error({res, statusCode: 500, message: "Category validate error", error})
    }


}

module.exports = {
    validateCategory
}