const Enum = require("../config/enum.js")
const responseHandler = require("../utils/responseHandler.js")
const Auditlog  = require('../utils/auditlog_save.js');
const { LostPetListing, Comment, ReplyComment } = require('../models/index.js')
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
                    "comments._id": 1,
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

        if(comment.user_id.toString() === userId.toString()){
            await Comment.findByIdAndDelete({ _id: commentId })
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

async function updateLostListingComment(req, res, next) {
    try {
        const commentId = validateObjectId(req.params.comment_id); 
        const userId = validateObjectId(req.user._id); 
        const content = req.body.content; 

        if (!content || content.trim() === "") {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.BAD_REQUEST,
                message: "Content is required to update the comment.",
            });
        }

        const comment = await Comment.findById(commentId).populate('lost_listing_id');

        if (!comment) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.NOT_FOUND,
                message: "Comment not found.",
            });
        }

        const isAuthorized =
            comment.user_id.toString() === userId.toString() || 
            req.user.role === "ADMIN" ||
            (comment.lost_listing_id?.user_id?.toString() === userId.toString());

        if (!isAuthorized) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.FORBIDDEN,
                message: "You do not have permission to update this comment.",
            });
        }

        comment.content = content;
        await comment.save();

        return responseHandler.success({
            res,
            statusCode: Enum.HTTP_CODES.OK,
            message: "Comment successfully updated.",
            data: comment,
        });
    } catch (error) {
        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR,
            message: "Failed to update the comment.",
            error,
        });
    }
}

async function createReplyComment(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const userId = req.user?._id;
        const commentId = req.params.comment_id; 
        const lostListing = req.params.listing_id;
        const content = req.body.content; 

        if (!userId || !commentId || !content) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.BAD_REQUEST,
                message: "User ID, comment ID ve içerik gereklidir.",
            });
        }

        const replyComment = await ReplyComment.create(
            [
                {
                    user_id: userId,
                    comment_id: commentId,
                    content: content,
                },
            ],
            { session }
        );

        await Comment.findByIdAndUpdate(
            commentId,
            { $push: { reply_comment_id: replyComment[0]._id } }, 
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        Auditlog.info(req.user?.userName, "ReplyComment", "Post", "Create a reply comment");

        return responseHandler.success({
            res,
            statusCode: Enum.HTTP_CODES.OK,
            message: "Succesfuly created the reply comment",
            data: replyComment[0],
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR,
            message: "Reply comment oluşturulamadi veya ana yorum güncellenemedi.",
            error,
        });
    }
}

async function getAllSubComments(req, res, next) {
    try {
        const commentId = validateObjectId(req.params.comment_id); 
        const page = Number(req.query.page) || 1; 
        const limit = Number(req.query.limit) || 10; 
        const skip = (page - 1) * limit; 

        const subComments = await Comment.aggregate([
            { $match: { _id: commentId } },
            {
                $lookup: {
                    from: "replycomments", 
                    localField: "reply_comment_id", 
                    foreignField: "_id", 
                    as: "subComments" 
                }
            },
            { $unwind: "$subComments" }, 
            {
                $lookup: {
                    from: "users", 
                    localField: "subComments.user_id",
                    foreignField: "_id", 
                    as: "userDetails" 
                }
            },
            { $unwind: "$userDetails" }, 
            {
                $project: { 
                    "subComments._id": 1,
                    "subComments.content": 1,
                    "subComments.createdAt": 1,
                    "userDetails.userName": 1,
                    "userDetails.profilePhoto": 1
                }
            },
            { $sort: { "subComments.createdAt": -1 } }, 
            { $skip: skip }, 
            { $limit: limit } 
        ]);

        return responseHandler.success({
            res,
            statusCode: Enum.HTTP_CODES.OK,
            message: "Successfully fetched subComments",
            data: subComments
        });
    } catch (error) {
        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR,
            message: "Failed to fetch subComments",
            error
        });
    }
}

