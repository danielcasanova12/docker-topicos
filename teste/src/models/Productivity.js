const { Schema, model } = require('mongoose');

const productivitySchema = new Schema({
  orchardId: { type: String, required: true },
  date: { type: Date, required: true },
  KgPerTree: { type: Number, required: true },
  totalTrees: { type: Number, required: true },
}, { timestamps: true });

module.exports = model('Productivity', productivitySchema);
