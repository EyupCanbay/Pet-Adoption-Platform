const express = require('express');
const authController = require('../controllers/auth_controller');
const { validateRegister, validateLogin } = require('../validators/auth_validator');
const { checkUser } = require('../middleware/auth_middleware')
const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.get('/login', validateLogin, authController.login);
router.get('/logout', checkUser, authController.logout)


module.exports = router;