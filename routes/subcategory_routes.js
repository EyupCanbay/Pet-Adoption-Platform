const express = require('express')
const { SubCategory } = require('../models/index')
const subCategoryController = require('../controllers/subcategory_controller')

const router = express.Router()

router.get('/', subCategoryController.getAllSubCategories)
router.get('/:subcategory_id', subCategoryController.getSubCategory)
router.put('/:subcategory_id', subCategoryController.updateSubCategory)

module.exports = router

