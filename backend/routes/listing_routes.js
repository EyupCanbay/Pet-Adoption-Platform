const express = require('express')
const router = express.Router()
const petListingController = require('../controllers/pet_listing_controller')
const { checkUser } = require('../middleware/auth_middleware')

router.post('/',checkUser , petListingController.createLostListing)
router.get('/', checkUser, petListingController.getAllPetListing)
router.get('/:listing_id', checkUser, petListingController.getPetListing)


module.exports = router