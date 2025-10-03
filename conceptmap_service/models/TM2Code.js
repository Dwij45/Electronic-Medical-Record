const mongoose = require('mongoose');

const TM2CodeSchema = new mongoose.Schema({
  code: { type: String, required: true, index: true },
  display: { type: String, required: true },
  system: { type: String, default: "TM2" }
}, { timestamps: true });

module.exports = mongoose.model('TM2Code', TM2CodeSchema);