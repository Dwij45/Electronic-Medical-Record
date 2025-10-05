const mongoose = require('mongoose');

const ICD11CodeSchema = new mongoose.Schema({
  code: { type: String, required: true, index: true },
  display: { type: String, required: true },
  system: { type: String, default: "ICD-11-TM2" }
}, { timestamps: true });

module.exports = mongoose.model('ICD11Code', ICD11CodeSchema);