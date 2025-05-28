const Enum = require("../config/enum.js")
const responseHandler = require("../utils/responseHandler.js")
const Auditlog  = require('../utils/auditlog_save.js');
const { PetListing, Comment, ReplyComment, Notification} = require('../models/index.js')
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
                    adoption_listing_id: listingId,
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
        
        const resipent = await PetListing.find({_id : listingId}) 

 
        const notification = await Notification.create({
            recipient_id: resipent[0].user_id,
            initiator_id: userId,
            petListing_id: listingId,
            type: "comment",
            message: petListingComment[0].content
        })
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
        Auditlog.info(req.user?.userName, "PetListingComment", "GET", "Get all comment")

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

async function deletePetListingComment(req, res, next) {
    try {
        const userId = validateObjectId(req.user._id);
        const commentId = validateObjectId(req.params.comment_id);

        const comment = await Comment.aggregate([
            { $match: { _id: commentId } },
            {
                $lookup: {
                    from: "petlistings",
                    localField: "adoption_listing_id",
                    foreignField: "_id",
                    as: "petListings"
                }
            },
            { $unwind: "$petListings" },
            {
                $project: {
                    user_id: 1,
                    "petListings.user_id": 1,
                }
            }
        ]);

        if (!comment.length) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.NOT_FOUND,
                message: "Comment not found"
            });
        }

        const [commentData] = comment;

        if (
            commentData.user_id.toString() === userId.toString() ||
            commentData.petListings.user_id.toString() === userId.toString() ||
            req.user.role === "ADMIN"
        ) {
            await Comment.deleteMany({
                $or: [
                    { _id: commentId },          // for major comment 
                    { comment_id: commentId }    // for sub comment
                ]
            });

            Auditlog.info(req.user?.userName, "PetListingComment", "DELETE", "Delete comment")

            return responseHandler.success({
                res,
                statusCode: Enum.HTTP_CODES.OK,
                message: "Successfully deleted the comment and its sub-comments"
            });
        }

        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.FORBIDDEN,
            message: "You do not have permission to delete this comment"
        });
    } catch (error) {
        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR,
            message: "Failed to delete comment",
            error
        });
    }
}

async function updatePetListingComment(req, res, next) {
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

        const comment = await Comment.findById(commentId).populate('adoption_listing_id');

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
            (comment.adoption_listing_id?.user_id?.toString() === userId.toString())

        if (!isAuthorized) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.FORBIDDEN,
                message: "You do not have permission to update this comment.",
            });
        }

        comment.content = content;
        await comment.save();

        Auditlog.info(req.user?.userName, "PetListingComment", "PUT", "Update comment")

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
        const userId = validateObjectId(req.user?._id); 
        const commentId = validateObjectId(req.params.comment_id); 
        const listingId = validateObjectId(req.params.listing_id); 
        const content = req.body.content; 

        if (!userId || !commentId || !listingId || !content) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.BAD_REQUEST,
                message: "required feild userId, commentId, listingId or content",
            });
        }

        const petListing = await PetListing.findById(listingId).session(session);
        if (!petListing) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.NOT_FOUND,
                message: "pet lsiting not found",
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

        const resipent = await PetListing.find({_id : listingId}) 

        const notification = await Notification.create({
            recipient_id: resipent[0].user_id,
            initiator_id: userId,
            petListing_id: listingId,
            type: "reply",
            message: replyComment[0].content
        })

        await session.commitTransaction();
        session.endSession();

        Auditlog.info(
            req.user?.userName,
            "ReplyComment",
            "Post",
            `Created a reply comment for PetListing ID: ${listingId}`
        );

        return responseHandler.success({
            res,
            statusCode: Enum.HTTP_CODES.OK,
            message: "succesfuly created sub comment",
            data: replyComment[0],
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR,
            message: "Did not create sub comment",
            error,
        });
    }
}

async function getAllSubComments(req, res, next) {
    try {
        const listingId = validateObjectId(req.params.listing_id); 
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

        Auditlog.info(req.user?.userName, "PetListingSubComment", "GET", "Get all sub comment")

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
                message: "SubComment not found"
            });
        }
        const subCommentData = subComment[0];

        // permission check
        if (
            subCommentData.user_id.toString() === userId.toString() || 
            subCommentData.parentComment.user_id.toString() === userId.toString() || 
            req.user.role === "ADMIN" 
        ) {
            await ReplyComment.findByIdAndDelete({ _id: subCommentId }); 

            Auditlog.info(req.user?.userName, "PetListingSubComment", "DELETE", "Delete sub comment")

            return responseHandler.success({
                res,
                statusCode: Enum.HTTP_CODES.OK,
                message: "Successfully deleted the subComment"
            });
        } else {

            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.FORBIDDEN,
                message: "You do not have permission to delete this subComment"
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

async function updatePetListingSubComment(req, res, next) {
    try {
        const subCommentId = validateObjectId(req.params.reply_id); // Sub comment ID'si
        const userId = validateObjectId(req.user._id); // Kullanıcı ID'si
        const content = req.body.content; // Güncellenmiş içerik

        if (!content || content.trim() === "") {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.BAD_REQUEST,
                message: "Content is required to update the sub-comment.",
            });
        }

        // Sub comment'i bulma
        const subComment = await ReplyComment.aggregate([
            { $match: { _id: subCommentId } }, // Sub comment ID'si ile eşleşme
            {
                $lookup: {
                    from: "comments", // Comment koleksiyonuyla birleştir
                    localField: "comment_id",
                    foreignField: "_id",
                    as: "commentDetails",
                },
            },
            { $unwind: "$commentDetails" }, // Tek bir comment ile birleştirilir
            {
                $lookup: {
                    from: "petlistings", // İlan bilgilerini eklemek için
                    localField: "commentDetails.adoption_listing_id",
                    foreignField: "_id",
                    as: "adoptionListingDetails",
                },
            },
            { $unwind: "$adoptionListingDetails" }, // Tek bir ilan ile birleştirilir
            {
                $lookup: {
                    from: "users", // İlan sahibinin bilgilerini eklemek için
                    localField: "adoptionListingDetails.user_id",
                    foreignField: "_id",
                    as: "listingOwnerDetails",
                },
            },
            { $unwind: "$listingOwnerDetails" }, // Tek bir kullanıcı ile birleştirilir
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    content: 1,
                    createdAt: 1,
                    "commentDetails.user_id": 1,
                    "adoptionListingDetails.user_id": 1,
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
        const adoptionListingDetails = subComment[0].adoptionListingDetails;

        // authorization check:
        // match sub comment with User id on local user
        // match comment owner with user id on local
        // if authenticate is admin
        // if listing owner and local user id match 

        const isAuthorized =
            subComment[0].user_id.toString() === userId.toString() || 
            req.user.role === "ADMIN" ||
            commentDetails.user_id.toString() === userId.toString() ||
            adoptionListingDetails.user_id.toString() === userId.toString();

        if (!isAuthorized) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.FORBIDDEN,
                message: "You do not have permission to update this sub-comment.",
            });
        }


        const updatedSubComment = await ReplyComment.findByIdAndUpdate(subCommentId, { content }, { new: true });
        Auditlog.info(req.user?.userName, "PetListingSubComment", "PUT", "Update comment")

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
    createPetListingComment,
    getAllPetListingComments,
    deletePetListingComment,
    createReplyComment,
    getAllSubComments,
    deleteSubComment,
    updatePetListingComment,
    updatePetListingSubComment
}