const express = require('express');
const router = express.Router();
const {
  importDemoConceptMap,
  getConceptMap,
  addMapping,
  mapNamasteToTM2
} = require('../services/conceptMap');

// POST /conceptmap/import-demo
router.post('/import-demo', async (req, res) => {
  const { fileUrl } = req.body;
  const result = await importDemoConceptMap(fileUrl);
  res.json(result);
});

// GET /conceptmap/
router.get('/', async (req, res) => {
  const map = await getConceptMap();
  res.json(map);
});

// POST /conceptmap/add
router.post('/add', async (req, res) => {
  const { namaste, tm2, icd_display } = req.body;
  const mapping = await addMapping(namaste, tm2, icd_display);
  res.json(mapping);
});

// POST /conceptmap/map
router.post('/map', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing NAMASTE code' });
  const mapping = await mapNamasteToTM2(code);
  if (!mapping) return res.status(404).json({ error: 'No mapping found' });
  res.json(mapping);
});

module.exports = router;