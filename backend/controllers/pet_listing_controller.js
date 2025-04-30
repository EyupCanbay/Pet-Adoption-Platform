const { PetListing, Comment, ReplyComment, Notification, User, Address } = require('../models/index')
const responseHandler = require('../utils/responseHandler')
const Enum = require('../config/enum')
const mongoose = require('mongoose');
const { validateObjectId } = require('../validators/object_validate')

async function createLostListing(req, res, next) {
    console.log("sadasdasd")

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        
        let newListing = new PetListing({
            user_id: req.user._id, 
            category_name: req.body.category_name, 
            sub_category_name: req.body.sub_category_name, // 
            petName: req.body.petName, 
            age: req.body.age, 
            gender: req.body.gender, 
            description: req.body.description, 
            images: req.body.images, 
            status: req.body.status, 
            additionalInfo: {
                color: req.body.additionalInfo.color, 
                eyeColor: req.body.additionalInfo.eyeColor, 
                furType: req.body.additionalInfo.furType, 
                size: req.body.additionalInfo.size, 
                weight: req.body.additionalInfo.weight, 
                vaccinated: req.body.additionalInfo.vaccinated, 
                neutered: req.body.additionalInfo.neutered, 
                trainability: req.body.additionalInfo.trainability, 
                playfulness: req.body.additionalInfo.playfulness, 
                sociality: req.body.additionalInfo.sociality, 
            },
            createdAt: Date.now() 
        });

        
        await newListing.save({ session });
        await session.commitTransaction();
        session.endSession();

        return responseHandler.success({
            res,
            statusCode: Enum.HTTP_CODES.CREATED,
            message: `Pet listing created successfully`,
            data: newListing,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.BAD_REQUEST,
            message: "Failed to create the listing",
            error,
        });
    }
}
async function getPetListing(req, res, next) {
    try {
        const listingId = validateObjectId(req.params.listing_id);  // Parametreyi doğru şekilde kullanıyoruz
        console.log(listingId)
        const listing = await PetListing.aggregate([
            {
                $match: { _id: listingId }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "addresses",
                    localField: "user._id",
                    foreignField: "user_id",
                    as: "address"
                }
            },
            { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "comments",
                    localField: "comment_id",
                    foreignField: "_id",
                    as: "comments"
                }
            },
            // Eğer yorumları unwind etmek istiyorsanız, aşağıdaki satırı yorumdan çıkarabilirsiniz
             { $unwind: { path: "$comments", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    petName: 1,
                    age: 1,
                    gender: 1,
                    description: 1,
                    images: 1,
                    status: 1,
                    category_name: 1,
                    sub_category_name: 1,
                    createdAt: 1,
                    "comments": 1,
                    "additionalInfo.color": 1,
                    "additionalInfo.eyeColor": 1,
                    "additionalInfo.furType": 1,
                    "additionalInfo.size": 1,
                    "additionalInfo.weight": 1,
                    "additionalInfo.vaccinated": 1,
                    "additionalInfo.neutered": 1,
                    "additionalInfo.trainability": 1,
                    "additionalInfo.playfulness": 1,
                    "additionalInfo.sociality": 1,
                    "user._id": 1,
                    "user.userName": 1,
                    "user.profilePhoto": 1,
                    "user.job": 1,
                    "address.country": 1,
                    "address.city": 1,
                    "address.state": 1,
                    "address.neighborhood": 1
                }
            }
        ]);

        console.log(listingId);

        if (!listing[0]) return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.NOT_FOUND,
            message: "Listing not found"
        });

        return responseHandler.success({
            res,
            statusCode: Enum.HTTP_CODES.OK,
            message: "Successfully fetched a pet listing",
            data: listing
        });

    } catch (error) {
        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.BAD_REQUEST,
            message: "Failed to fetch a pet listing",
            error
        });
    }
}




module.exports = {
    createLostListing,
    getPetListing
}

