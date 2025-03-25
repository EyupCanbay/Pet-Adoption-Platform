const Enum = require("../config/enum")
const responseHandler = require("../utils/responseHandler")
const Auditlog  = require('../utils/auditlog_save.js');
const { User, LostPetListing, Comment } = require('../models/index.js')
const { validateObjectId } = require('../validators/object_validate.js')
const mongoose = require("mongoose");

async function createComment(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = validateObjectId(req.user._id);
        const listingId = validateObjectId(req.params.listing_id);

        if (!userId || !listingId) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.BAD_REQUEST,
                message: "User or listing id is required",
            });
        }

        const lostListingComment = await Comment.create(
            [
                {
                    user_id: userId,
                    lost_listing_id: listingId,
                    content: req.body.content,
                },
            ],
            { session }
        );

       await LostPetListing.findByIdAndUpdate(
            listingId,
            { $push: { comment_id: lostListingComment[0]._id } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();
        
        Auditlog.info(req.user?.userName, "Comment", "Post", "Create a comment");
        return responseHandler.success({
            res,
            statusCode: Enum.HTTP_CODES.OK,
            message: "Successfully created a comment and updated the listing",
            data: lostListingComment[0],
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR,
            message: "Failed to create comment or update the listing",
            error,
        });
    }
}


module.exports = {
    createComment
}