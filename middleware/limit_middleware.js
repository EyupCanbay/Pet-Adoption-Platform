const { User } = require('../models/user');
const responseHandler = require('../utils/responseHandler');

const checkBanStatus = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await User.findById({email: email});

        if (!user) return responseHandler.error({res, statusCode: 404, message: "User not found"})

        if (user.forbiddenTime && new Date() < user.forbiddenTime) {
            return responseHandler.success({res, statusCode: 500, message: "User forbid now", data: user.forbiddenTime})
        }

        if (user.forbiddenTime && new Date() >= user.forbiddenTime) {
            await User.findByIdAndUpdate(user._id, {
                is_active: true,
                forbiddenTime: null
            });
        }

        next();
    } catch (error) {
        return responseHandler.error({res, statusCode: 500, message:"Ban middleware error", error})
    }
};


module.exports = {
    checkBanStatus
}