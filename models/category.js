const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    petListing_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PetListing', required: true, index: true },
    lostPetListing_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LostPetListing', required: true, index: true },
    subCategory_id : [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true, index: true }],
    name: { type: String, required: true },
    description: { type: String, required: false},
});

module.exports = mongoose.model('Category', CategorySchema);