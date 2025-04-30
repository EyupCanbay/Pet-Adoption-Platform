const express = require('express')
const router = express.Router()
const petListingController = require('../controllers/pet_listing_controller')
const petListingCommentController = require('../controllers/pet_listing_commet_controller')
const { checkUser } = require('../middleware/auth_middleware')

router.post('/',checkUser , petListingController.createLostListing)
router.get('/', checkUser, petListingController.getAllPetListing)
router.get('/:listing_id', checkUser, petListingController.getPetListing)
router.delete('/:listing_id', checkUser, petListingController.deletePetListing)
router.post('/:listing_id/bookmarks', checkUser, petListingController.addPetListingBookmarks)
router.post('/:listing_id/comment', checkUser, petListingCommentController.createPetListingComment)


module.exports = router