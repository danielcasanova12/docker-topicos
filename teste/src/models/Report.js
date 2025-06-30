const { Schema, model } = require('mongoose');

const reportSchema = new Schema(
  {
    // orchardId pode ser opcional em alguns relatórios
    orchardId: { type: Number },
    generatedAt: { type: Date, default: Date.now },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model('Report', reportSchema);
