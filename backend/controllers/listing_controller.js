const { LostPetListing, PetListing, Comment, ReplyComment, Notification, User, Address } = require('../models/index')
const responseHandler = require('../utils/responseHandler')
const Enum = require('../config/enum')
const mongoose = require('mongoose');
const { validateObjectId } = require('../validators/object_validate');

async function createLostListing(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let newListing;
        
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

async function getAllLostListing(req, res, next) {
  try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const lostListings = await LostPetListing.aggregate([
          {
              $lookup: {
                  from: "users",
                  localField: "user_id",
                  foreignField: "_id",
                  as: "user"
              }
          },
          { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }, // Eğer kullanıcı yoksa `null` bırakır burası

          {
              $lookup: {
                  from: "addresses",
                  localField: "user._id",
                  foreignField: "user_id",
                  as: "userAddress"
              }
          },
          { $unwind: { path: "$userAddress", preserveNullAndEmptyArrays: true } }, 

          {
              $project: {
                  "_id": 1,
                  "title": 1,
                  "description": 1,
                  "photo": 1,
                  "createdAt": 1,
                  "updatedAt": 1,
                  "status": 1,
                  "user_id": 1,

                  "user": {
                      "_id": { $ifNull: ["$user._id", null] }, //ifNull ie kodtrol ediliyor eğer boş ise null yapıyoruz
                      "userName": { $ifNull: ["$user.userName", null] },
                      "profilePhoto": { $ifNull: ["$user.profilePhoto", null] },
                      "location": {
                          country: { $ifNull: ["$userAddress.country", null] },
                          city: { $ifNull: ["$userAddress.city", null] },
                          state: { $ifNull: ["$userAddress.state", null] },
                          neighborhood: { $ifNull: ["$userAddress.neighborhood", null] }
                      }
                  }
              }
          },

          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit }
      ]);

      return responseHandler.success({
          res,
          statusCode: Enum.HTTP_CODES.OK,
          message: "Successfully fetched lost listings",
          data: lostListings
      });

  } catch (error) {
      return responseHandler.error({
          res,
          statusCode: Enum.HTTP_CODES.BAD_REQUEST,
          message:"Did not fetch lost listings",
          error
      });
  }
}

async function getLostListing(req,res,next) {
    try {
        const listingId = validateObjectId(req.params.listing_id)
        const listing = await LostPetListing.aggregate([
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
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: false } },
            {
                $lookup: {
                    from: "addresses",
                    localField: "user._id",
                    foreignField: "user_id",
                    as: "address"
                }
            },
            { $unwind: { path: "$address", preserveNullAndEmptyArrays: false } },   
            
            {
                $project: 
                {
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
                "address.neighborhood": 1,
                } 
            }
        ]);
   
    return responseHandler.success({res, 
        statusCode: Enum.HTTP_CODES.OK,
        message: "Successfuly was fetched a lost listing",
        data: listing 
    })
    }catch ( error ){
        return responseHandler.error({res, 
            statusCode: Enum.HTTP_CODES.BAD_REQUEST,
            message: "Was not fetched a lost listing",
            error 
        })
    }
}


module.exports = {
    createLostListing,
    getAllLostListing,
    getLostListing
}

