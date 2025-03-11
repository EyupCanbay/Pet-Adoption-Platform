const mongoose = require('mongoose');


const NotificationSchema = new mongoose.Schema({
    recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, //hangi kulanıcıya gitcek
    initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, //hangi kulanıcı sebep oldu
    lostPetListing_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LostPetListing', required: false, index: true }, //hangi gönderi için 
    petListing_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PetListing', required: false, index: true }, //hangi gönderi için
    type: { type: String, enum: ['comment', 'reply', 'favorite', 'report', 'general'], required: true }, // bildirimin türü
    message: { type: String, required: true }, //mesaj içeriği
    createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Notification', NotificationSchema)