const express = require('express')
const router = express.Router()
const petListingController = require('../controllers/pet_listing_controller')
const petListingCommentController = require('../controllers/pet_listing_commet_controller')
const { checkUser } = require('../middleware/auth_middleware')
<<<<<<< HEAD
const { validatePetListing } = require('../validators/pet_listing_validator')


router.post('/',checkUser , petListingController.createLostListing)
=======
const { sentimentAnalyzerMiddleware } = require('../middleware/sentimentAnalyzer')
const { validatePetListing } = require('../validators/pet_listing_validator')
const imageValidator = require('../middleware/image_detector')
const uploadToCloudinary = require('../middleware/upload_to_cloudinary')

router.post('/',checkUser , imageValidator, uploadToCloudinary, petListingController.createLostListing)
>>>>>>> backend
router.get('/', petListingController.getAllPetListing)
router.get('/:listing_id', petListingController.getPetListing)
router.delete('/:listing_id', checkUser, petListingController.deletePetListing)
router.put('/:listing_id', checkUser, validatePetListing, petListingController.updatePetListing)
router.post('/:listing_id/bookmarks', checkUser, petListingController.addPetListingBookmarks)
<<<<<<< HEAD
router.post('/:listing_id/comment', checkUser, petListingCommentController.createPetListingComment)
=======
router.post('/:listing_id/comment', checkUser, sentimentAnalyzerMiddleware, petListingCommentController.createPetListingComment)
>>>>>>> backend
router.get('/:listing_id/comment', petListingCommentController.getAllPetListingComments)
router.delete('/:listing_id/comment/:comment_id', checkUser, petListingCommentController.deletePetListingComment)
router.put('/:listing_id/comment/:comment_id', checkUser, petListingCommentController.updatePetListingComment)
router.post('/:listing_id/comment/:comment_id/reply_comment', checkUser, petListingCommentController.createReplyComment)
router.get('/:listing_id/comment/:comment_id/reply_comment', petListingCommentController.getAllSubComments)
router.delete('/:listing_id/comment/:comment_id/reply_comment/:reply_id', checkUser, petListingCommentController.deleteSubComment)
router.put('/:listing_id/comment/:comment_id/reply_comment/:reply_id', checkUser, petListingCommentController.updatePetListingSubComment)


module.exports = router