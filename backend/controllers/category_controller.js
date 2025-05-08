const responseHandler = require("../utils/responseHandler")
const { Category, SubCategory } = require('../models/index')
const Auditlog = require('../utils/auditlog_save')

async function createCategory(req,res,next) {
    try {
        const category = await Category.create({
            name: req.body.name,
            description: req.body.description,
            created_by: req.user.userName
        })

        Auditlog.info(req.user?.userName,"Category","Post","Create a category")
        return responseHandler.success({res, statusCode: 201, message: "Successfuly added category", data: category})
    } catch (error) {
        return responseHandler.error({res, statusCode:500, message: "Did not create category", error})
    }
}

async function getCategories(req, res, next) {
    try {
        const categories = await Category.find()
        if(!categories) return responseHandler.error({res, statusCode: 404, message: "Category not found"})
            
        Auditlog.info(req.user?.userName,"Category","Get","Fetch all category")
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

        Auditlog.info(req.user?.userName,"Category","Put","Update a category")
        return responseHandler.success({ res, statusCode: 200, message: "Category updated successfully", data: category });
    } catch (error) {
        return responseHandler.error({ res, statusCode: 500, message: "Failed to update category", error });
    }
}

async function deleteCategory(req, res, next) {
    try {
        const categoryId = req.params.category_id;
        const category = await Category.findByIdAndDelete(categoryId);

        if (!category) return responseHandler.error({ res, statusCode: 404, message: "Category not found" });

        Auditlog.info(req.user?.userName,"Category","Delete","Delete a category")
        return responseHandler.success({ res, statusCode: 200, message: "Category deleted successfully"});
    } catch (error) {
        return responseHandler.error({ res, statusCode: 500, message: "Failed to delete category", error });
    }
}

async function createSubcategory(req, res, next) {
    try {
        const { category_id } = req.params;
        const { breed, description } = req.body;
        const created_by = req.user.userName;

       const subCategory = await SubCategory.create({
        breed: breed,
        description: description,
        created_by: created_by,
        category_id: category_id
       }) 

       Auditlog.info(req.user?.userName,"Category","Post","Create a sub category")
        return responseHandler.success({ res, statusCode: 201, message: "Successfully added subcategory", data: subCategory });
    } catch (error) {
        return responseHandler.error({ res, statusCode: 500, message: "Failed to create subcategory", error });
    }
}

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    createSubcategory
}



