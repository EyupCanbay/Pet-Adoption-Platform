const express = require('express')
const router = express.Router()
const listingController = require('../controllers/listing_controller')
const commentController = require('../controllers/lost_lisitng_comment_controller')
const { checkUser } = require('../middleware/auth_middleware')
const { validateLostPetListing } = require('../validators/lost_listing_validator')

router.post('/', checkUser, listingController.createLostListing)
router.get('/', listingController.getAllLostListing)
router.get('/:listing_id', listingController.getLostListing)
router.delete('/:listing_id', checkUser, listingController.deleteLostListing)
router.put('/:listing_id', checkUser, validateLostPetListing, listingController.updateLostListing)
router.post('/:listing_id/bookmarks', checkUser, listingController.addBookmarks)
router.post('/:listing_id/comment', checkUser, commentController.createComment)
router.get('/:listing_id/comment', commentController.getAllComments)
router.delete('/:listing_id/comment/:comment_id', checkUser, commentController.deleteComment)
router.put('/:listing_id/comment/:comment_id', checkUser, commentController.updateLostListingSubComment)
router.post('/:lisitng_id/comment/:comment_id/reply_comment', checkUser, commentController.createReplyComment)
router.get('/:lisitng_id/comment/:comment_id/reply_comment', commentController.getAllSubComments)
router.delete('/:lisitng_id/comment/:comment_id/reply_comment/:reply_id', checkUser, commentController.deleteSubComment)
router.delete('/:lisitng_id/comment/:comment_id/reply_comment/:reply_id', checkUser, commentController.updateLostListingComment)


module.exports = router