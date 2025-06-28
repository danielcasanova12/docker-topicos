const { Schema, model } = require('mongoose');

const productivitySchema = new Schema({
  // orchardId agora armazena o identificador numérico vindo da API1
  orchardId: { type: Number, required: true },
  date: { type: Date, required: true },
  KgPerTree: { type: Number, required: true },
  totalTrees: { type: Number, required: true },
}, { timestamps: true });

module.exports = model('Productivity', productivitySchema);
