const responseHandler = require("../utils/responseHandler")
const { Category } = require('../models/index')

async function createCategory(req,res,next) {
    try {
        const category = await Category.create({
            name: req.body.name,
            description: req.body.description,
            created_by: req.user.userName
        })

        return responseHandler.success({res, statusCode: 201, message: "Successfuly added category", data: category})
    } catch (error) {
        return responseHandler.error({res, statusCode:500, message: "Did not create category", error})
    }
}


module.exports = {
    createCategory
}