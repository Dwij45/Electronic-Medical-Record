const ConceptMap = require('../models/ConceptMap');
const NamasteCode = require('../models/NamasteCode');
const TM2Code = require('../models/TM2Code');
const fs = require('fs');
const path = require('path');
const stringSimilarity = require('string-similarity');

// Import ConceptMap demo data
async function importDemoConceptMap(fileUrl) {
  const demoFile = fileUrl || path.join(__dirname, '../demo/conceptmap.json');
  const conceptMapData = JSON.parse(fs.readFileSync(demoFile, 'utf-8'));
  await ConceptMap.deleteMany({});
  await ConceptMap.insertMany(conceptMapData);
  return { imported: conceptMapData.length };
}

// Get all ConceptMap entries
async function getConceptMap() {
  return await ConceptMap.find({});
}

// Manual add
async function addMapping(namaste, tm2, icd_display) {
  const mapping = new ConceptMap({ namaste, tm2, icd_display });
  await mapping.save();
  return mapping;
}

// Smart mapping for NAMASTE codes
async function mapNamasteToTM2(namasteCodeValue) {
  // 1. Check for existing mapping
  let mapping = await ConceptMap.findOne({ namaste: namasteCodeValue });
  if (mapping) return mapping;

  // 2. If not, get code objects
  const namasteCode = await NamasteCode.findOne({ code: namasteCodeValue });
  if (!namasteCode) return null;

  // 3. Get all TM2 codes
  const tm2Codes = await TM2Code.find({});

  // 4. Fuzzy match by display
  const tm2Displays = tm2Codes.map(code => code.display);
  const { bestMatch } = stringSimilarity.findBestMatch(namasteCode.display, tm2Displays);

  // 5. Use the best match
  if (bestMatch.rating > 0.6) {
    const matchedTM2 = tm2Codes.find(code => code.display === bestMatch.target);

    // 6. Store mapping for future
    mapping = new ConceptMap({
      namaste: namasteCode.code,
      tm2: matchedTM2.code,
      icd_display: matchedTM2.display
    });
    await mapping.save();
    return mapping;
  } else {
    return null; // No good match found
  }
}

module.exports = {
  importDemoConceptMap,
  getConceptMap,
  addMapping,
  mapNamasteToTM2
};