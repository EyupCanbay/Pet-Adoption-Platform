const { PetListing, Comment, ReplyComment, Notification, User, Address } = require('../models/index')
const responseHandler = require('../utils/responseHandler')
const Enum = require('../config/enum')
const { validateObjectId } = require('../validators/object_validate')
const mongoose = require('mongoose');

async function createLostListing(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        
        let newListing = new PetListing({
            user_id: req.user._id, 
            category_name: req.body.category_name, 
            sub_category_name: req.body.sub_category_name, 
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
        const listingId = validateObjectId(req.params.listing_id); 
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
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: false } },
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


        if (!listing[0]) return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.NOT_FOUND,
            message: "Listing not found"
        });

        Auditlog.info(req.user?.userName, "PetListing", "GET", "pet listing")

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

async function getAllPetListing(req, res, next) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 1000;
        const skip = (page - 1) * limit;
  
        const petListings = await PetListing.aggregate([
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
                    "petName": 1,
                    "age": 1,
                    "gender": 1,
                    "description": 1,
                    "images": 1,
                    "status": 1,
                    "category_name": 1,
                    "sub_category_name": 1,
                    "createdAt": 1,
                    "updatedAt": 1,
                    "user_id": 1,
                    "user": {
                        "_id": { $ifNull: ["$user._id", null] }, // if user did not have,  doing null on this feild
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
<<<<<<< HEAD

<<<<<<< HEAD
  
        Auditlog.info(req.user?.userName, "PetListing", "GET", "All pet listing")

  
        Auditlog.info(req.user?.userName, "PetListing", "GET", "All pet listing")

=======
=======
  
>>>>>>> parent of 20f3b27 (Add auditlog for every enspoints)
>>>>>>> parent of 42b2376 ( Add sensiment analizer midleware and sensiment train model and sensiment prediction model)
        return responseHandler.success({
            res,
            statusCode: Enum.HTTP_CODES.OK,
            message: "Successfully fetched pet listings",
            data: petListings
        });
  
    } catch (error) {
        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.BAD_REQUEST,
            message:"Did not fetch pet listings",
            error
        });
    }
}
  
async function deletePetListing(req, res, next) {
    try {
        const listingId = validateObjectId(req.params.listing_id);

        console.log("asdasdasdasd")
        if (!listingId) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.BAD_REQUEST,
                message: "Id is required"
            });
        }
        console.log("asdasdasdasd")

        const petListing = await PetListing.findByIdAndDelete({ _id: listingId });
        console.log("asdasdasdasd")

        if (!petListing) {
            return responseHandler.error({
                res,
                statusCode: Enum.HTTP_CODES.NOT_FOUND,
                message: "The pet listing not found"
            });
        }
        console.log("asdasdasdasd")

        // İlgili yourml ve subYourml verilerini sil
        // Örnek olarak, yourml ve subYourml koleksiyonlarını sildiğini varsayıyoruz. 
        // İlgili verileri kendi koleksiyon adlarına göre düzenle.

        return responseHandler.success({
            res,
            statusCode: Enum.HTTP_CODES.OK,
            message: "Successfully deleted the pet listing but did not delete sub and major comment for this feild return geting back"
        });

    } catch (error) {
        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.BAD_REQUEST,
            message: "Failed to delete the pet listing",
            error
        });
    }
}

async function updatePetListing(req,res,next) {
    const listingId = validateObjectId(req.params.listing_id);
    const updateData = req.body;

    try {
        const updatedListing = await PetListing.findByIdAndUpdate(
            listingId, 
            updateData, 
            { new: true, runValidators: true } 
        );
        if (!updatedListing) {
            return responseHandler.error({res, statusCode: Enum.HTTP_CODES.NOT_FOUND, message: "Pet listing not found"})
        }

        responseHandler.success({res, statusCode: Enum.HTTP_CODES.OK, message: "succesfuly update the listing", data: updatedListing })
    } catch (error) {
        return responseHandler.error({res, statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR, message: "database error", error})
    }
}

async function addPetListingBookmarks(req, res, next) {
    const listingId = validateObjectId(req.params.listing_id); 
    const userId = validateObjectId(req.user._id);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [user, petListing] = await Promise.all([
            User.findById(userId).session(session),
            PetListing.findById(listingId).lean(), // Pet listing silinmiş mi diye kontrol etmek için
        ]);

        if (!user || !petListing) {
            return res.status(404).json({ message: "Kullanıcı veya pet listing bulunamadı" });
        }

        if (user.bookmarks.includes(listingId)) {
            return res.status(400).json({ message: "Bu pet listing zaten favorilerde" });
        }

        user.bookmarks.push(listingId);
        await user.save({ session });

        await session.commitTransaction();

        return responseHandler.success({
            res,
            statusCode: Enum.HTTP_CODES.OK,
            message: "Successfully added the pet listing to your bookmarks"
        });

    } catch (error) {
        await session.abortTransaction();
        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.BAD_REQUEST,
            message: "Failed to add the pet listing to your bookmarks",
            error
        });
    } finally {
        session.endSession();
    }
}

module.exports = {
    createLostListing,
    getPetListing,
    getAllPetListing,
    deletePetListing,
    addPetListingBookmarks,
    updatePetListing
}

