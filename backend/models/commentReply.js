const mongoose = require('mongoose');

const ReplyCommentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // hangi kullanıcıya ait
    comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true, index: true }, // hangi yoruma ait
    content: { type: String, required: true }, // içerik
    createdAt: { type: Date, default: Date.now, index: true }
});

ReplyCommentSchema.index({ user_id: 1, comment_id: 1, createdAt: -1}, { unique: true });
module.exports = mongoose.model('ReplyComment', ReplyCommentSchema)