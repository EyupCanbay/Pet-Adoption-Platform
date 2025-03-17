const { Category } = require('../models/index')
const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/category_controller')
const { validateCategory } = require('../validators/category_validator') 
const { checkUser } = require('../middleware/auth_middleware')


router.get('/', categoryController.getCategories)
router.post('/', checkUser, validateCategory, categoryController.createCategory)
router.put('/:category_id', categoryController.updateCategory)
router.delete('/:category_id', categoryController.deleteCategory)
router.post('/:category_id/subcategory', checkUser, categoryController.createSubcategory)




module.exports = router