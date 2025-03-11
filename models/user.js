const mongoose = require('mongoose');

const  UserSchema = new mongoose.Schema({
    userName : { type: String, required: false, unique: true, index: true }, // kullanıcı adı
    email: { type: String, required: true, unique: true }, // email
    password: { type: String, required: true }, // şifre
    name: { type: String, required: true }, // adı
    surname: { type: String, required: true }, // soyadı
    birthdate: { type: Date }, //doğum tarihi
    phoneNumber: { type: String, required: true, unique: true }, // telefon numamrası
    profilePhoto: { type: String, required: false }, // profil fotoğrafının URL'si
    bio: { type: String, trim: true},  // biografisi
    gender: { type: String }, // cinsiyeti
    authType: { type: String, enum: ['local'], default: 'local' }, // kimlik doğrulama türü
    social_links: [
        { platform: { type: String, enum: ['facebook', 'twitter', 'instagram'] }, url: { type: String } },
    ],
    job: { type: String, required: false }, //meslek
    blockedUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}], // engellediği kullanıcılar
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "PetListing" }], // kaydettikleri ilanlar
    rates: [{
        user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // kullanıcının puanı
        rate: [{ type: Number }] // puan
    }],
    is_active: { type: Boolean, default: true }, // aktif mi
    role: { type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' }, // rolü
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }], // bildirimleri
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location'}, // konumu
    createdAt: { type: Date, default: Date.now, index: true }, // oluşturulma tarihi
    updatedAt: { type: Date, default: Date.now }, // güncellenme tarihi
});


UserSchema.index({userName: "text",name: "text", surname: "text", bio: "text" });
module.exports = mongoose.model('User', UserSchema)