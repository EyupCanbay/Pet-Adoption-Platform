const { LostPetListing, PetListing, Comment, ReplyComment, Notification } = require('../models/index')
const responseHandler = require('../utils/responseHandler')
const Enum = require('../config/enum')
const mongoose = require('mongoose')

async function createListing(req, res, next) {
    const { selection } = req.query; // selection is boolean variable 
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let newListing;
        
        if ( selection ) {

            newListing = new LostPetListing({
                user_id: req.user._id,
                category_name: req.body.category_name,
                sub_category_name: req.body.sub_category_name,
                petName: req.body.petName,
                age: req.body.age,
                gender:req.body.gender,
                description:req.body.description,
                images:req.body.images,
                status:true,
                additionalInfo: req.body.additionalInfo
            })

        } else if ( selection ) {

            newListing = new PetListing({
                user_id: req.user._id,
                category_name: req.body.category_name,
                sub_category_name: req.body.sub_category_name,
                petName: req.body.petName,
                age: req.body.age,
                gender:req.body.gender,
                description:req.body.description,
                images:req.body.images,
                status:true,
                additionalInfo: req.body.additionalInfo
            })

        } else {
            throw new Error("Invalid selection type");
        }

        await newListing.save({ session });
        await session.commitTransaction();
        session.endSession();

        return responseHandler.success({ 
            res, 
            statusCode: Enum.HTTP_CODES.CREATED, 
            message: `${selection} pet listing created successfully`, 
            data: newListing 
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return responseHandler.error({ 
            res, 
            statusCode: Enum.HTTP_CODES.BAD_REQUEST, 
            message: "Failed to create the listing", 
            error 
        });
    }
}



module.exports = {
    createListing
}