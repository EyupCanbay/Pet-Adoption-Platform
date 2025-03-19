const express = require('express')
const router = express.Router()
const listingController = require('../controllers/listing_controller')
const { checkUser } = require('../middleware/auth_middleware')

router.post('/',checkUser, listingController.createListing)


module.exports = router