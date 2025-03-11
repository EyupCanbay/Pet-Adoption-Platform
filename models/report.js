const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },  // hangi kullanıcı raporlar
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // hangi kullanıcıyı raporladı
    reportedPetListing_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PetListing', index: true }, // şikayet edilen ilan
    reportedLostPetListing_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LostPetListing', index: true }, // şikayet edilen ilan
    reason: { type: String, required: true }, // neden şikayet etti
    status: { type: Boolean, required: true, index: true }, // raporun hangi aşamada olduğu
    createdAt: { type: Date, default: Date.now, index: true }
});

ReportSchema.index({ reporter: 1, reportedUser: 1, reason: "text", createdAt: -1}, { unique: true });
module.exports = mongoose.model('Report', ReportSchema);4

