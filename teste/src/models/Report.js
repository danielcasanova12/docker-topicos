const { Schema, model } = require('mongoose');

const reportSchema = new Schema({
  orchardId: { type: Schema.Types.ObjectId, required: true },
  generatedAt: { type: Date, default: Date.now },
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = model('Report', reportSchema);
