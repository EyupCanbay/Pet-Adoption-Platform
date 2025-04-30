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
router.get('/:listing_id/comment', checkUser, petListingCommentController.getAllPetListingComments)
router.delete('/:listing_id/comment/:comment_id', checkUser, petListingCommentController.deletePetListingComment)
router.put('/:listing_id/comment/:comment_id', checkUser, petListingCommentController.updatePetListingComment)
router.post('/:listing_id/comment/:comment_id/reply_comment', checkUser, petListingCommentController.createReplyComment)
router.get('/:listing_id/comment/:comment_id/reply_comment', checkUser, petListingCommentController.getAllSubComments)
router.delete('/:listing_id/comment/:comment_id/reply_comment/:reply_id', checkUser, petListingCommentController.deleteSubComment)
router.put('/:listing_id/comment/:comment_id/reply_comment/:reply_id', checkUser, petListingCommentController.updatePetListingSubComment)


module.exports = router