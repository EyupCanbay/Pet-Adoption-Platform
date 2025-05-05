const express = require('express')
const userController = require('../controllers/users_controller')
const reportController = require('../controllers/report_controller')
const { checkUser, checkRole } = require('../middleware/auth_middleware')
const { validateUserData, validateAddressData } = require('../validators/user_validator')
const { validateReportData } = require('../validators/report_ validator')
const router = express.Router()

router.get('/', checkUser, checkRole(["ADMIN","USER"]), userController.getAllUsers)
router.get('/me',checkUser, userController.getUserMe)
router.put('/me', checkUser, validateUserData, validateAddressData ,userController.putUserMe)
router.get('/me/bookmarks', checkUser, userController.getUserBookmarks )
router.delete('/me/bookmarks/:listing_id', checkUser, userController.deleteUserBookmarks)
router.get('/me/block',checkUser, userController.getBlockUsers)
router.get('/:user_id',checkUser, checkRole(["ADMIN","USER"]), userController.getUser)

router.delete('/block/:user_id', checkUser, userController.deleteUserBlock)
router.put('/block/:user_id', checkUser, checkRole(["USER"]), userController.blockedUser)

router.post('/report/:user_id',checkUser, validateReportData, reportController.reportUser)
router.get('/report/admin',checkUser, reportController.getAllReport)
router.put('/report/admin/:user_id',checkUser, reportController.forbiddenUser)

module.exports = router;