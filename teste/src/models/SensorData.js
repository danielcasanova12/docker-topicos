const { Schema, model } = require('mongoose');

const sensorDataSchema = new Schema({
  orchardId: { type: Schema.Types.ObjectId, required: true },
  timestamp: { type: Date, default: Date.now },
  temperature: { type: Number },
  humidity: { type: Number },
  soilMoisture: { type: Number },
}, { timestamps: true });

module.exports = model('SensorData', sensorDataSchema);
