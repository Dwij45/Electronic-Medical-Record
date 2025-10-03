const mongoose = require('mongoose');

const ConceptMapSchema = new mongoose.Schema({
  namaste: { type: String, required: true, index: true },
  tm2: { type: String, required: true, index: true },
  icd_display: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ConceptMap', ConceptMapSchema);