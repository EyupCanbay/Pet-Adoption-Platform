const express = require('express')
const adminController = require('../controllers/admin_controller')
const { checkUser, checkRole } = require('../middleware/auth_middleware')

const router = express.Router()
router.get('/auditlogs', checkUser, checkRole(['ADMIN']), adminController.getAuditlogs)


module.exports = router;