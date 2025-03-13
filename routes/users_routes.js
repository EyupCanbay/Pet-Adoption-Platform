const express = require('express')
const userController = require('../controllers/users_controller')
const { checkUser, checkRole } = require('../middleware/auth_middleware')
const router = express.Router()

router.get('/', checkUser, checkRole(["ADMIN"]), userController.getAllUsers)

module.exports = router;