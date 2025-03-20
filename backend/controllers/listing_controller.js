const { LostPetListing, PetListing, Comment, ReplyComment, Notification, User, Address } = require('../models/index')
const responseHandler = require('../utils/responseHandler')
const Enum = require('../config/enum')
const mongoose = require('mongoose')

async function createListing(req, res, next) {
    const { query } = req.query; // selection is boolean variable 
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let newListing;
        
        if ( query ) {

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

        } else if ( query ) {

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
            message: `Pet listing created successfully`, 
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

async function getAllListing(req,res,next) {
    try {
        const { query, page = 1, limit = 2 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);
    
        const listingModel = query ? LostPetListing : PetListing;
    
        const listings = await listingModel.find()
          .select("-comment_id")
          .populate({
            path: "user_id",
            select: "userName name surname profilePhoto phoneNumber",
            populate: {
              path: "location",
              model: "Address",
              select: "country city state neighborhood"
            }
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit));

          return responseHandler.success({res, statusCode: Enum.HTTP_CODES.OK, data:listings})
    } catch ( error ) {
        return responseHandler.error({res, statusCode: Enum.HTTP_CODES.BAD_REQUEST, error})
    }
}



module.exports = {
    createListing,
    getAllListing
}