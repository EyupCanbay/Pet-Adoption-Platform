const express = require('express')
const searchController = require('../controllers/search_controller')
const router = express.Router()
const {checkUser} = require('../middleware/auth_middleware')

router.get('/', searchController.searching)

module.exports = router