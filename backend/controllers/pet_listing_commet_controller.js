const Enum = require("../config/enum.js")
const responseHandler = require("../utils/responseHandler.js")
const Auditlog  = require('../utils/auditlog_save.js');
const { PetListing, Comment, ReplyComment } = require('../models/index.js')
const { validateObjectId } = require('../validators/object_validate.js')
const mongoose = require("mongoose");


async function createPetListingComment(req, res, next) {

    
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userId = validateObjectId(req.user._id);
        const listingId = validateObjectId(req.params.listing_id);
        
        if (!userId || !listingId || !req.body.content) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.BAD_REQUEST,
                message: "User ID, listing ID, or content is required",
            });
        }

        const petListingComment = await Comment.create(
            [
                {
                    user_id: userId,
                    pet_listing_id: listingId,
                    content: req.body.content,
                },
            ],
            { session }
        );

        await PetListing.findByIdAndUpdate(
            listingId,
            { $push: { comment_id: petListingComment[0]._id } },
            { session }
        );
        
        await session.commitTransaction();
        session.endSession();
        
        Auditlog.info(req.user?.userName, "Comment", "Post", "Create a comment for pet listing");
        
        return responseHandler.success({
            res,
            statusCode: Enum.HTTP_CODES.OK,
            message: "Successfully created a comment and updated the pet listing",
            data: petListingComment[0],
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR,
            message: "Failed to create comment or update the pet listing",
            error,
        });
    }
}


module.exports = {
    createPetListingComment
}