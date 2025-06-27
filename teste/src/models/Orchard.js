// src/models/Orchard.js
const { Schema, model } = require('mongoose');

const orchardSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String },
  totalAreaHa: { type: Number },
}, { timestamps: true });

module.exports = model('Orchard', orchardSchema);
