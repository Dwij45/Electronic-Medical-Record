const ConceptMap = require('../models/ConceptMap');
const NamasteCode = require('../models/NamasteCode');
const TM2Code = require('../models/TM2Code');
const ICD11Code = require('/Users/gosai/Desktop/new/Electronic-Medical-Record/backend/Terminlogy_service/models/ICD11Code');
const NamasteTerCode = require('/Users/gosai/Desktop/new/Electronic-Medical-Record/backend/Terminlogy_service/models/NamasteCode');
const fs = require('fs');
const path = require('path');
const stringSimilarity = require('string-similarity');

// Import ConceptMap demo data
// async function importDemoConceptMap() {
//   const demoFile = path.join(__dirname, '../conceptmap.json');
//   const conceptMapData = JSON.parse(fs.readFileSync(demoFile, 'utf-8'));
//   await ConceptMap.deleteMany({});
//   await ConceptMap.insertMany(conceptMapData);
//   return { imported: conceptMapData.length };
// }

async function importDemoConceptMap() {
  try {
    const demoFile = path.join(__dirname, 'backend/conceptmap_service/conceptmap.json');

    // Read and parse the JSON file asynchronously
    const fileData = await fs.readFile(demoFile, 'utf-8');
    const conceptMapData = JSON.parse(fileData);

    if (!Array.isArray(conceptMapData)) {
      throw new Error('conceptmap.json must contain an array of ConceptMap objects');
    }

    // Clear old records
    await ConceptMap.deleteMany({});
    
    // Insert new records
    const inserted = await ConceptMap.insertMany(conceptMapData);

    return { imported: inserted.length };
  } catch (error) {
    console.error('❌ Error importing ConceptMap:', error.message);
    throw error;
  }
}


// Get all ConceptMap entries
async function getConceptMap() {
  return await ConceptMap.find({});
}

// Manual add
async function addMapping(namaste, tm2, icd_display) {
  const existing = await ConceptMap.findOne({ namaste, tm2 });
  if (existing) return existing; // Avoid duplicates
  else {
  const mapping = new ConceptMap({ namaste, tm2, icd_display });
  await mapping.save();
  return mapping;
  }
}

// Smart mapping for NAMASTE codes
// async function mapNamasteToTM2(namasteCodeValue) {
//   // 1. Check for existing mapping
//   let mapping = await ConceptMap.findOne({ namaste: namasteCodeValue });
//   if (mapping) return mapping;

//   // 2. If not, get code objects
//   const namasteCode = await NamasteCode.findOne({ code: namasteCodeValue });
//   if (!namasteCode) return null;

//   // 3. Get all TM2 codes
//   const tm2Codes = await TM2Code.find({});

//   // 4. Fuzzy match by display
//   const tm2Displays = tm2Codes.map(code => code.display);
//   const { bestMatch } = stringSimilarity.findBestMatch(namasteCode.display, tm2Displays);

//   // 5. Use the best match
//   if (bestMatch.rating > 0.6) {
//     const matchedTM2 = tm2Codes.find(code => code.display === bestMatch.target);

//     // 6. Store mapping for future
//     mapping = new ConceptMap({
//       namaste: namasteCode.code,
//       tm2: matchedTM2.code,
//       icd_display: matchedTM2.display
//     });
//     await mapping.save();
//     return mapping;
//   } else {
//     return null; // No good match found
//   }
// }

async function mapNamasteToTM2(namasteCodeValue) {
  // 1. Check for existing mapping
  let mapping = await ConceptMap.findOne({ namaste: namasteCodeValue });
  if (mapping) return mapping;

  // 2. Find NAMASTE code
  const namasteCode = await NamasteCode.findOne({ code: namasteCodeValue });
  if (!namasteCode || !namasteCode.display) {
    console.error("Invalid NAMASTE code or missing display:", namasteCodeValue);
    return null;
  }

  // 3. Get TM2 codes
  const tm2Codes = await TM2Code.find({});
const ICD11Codes = await ICD11Code.find({ code: "TM20.01" });
console.log(ICD11Codes);
  const tm2Displays = tm2Codes
    .map(code => code.display)
    .filter(d => typeof d === 'string' && d.trim().length > 0);

  if (tm2Displays.length === 0) {
    console.error("No valid TM2 display strings found.");
    return null;
  }

  // 4. Fuzzy match by display
  const { bestMatch } = stringSimilarity.findBestMatch(
    namasteCode.display,
    tm2Displays
  );

  // 5. Use the best match if above threshold
  if (bestMatch.rating > 0.6) {
    const matchedTM2 = tm2Codes.find(code => code.display === bestMatch.target);

    mapping = new ConceptMap({
      namaste: namasteCode.code,
      tm2: matchedTM2.code,
      icd_display: matchedTM2.display,
    });

    await mapping.save();
    return mapping;
  } else {
    console.log(`No good match found for ${namasteCodeValue}`);
    return null;
  }
}

module.exports = {
  importDemoConceptMap,
  getConceptMap,
  addMapping,
  mapNamasteToTM2
};