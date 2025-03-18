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

async function validateSubCategory(req,res,next) {
    try{
        if(!req.body.breed) return responseHandler.error({res, statusCode: 500, message: "Must be breed feild required"})
        if(!req.body.description) return responseHandler.error({res, statusCode: 500, message: "Must be description feild required"})
        if(!req.user) return responseHandler.error({res, statusCode: 500, message: "Firstly have to login"})
        next()
    }catch (error) {
        return responseHandler.error({res, statusCode:500, message: "Subcategory validate error", error})
    }
}

module.exports = {
    validateCategory,
    validateSubCategory
}