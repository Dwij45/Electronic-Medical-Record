const csv = require('csvtojson');
const path = require('path');
const NamasteCode = require('../models/NamasteCode');
const ICD11Code = require('../models/ICD11Code');

// Ingest NAMASTE CSV
async function ingestNamasteCSV(fileUrl) {
  const filePath = fileUrl || path.join(__dirname, '../demo/namaste.csv');
  const jsonArray = await csv().fromFile(filePath);
  await NamasteCode.deleteMany({});
  await NamasteCode.insertMany(jsonArray);
  return { loaded: jsonArray.length };
}

// Ingest ICD-11 CSV
async function ingestICD11CSV(fileUrl) {
  const filePath = fileUrl || path.join(__dirname, '../demo/icd11.csv');
  const jsonArray = await csv().fromFile(filePath);
  await ICD11Code.deleteMany({});
  await ICD11Code.insertMany(jsonArray);
  return { loaded: jsonArray.length };
}

// Clean and Normalize Data
async function cleanNormalize(system) {
  let Model = system === 'NAMASTE' ? NamasteCode : ICD11Code;
  let codes = await Model.find({});
  let normalized = codes.map(entry => ({
    code: entry.code.trim(),
    display: entry.display.trim().toLowerCase(),
    system: entry.system
  }));
  return normalized;
}

// Code Search
async function codeSearch(system, query) {
  let Model = system === 'NAMASTE' ? NamasteCode : ICD11Code;
  const results = await Model.find({
    display: { $regex: query, $options: 'i' }
  }).limit(10);
  return results;
}

module.exports = {
  ingestNamasteCSV,
  ingestICD11CSV,
  cleanNormalize,
  codeSearch
};