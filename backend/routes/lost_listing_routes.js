const express = require('express')
const router = express.Router()
const listingController = require('../controllers/listing_controller')
const { checkUser } = require('../middleware/auth_middleware')

router.post('/',checkUser , listingController.createLostListing)
router.get('/',checkUser , listingController.getAllLostListing)
router.get('/:listing_id', checkUser, listingController.getLostListing)
router.delete('/:listing_id', checkUser, listingController.deleteLostListing)



module.exports = router