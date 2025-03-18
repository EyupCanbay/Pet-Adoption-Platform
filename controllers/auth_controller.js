const { User } = require('../models/index.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const responseHandler = require('../utils/responseHandler');

async function register(req, res) {
  try{
    const hashPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hashPassword,
      name: req.body.name,
      surname: req.body.surname,
      phoneNumber: req.body.phoneNumber,
      role: req.role || 'USER'
    })
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    })
    
    Auditlog.info(req.user?.userName,"Auth","Post","Create a user")
    return responseHandler.success({res, statusCode:201, message:"Kullanıcı başarıyla kaydedildi", data:{user, token}});
  } catch(error) {
    return responseHandler.error({res, statusCode:500, message:"Kullanıcı kayıt işlemi sırasında hata oluştu", error});
  }
}

async function login(req, res) {
  try {

    const user = await User.findOne({ email: req.body.email }).select("-password");

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    })

    Auditlog.info(req.user?.userName,"Auth","Get","Fetch a user")
    return responseHandler.success({res, statusCode:200, message:"Kullanıcı başarıyla giriş yaptı", data:{user,token}});
  } catch (error) {
    return responseHandler.error({res, statusCode:500, message:"Kullanıcı giriş işlemi sırasında hata oluştu", error}); 
  }

}

async function logout(req, res) {
  try {
    req.cookies.token = ""

    Auditlog.info(req.user?.userName,"Auth","Delete","Log out the system and delete")
    return responseHandler.success({res, statusCode:200, message:"Kullanıcı çıkışı başarıyla yapıldı"});
  } catch (error) {
    return responseHandler.error({res, statusCode:500, message:"Kullanıcı çıkış işlemi sırasında hata oluştu", error});
  }
}


module.exports = {
    register,
    login,
    logout
}