async function deleteSubComment(req, res, next) {
    try {

        const userId = validateObjectId(req.user._id); 

        const commentId = validateObjectId(req.params.comment_id); 

        const subCommentId = validateObjectId(req.params.reply_id); 


        const subComment = await ReplyComment.aggregate([
            { $match: { _id: subCommentId } }, 
            {
                $lookup: {
                    from: "comments", 
                    localField: "comment_id", 
                    foreignField: "_id",
                    as: "parentComment"
                }
            },
            { $unwind: "$parentComment" }, 
            {
                $project: {
                    user_id: 1, 
                    "parentComment.user_id": 1 
                }
            }
        ]);

        if (!subComment || subComment.length === 0) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.NOT_FOUND,
                message: "Sub-comment not found"
            });
        }

        const subCommentData = subComment[0];

        // permission check

        if (
            subCommentData.user_id.toString() === userId.toString() || 
            subCommentData.parentComment.user_id.toString() === userId.toString() || 
            req.user.role === "ADMIN" 
        ) {
            await ReplyComment.findByIdAndDelete({ _id: subCommentId }); // Alt yorumu sil

            return responseHandler.success({
                res,
                statusCode: Enum.HTTP_CODES.OK,
                message: "Successfully deleted the sub-comment"
            });
        } else {

            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.FORBIDDEN,
                message: "You do not have permission to delete this sub-comment"
            });
        }

    } catch (error) {
        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR,
            message: "Failed to delete the sub-comment",
            error
        });
    }
}

async function updateLostListingSubComment(req, res, next) {
    try {
        const subCommentId = validateObjectId(req.params.reply_id); 
        const userId = validateObjectId(req.user._id); 
        const content = req.body.content; 

        if (!content || content.trim() === "") {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.BAD_REQUEST,
                message: "Content is required to update the sub-comment.",
            });
        }

        
        const subComment = await ReplyComment.aggregate([
            { $match: { _id: subCommentId } }, 
            {
                $lookup: {
                    from: "comments", 
                    localField: "comment_id",
                    foreignField: "_id",
                    as: "commentDetails",
                },
            },
            { $unwind: "$commentDetails" }, 
            {
                $lookup: {
                    from: "lostpetlistings", 
                    localField: "commentDetails.lost_listing_id",
                    foreignField: "_id",
                    as: "lostListingDetails",
                },
            },
            { $unwind: "$lostListingDetails" }, 
            {
                $lookup: {
                    from: "users", 
                    localField: "lostListingDetails.user_id",
                    foreignField: "_id",
                    as: "listingOwnerDetails",
                },
            },
            { $unwind: "$listingOwnerDetails" },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    content: 1,
                    createdAt: 1,
                    "commentDetails.user_id": 1,
                    "lostListingDetails.user_id": 1,
                },
            },
        ]);

        if (!subComment || subComment.length === 0) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.NOT_FOUND,
                message: "Sub-comment not found.",
            });
        }

        const commentDetails = subComment[0].commentDetails;
        const lostListingDetails = subComment[0].lostListingDetails;

        
        const isAuthorized =
            subComment[0].user_id.toString() === userId.toString() || 
            req.user.role === "ADMIN" ||
            commentDetails.user_id.toString() === userId.toString() ||
            lostListingDetails.user_id.toString() === userId.toString();

        if (!isAuthorized) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.FORBIDDEN,
                message: "You do not have permission to update this sub-comment.",
            });
        }

        
        const updatedSubComment = await ReplyComment.findByIdAndUpdate(subCommentId, { content }, { new: true });

        return responseHandler.success({
            res,
            statusCode: Enum.HTTP_CODES.OK,
            message: "Sub-comment successfully updated.",
            data: updatedSubComment,
        });
    } catch (error) {
        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR,
            message: "Failed to update the sub-comment.",
            error,
        });
    }
}

module.exports = {
    createComment,
    getAllComments,
    deleteComment,
    createReplyComment,
    getAllSubComments,
    deleteSubComment,
    updateLostListingSubComment,
    updateLostListingComment
}