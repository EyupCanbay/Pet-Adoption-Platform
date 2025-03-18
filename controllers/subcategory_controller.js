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

const getSubCategory = async (req, res) => {
    try {
        const id = req.params.subcategory_id;
        const subcategory = await SubCategory.findById(id);

        if (!subcategory) return responseHandler.error({ res, statusCode: 404, message: "Sub category not found" });

        return responseHandler.success({ res, statusCode: 200, message: "Successfully fetched sub category", data: subcategory });
    } catch (error) {
        return responseHandler.error({ res, statusCode: 500, message: "Did not fetch sub category", error });
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const id = req.params.subcategory_id;
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, {
            breed: req.body.breed,
            description: req.body.description,
            created_by: req.user.userName
          },{ new: true }
        );

        if (!updatedSubCategory) return responseHandler.error({ res, statusCode: 404, message: "Sub category not found" });

        return responseHandler.success({ res, statusCode: 200, message: "Successfully updated sub category", data: updatedSubCategory });
    } catch (error) {
        return responseHandler.error({ res, statusCode: 500, message: "Did not update sub category", error });
    }
};


const deleteSubCategory = async (req, res) => {
    try {
        const id = req.params.subcategory_id;
        const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

        if (!deletedSubCategory) return responseHandler.error({ res, statusCode: 404, message: "Sub category not found" });

        return responseHandler.success({ res, statusCode: 200, message: "Successfully deleted sub category", data: deletedSubCategory });
    } catch (error) {
        return responseHandler.error({ res, statusCode: 500, message: "Did not delete sub category", error });
    }
};

module.exports = {
    getAllSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory
};




