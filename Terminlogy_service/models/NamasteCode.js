const mongoose = require('mongoose');

const NamasteCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, index: true },
  display: { type: String, required: true },
  system: { type: String, default: "NAMASTE" }
}, { timestamps: true });

module.exports = mongoose.model('NamasteCode', NamasteCodeSchema);