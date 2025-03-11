const jwt = require("jsonwebtoken");
const { User } = require("../models/index.js")
const ResponseHandler = require("../utils/responseHandler");

async function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return ResponseHandler.error({ res, statusCode: 500, message: "Token verify edilemedi" });
    }
}

async function checkUser(req, res, next) {
    try {
        const token = req.cookies.jwt || "";

        if (!token) return ResponseHandler.error({ res, statusCode: 401, message: "Token bulunamadı" });

        const decodedToken = await verifyToken(token);
        const user = await User.findById(decodedToken.user_id).select("name surname userName email role ");

        if (!user) return ResponseHandler.error({ res, statusCode: 401, message: "Kullanıcı bulunamadı" });

        req.user = user;
        next();
    } catch (error) {
        return ResponseHandler.error({ res, statusCode: 500, message: "kullanıcı doğrulanamadı", error});
    }
}


module.exports = {
    checkUser
}