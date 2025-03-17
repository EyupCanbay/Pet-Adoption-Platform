const { Category } = require('../models/index')
const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/category_controller')
const { validateCategory } = require('../validators/category_validator') 
const { checkUser } = require('../middleware/auth_middleware')


router.get('/', categoryController.getCategories)
router.post('/', checkUser, validateCategory, categoryController.createCategory)




module.exports = router