const Enum = require("../config/enum")
const responseHandler = require("../utils/responseHandler")
const Auditlog  = require('../utils/auditlog_save.js');
const { User, LostPetListing, Comment } = require('../models/index.js')
const { validateObjectId } = require('../validators/object_validate.js')
const mongoose = require("mongoose");

async function createComment(req,res,next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = validateObjectId(req.user._id);
        const listingId = validateObjectId(req.params.listing_id);

        if (!userId || !listingId || !req.body.content) {
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

async function getAllComments(req,res,next) {
    try {
        const userId = validateObjectId(req.user._id)
        const listingId = validateObjectId(req.params.listing_id)
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const comments = await LostPetListing.aggregate([
            { $match: {_id: listingId}},
            { 
                $lookup: {
                    from: "comments",
                    localField: "comment_id",
                    foreignField: "_id",
                    as: "comments"
                }
            },
            { 
                $unwind: "$comments"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comments.user_id",
                    foreignField: "_id",
                    as: "users"
                }
            },
            { 
                $project: {
                    "comments.createdAt": 1,
                    "comments.content": 1,
                    "users.userName": 1
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ])

        return responseHandler.success({res, statusCode: Enum.HTTP_CODES.OK, message: "Successfuly fetched comments ", data: comments})
    } catch (error) {
        return responseHandler.error({res, statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR, message: "Was not fetched comments", error})
    }
}

async function deleteComment(req,res,next) {
    try {
        const userId = validateObjectId(req.user._id)
        const listingId = validateObjectId(req.params.listing_id)
        const commentId = validateObjectId(req.params.comment_id)


        const comment = await Comment.aggregate([
            { $match: {_id: commentId}},
            { 
                $lookup: {
                    from: "lostpetlistings",
                    localField: "lost_listing_id",
                    foreignField: "_id",
                    as: "lostListings"
                }
            },
            { $unwind: "$lostListings" },
            {
                $project: {
                    user_id:1,
                    "lostListings.user_id": 1,

                }
            }
        ])

        if(comment.user_id.toString() === userId.toString()  ){
            await Comment.findByIdAndDelete({_id: commentId})

            return responseHandler.success({res, statusCode: Enum.HTTP_CODES.OK, message: "Successfuly updated comments "})      
          }
        else if(comment.lostListings.user_id.toString() !== userId.toString()){
            await Comment.findByIdAndDelete({_id: commentId})
            return responseHandler.success({res, statusCode: Enum.HTTP_CODES.OK, message: "Successfuly updated comments "}) 
        }
        else if("ADMIN" !== req.user.role){
            await Comment.findByIdAndDelete({_id: commentId})

            return responseHandler.success({res, statusCode: Enum.HTTP_CODES.OK, message: "Successfuly updated comments "})       
         }
        else {
            return responseHandler.error({res, statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR, message: "Was not updated comments", error})

        }
    }catch (error) {

        return responseHandler.error({res, statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR, message: "Was not updated comments", error})
    }
}


module.exports = {
    createComment,
    getAllComments,
    deleteComment
}