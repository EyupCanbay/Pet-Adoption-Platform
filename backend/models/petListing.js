const mongoose = require('mongoose');

const PetListingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, //hangi kullanıcının kayıp ilanı
    category_name: { type: mongoose.Schema.Types.String, ref: 'Category', required: true, index: true }, //hangi kategoriye ait
    sub_category_name: { type: mongoose.Schema.Types.String, ref: 'SubCategory', required: true, index: true }, // hangi alt kategoriye ait
    comment_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // yorumlar
    petName: { type: String, required: true }, // adı
    age: { type: Number, required: true }, // yaşı
    gender: { type: Boolean, required: true }, // cinsiyeti: erkek = T, dişi = F
    description: { type: String, required: true }, // ilan hakkında bilgi
    images: [{ type: String, required: true }], // fotoğrafları
    status: { type: Boolean, required: true }, // sahiplendirildi = T, sahipsiz = F
    additionalInfo: { 
        color: { type: String, required: true }, // hayvan rengi
        eyeColor: { type: String, required: true }, // göz rengi
        furType: { type: String, required: true }, // tüy yapısı (kısa, uzun, tüysüz)
        size: { type: String, enum: ["small", "medium", "large"], required: true }, // küçük, orta, büyük
        weight: { type: Number, required: true }, // ağırlık (kg)
        vaccinated: { type: Boolean, default: true }, // aşı durumu
        neutered: { type: Boolean, default: true }, // kısırlaştırılmış mı
        trainability: { type: String, enum: ["easy", "medium", "hard"], required: true }, // eğitilebilirlik seviyesi
        playfulness: { type: Number, min: 1, max: 5, required: true }, // oyunculuk seviyesi (1-5 arası)
        sociality: { type: String, enum: ["low", "medium", "high"], required: true }, // sosyal uyumluluk seviyesi
    },
    createdAt: { type: Date, default: Date.now, index: true } 
});

PetListingSchema.index({
    user: 1, 
    category: 1, 
    subCategory: 1, 
    petName: "text", 
    description: "text",
    additionalInfo: "text",
    createdAt: -1}, { unique: true });
module.exports = mongoose.model('PetListing', PetListingSchema);
