const express = require('express')
const { SubCategory } = require('../models/index')
const subCategoryController = require('../controllers/subcategory_controller')

const router = express.Router()



router.get('/', subCategoryController.getAllSubCategories)
router.




module.exports = router

