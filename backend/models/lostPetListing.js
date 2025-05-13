const mongoose = require('mongoose');

const LostPetListingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, //hangi kullanıcının kayıp ilanı
    category_name: { type: mongoose.Schema.Types.String, ref: 'Category', required: true, index: true }, //hangi kategoriye ait
    sub_category_name: { type: mongoose.Schema.Types.String, ref: 'SubCategory', required: true, index: true }, // hangi alt kategoriye ait
    comment_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // yorumlar
    petName: { type: String, required: true }, // adı
    age: { type: Number, required: true }, // yaşı
    gender: { type: Boolean, required: true }, // cinsiyeti erkek=T, dişi=F
    description: { type: String, required: true }, // ilan acıklaması
    images: [{ type: String, required: true }], // resimleri
    status: { type: Boolean, required: false}, // bulundu yada bulunmadı
    additionalInfo: { 
        color: { type: String, required: true }, // hayvan rengi
        eyeColor: { type: String, required: true }, // göz rengi
        furType: { type: String, required: true }, // tüy yapısı (kısa, uzun, tüysüz)
        size: { type: String, enum: ["small", "medium", "large"], required: true }, // küçük, orta, büyük
        weight: { type: Number, required: true }, // ağırlık (kg)
        vaccinated: { type: Boolean, default: false }, // aşı durumu
        vaccinated_last_date: { type: Date, index: true }, // asısının son tarihi
        trainability: { type: String, enum: ["easy", "medium", "hard"] }, // eğitilebilirlik seviyesi
        playfulness: { type: Number, min: 1, max: 5, required: false }, // oyunculuk seviyesi (1-5 arası)
        sociality: { type: String, enum: ["low", "medium", "high"], required: false }, // sosyal uyumluluk seviyesi
    },    
    createdAt: { type: Date, default: Date.now, index: true }
});

LostPetListingSchema.index({
    petName: "text", 
    description: "text",
    "additionalInfo.color": "text", 
    "additionalInfo.eyeColor": "text", 
    "additionalInfo.furType": "text", 
    "additionalInfo.size": "text", 
    "additionalInfo.trainability": "text", 
    "additionalInfo.sociality": "text"
} );

module.exports = mongoose.model('LostPetListing', LostPetListingSchema)

