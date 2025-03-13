const express = require('express')
const userController = require('../controllers/users_controller')
const { checkUser, checkRole } = require('../middleware/auth_middleware')
const router = express.Router()

router.get('/', checkUser, checkRole(["ADMIN","USER"]), userController.getAllUsers)
router.get('/:user_id',checkUser, checkRole(["ADMIN","USER"]), userController.getUser)
router.put('/:user_id', checkUser, checkRole(["USER"]), userController.blockedUser)

module.exports = router;