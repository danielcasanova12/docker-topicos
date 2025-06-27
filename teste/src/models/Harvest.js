const { Schema, model } = require('mongoose');

const harvestSchema = new Schema({
  orchardId: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, required: true },
  quantityKg: { type: Number, required: true },
  notes: { type: String },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Cria um campo virtual chamado 'id' com base no _id
harvestSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = model('Harvest', harvestSchema);
