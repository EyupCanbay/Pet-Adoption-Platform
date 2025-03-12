const { User } = require('../models/index');
const responseHandler = require('../utils/responseHandler');

async function validateRegister(req,res,next){
    try{
        const { name, surname, userName, email, password, phoneNumber } = req.body;

        if(!name || !surname || !userName || !email || !password || !phoneNumber){
            return responseHandler.error({res, statusCode:400, message: "Kullanıcı bilgileri eksik"});
        }

        if(await User.findOne({$or: [{userName}, {email}, {phoneNumber}]})){
            return responseHandler.error({res, statusCode:400, message: "Bu kullanıcı adı, email veya telefon numarası zaten kullanılmakta"});
        }

        if(!User.find()) {
            req.role = 'SUPER_ADMIN';
        }

        return next();
    } catch (error){
        return responseHandler.error({res, statusCode:500, message: "Kullanıcı bilgileri eksik", error});
    }
}


module.exports = {
    validateRegister
}