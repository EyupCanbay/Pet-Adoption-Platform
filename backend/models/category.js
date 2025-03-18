const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    petListing_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PetListing', required: false, index: true },
    lostPetListing_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LostPetListing', required: false, index: true },
    subCategory_id : [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: false, index: true }],
    name: { type: String, required: true },
    description: { type: String, required: false},
    created_by: { type: String, required: true}
});

module.exports = mongoose.model('Category', CategorySchema);