const { Schema, model } = require('mongoose');

const reportSchema = new Schema({
  // orchardId agora armazena o identificador numérico vindo da API1
  orchardId: { type: Number, required: true },
  generatedAt: { type: Date, default: Date.now },
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = model('Report', reportSchema);
