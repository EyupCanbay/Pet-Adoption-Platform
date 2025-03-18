const { SubCategory } = require('../models/index');
const subCategory = require('../models/subCategory');
const responseHandler = require('../utils/responseHandler');

const getAllSubCategories = async (req, res) => {
    try {
        const subcategories = await SubCategory.find();

        if(!subCategory) return responseHandler.error({res, statusCode: 404, message: "Was not created any sub category "})

        return responseHandler.success({res, statusCode: 201, message: "Successfuly fetched sub categories", data:subcategories})
    } catch (error) {
        return responseHandler.error({res, statusCode: 500, message: "Did not fetch sub categories", error})
    }
};












module.exports = {
    getAllSubCategories
}