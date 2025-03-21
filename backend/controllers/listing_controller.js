const { LostPetListing, PetListing, Comment, ReplyComment, Notification, User, Address } = require('../models/index')
const responseHandler = require('../utils/responseHandler')
const Enum = require('../config/enum')
const mongoose = require('mongoose')

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




module.exports = {
    createLostListing,
    getAllLostListing
}

