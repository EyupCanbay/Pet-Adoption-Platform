const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    breed: { type: String, required: true }, // cinsi
    description: { type: String,require: true }, //tanımlaması
    created_by: { type: String, require: true }, // kimin oluşturduğu
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true }, //hangi kategoriden
    petListing_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PetListing', required: false, index: true },
    lostPetListing_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LostPetListing', required: false, index: true },
});


module.exports = mongoose.model('SubCategory', SubCategorySchema)