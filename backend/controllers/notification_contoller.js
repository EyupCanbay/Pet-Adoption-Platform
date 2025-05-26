const Enum = require("../config/enum.js")
const responseHandler = require("../utils/responseHandler.js")
const Auditlog  = require('../utils/auditlog_save.js');
const { Notification } = require('../models/index.js')
const { validateObjectId } = require('../validators/object_validate.js')
const mongoose = require("mongoose");



async function getNotifications(req,res,next) {
    const userId = validateObjectId(req.user._id)
    try {   

        const notifications = await Notification.find({recipient_id: userId})

        responseHandler.success({res, statusCode: Enum.HTTP_CODES.OK, message: "Succesfuly fetch all notifications", data: notifications})
    } catch (error) {
        responseHandler.error({res, statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR, message: "do not fetch notifications", error})
    }

}

async function deleteNotifications(req,res,next) {
    const notificationId = validateObjectId(req.params.notification_id)
    
    try {   
        await Notification.deleteOne({_id: notificationId})

        responseHandler.success({res, statusCode: Enum.HTTP_CODES.OK, message: "Succesfuly delete the notification"})
    } catch (error) {
        responseHandler.error({res, statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR, message: "do not delete notification", error})
    }
}


module.exports = {
    getNotifications,
    deleteNotifications
}