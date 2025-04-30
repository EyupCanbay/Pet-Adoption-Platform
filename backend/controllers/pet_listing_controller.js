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

module.exports = {
    createLostListing
}

