const { User } = require('../models/index');
const responseHandler = require('../utils/responseHandler');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

async function validateRegister(req,res,next){
    try{
        const { name, surname, userName, email, password, phoneNumber } = req.body;

        await Promise.all([
            body('userName')
            .isString()
            .withMessage('Username must be a string')
            .isLength({ min: 3, max: 20 })
            .withMessage('Username must be between 3 and 20 characters')
            .run(req),
            body('email')
            .isEmail()
            .withMessage('Must be a valid email address')
            .run(req),
            body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/\d/)
            .withMessage('Password must contain at least one number')
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter')
            .run(req),
            body('name')
            .isString()
            .withMessage('Name must be a string')
            .isLength({ min: 1 })
            .withMessage('Name is required')
            .run(req),
            body('surname')
            .isString()
            .withMessage('Surname must be a string')
            .isLength({ min: 1 })
            .withMessage('Surname is required')
            .run(req),
            body('phoneNumber')
            .isMobilePhone()
            .withMessage('Must be a valid phone number')
            .run(req)
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseHandler.error({ res, statusCode: 400, message: "Validation errors", errors: errors.array() });
        }

        if(!name || !surname || !userName || !email || !password || !phoneNumber) return responseHandler.error({res, statusCode:400, message: "Kullanıcı bilgileri eksik"});

        if(await User.findOne({$or: [{userName}, {email}, {phoneNumber}]})) return responseHandler.error({res, statusCode:400, message: "Bu kullanıcı adı, email veya telefon numarası zaten kullanılmakta"});

        return next();
    } catch (error){
        return responseHandler.error({res, statusCode:500, message: "Kullanıcı bilgileri eksik", error});
    }
}

async function validateLogin(req,res,next){
    try{
        const { email, password } = req.body;

        if(!email || !password) return responseHandler.error({res, statusCode:400, message: "Kullanıcı bilgileri eksik"});

        const user = await User.findOne({email: email})
        if(!user) return responseHandler.error({res, statusCode:400, message: "Kullanıcı bulunamadı"});

        if(!bcrypt.compareSync(password, user.password)) return responseHandler.error({res, statusCode:400, message: "kullanıcı şifresi veya emaili hatalı"});

        return next();
    } catch (error){
        return responseHandler.error({res, statusCode:500, message: "Kullanıcı bilgileri eksik", error});
    }
}


module.exports = {
    validateRegister,
    validateLogin
}