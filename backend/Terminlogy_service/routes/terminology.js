const express = require('express');
const router = express.Router();
const {
  ingestNamasteCSV,
  ingestICD11CSV,
  cleanNormalize,
  codeSearch
} = require('../services/terminology');

// Ingest NAMASTE CSV
router.post('/ingest/namaste', async (req, res) => {
  // const { fileUrl } = req.body;
  try {
    const result = await ingestNamasteCSV();
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Ingest ICD-11 CSV
router.post('/ingest/icd11', async (req, res) => {
  // const { fileUrl } = req.body;
  try {
    const result = await ingestICD11CSV();
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Clean and Normalize
router.get('/normalize/:system', async (req, res) => {
  try {
    const { system } = req.params;
    const data = await cleanNormalize(system);
    res.json(data);
    console.log(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Code Search
router.get('/search', async (req, res) => {
  try {
    const { system, query } = req.query;
    const results = await codeSearch(system, query);
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;