const express = require('express')
const router = express.Router()
const petListingController = require('../controllers/pet_listing_controller')
const { checkUser } = require('../middleware/auth_middleware')

router.post('/',checkUser , petListingController.createLostListing)


module.exports = router