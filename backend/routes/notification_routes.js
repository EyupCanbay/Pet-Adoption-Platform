const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notification_contoller')
const { checkUser } = require('../middleware/auth_middleware')


router.get('/', checkUser, notificationController.getNotifications)
router.delete('/:notification_id', checkUser, notificationController.deleteNotifications)


module.exports = router