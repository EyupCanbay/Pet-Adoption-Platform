const jwt = require("jsonwebtoken");
const { User } = require("../models/index.js")
const ResponseHandler = require("../utils/responseHandler");

function verifyToken(token) {
    try {       
        return   jwt.verify(token,process.env.JWT_SECRET); 
    } catch (err) {
        return ResponseHandler.error({ res, statusCode: 500, message: "Token verify edilemedi" });
    }
}

async function checkUser(req, res, next) {
    try {
        let token = req.cookies.token || "";
        
        if (!token) return ResponseHandler.error({ res, statusCode: 401, message: "Token bulunamadı" });
        const decodedToken = await verifyToken(token);

        const user = await User.findById(decodedToken.id).select("_id name surname userName email role ");

        if (!user) return ResponseHandler.error({ res, statusCode: 401, message: "Kullanıcı bulunamadı" });

        req.user = user;
        req.role = user.role
        console.log(req.user)
        next();
    } catch (error) {
        return ResponseHandler.error({ res, statusCode: 500, message: "kullanıcı doğrulanamadı", error});
    }
}

function checkRole(requiredRole){
    return (req,res,next) => {
        try {
            const userRole = req.role
            if(!userRole) ResponseHandler.error({res, statusCode:500, message: "User role not found" })

            if (!requiredRole.some(role => userRole.includes(role))) return ResponseHandler.error({ res, statusCode: 403, message: "Not permission you are admin" });
                
            next()
        }catch (error){
            return ResponseHandler.error({res, statusCode:500, message: "Role middleware error" })
            }
        }
}



module.exports = {
    checkUser,
    checkRole
}