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

async function getCategories(req, res, next) {
    try {
        const categories = await Category.find()
        if(!categories) return responseHandler.error({res, statusCode: 404, message: "Category not found"})
        return responseHandler.success({res, statusCode: 200, message: "Categories retrieved successfully", data: categories})
    } catch (error) {
        return responseHandler.error({res, statusCode: 500, message: "Failed to retrieve categories", error})
    }
}

async function updateCategory(req, res, next) {
    try {
        const categoryId = req.params.category_id;
        const updatedData = {
            name: req.body.name,
            description: req.body.description,
        };

        const category = await Category.findByIdAndUpdate(categoryId, updatedData, { new: true });

        if (!category) return responseHandler.error({ res, statusCode: 404, message: "Category not found" });

        return responseHandler.success({ res, statusCode: 200, message: "Category updated successfully", data: category });
    } catch (error) {
        return responseHandler.error({ res, statusCode: 500, message: "Failed to update category", error });
    }
}

module.exports = {
    createCategory,
    getCategories,
    updateCategory
}

