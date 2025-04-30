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

async function getAllPetListingComments(req, res, next) {
    try {
        const listingId = validateObjectId(req.params.listing_id); // İlan ID'si kontrol ediliyor
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const comments = await PetListing.aggregate([
            { $match: { _id: listingId } }, // İlan ID'si ile eşleştir
            {
                $lookup: {
                    from: "comments",
                    localField: "comment_id",
                    foreignField: "_id",
                    as: "comments"
                }
            },
            {
                $unwind: {
                    path: "$comments",
                    preserveNullAndEmptyArrays: true // Yorumu olmayan ilanlar için boş bırak
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comments.user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "comments._id": 1,
                    "comments.createdAt": 1,
                    "comments.content": 1,
                    "user.userName": { $ifNull: ["$user.userName", "Anonim"] }, 
                }
            },
            { $sort: { "comments.createdAt": -1 } }, 
            { $skip: skip },
            { $limit: limit }
        ]);

        return responseHandler.success({
            res,
            statusCode: Enum.HTTP_CODES.OK,
            message: "Successfully fetched comments",
            data: comments
        });
    } catch (error) {
        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR,
            message: "Failed to fetch comments",
            error
        });
    }
}



module.exports = {
    createPetListingComment,
    getAllPetListingComments
}