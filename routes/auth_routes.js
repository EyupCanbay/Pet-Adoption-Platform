const express = require('express');
const authController = require('../controllers/auth_controller');
const { validateRegister, validateLogin } = require('../validators/auth_validator');
const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.get('/login', validateLogin, authController.login);


module.exports = router;