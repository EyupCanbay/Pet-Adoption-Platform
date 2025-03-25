const express = require('express')
const router = express.Router()
const listingController = require('../controllers/listing_controller')
const commentController = require('../controllers/comment_controller')
const { checkUser } = require('../middleware/auth_middleware')

router.post('/',checkUser , listingController.createLostListing)
router.get('/',checkUser , listingController.getAllLostListing)
router.get('/:listing_id', checkUser, listingController.getLostListing)
router.delete('/:listing_id', checkUser, listingController.deleteLostListing)
router.post('/:listing_id/bookmarks', checkUser, listingController.addBookmarks)
router.post('/:listing_id/comment', checkUser, commentController.createComment)
router.get('/:listing_id/comment', checkUser, commentController.getAllComments)
router.delete('/:listing_id/comment/:comment_id', checkUser, commentController.deleteComment)


module.exports = router