const express = require('express')
const adminController = require('../controllers/admin_controller')
const { checkUser, checkRole } = require('../middleware/auth_middleware')

const router = express.Router()
router.get('/auditlogs', checkUser, checkRole(['ADMIN']), adminController.getAuditlogs)
router.put('/changing_role/:user_id', checkUser,checkRole(['ADMIN']), adminController.updateRole)


module.exports = router;