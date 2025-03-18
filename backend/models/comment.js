const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, //hangi kullanıcının yorumu
    content: { type: String, required: true }, // içerik
    createdAt: { type: Date, default: Date.now, index: true }
});

CommentSchema.index({ user_id: 1, createdAt: -1}, { unique: true });
module.exports = mongoose.model('Comment', CommentSchema)