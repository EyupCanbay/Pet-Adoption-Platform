const { User, Address } = require('../models/index');
const responseHandler = require('../utils/responseHandler');
const { body } = require('express-validator');

const validateUserData = (user, res, req, next) => {
    if (!user) return { valid: false, message: 'User data is required' };

    const requiredFields = ['email', 'name', 'surname', 'phoneNumber'];
    for (let field of requiredFields) {
        if (!user[field]) {
            return responseHandler.error({res, statusCode:400,message: `Missing required field: ${field}`});
        }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        return responseHandler.error({res, statusCode:400, message: `Invalid email format`});
    }

    if (!/^\+?[0-9]{10,15}$/.test(user.phoneNumber)) {
        return responseHandler.error({res, statusCode:400,message: `Invalid phone number format`});
    }

   next()
}

const validateAddressData = async (address,res,req,next) => {
    if (!address) return responseHandler.error({res, statusCode:400,message: `Address data is required`});

    const requiredFields = ['country', 'city', 'state', 'neighborhood'];
    for (let field of requiredFields) {
        if (!address[field]) {
            return responseHandler.error({res, statusCode:400,message: `Missing required field: ${field}`});
        }
    }

   next()
};

module.exports = { validateUserData, validateAddressData };
