const express = require('express');
const authController = require('../controllers/auth_controller');
const { validateRegister } = require('../validators/auth_validator');
const router = express.Router();

router.post('/register', validateRegister, authController.register);




module.exports = router;