const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, //hangi kullanıcının adresi
    country: { type: String, required: true }, //ülke
    city: { type: String, required: true }, //şehir
    state: { type: String, required: true}, //ilçe
    neighborhood: { type: String, required: true }, //mahalle
    createdAt: { type: Date, default: Date.now }
});

AddressSchema.index({ user_id: 1, country: "text", city: "text", state: "text", neighborhood: "text"}, { unique: true });
module.exports = mongoose.model('Address', AddressSchema);