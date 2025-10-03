const express = require('express');
const router = express.Router();
const {
  uploadBundle,
  getBundle,
  searchBundles
} = require('../services/fhir');

// POST /fhir/bundle
router.post('/bundle', async (req, res) => {
  try {
    const result = await uploadBundle(req.body);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /fhir/bundle/:id
router.get('/bundle/:id', async (req, res) => {
  try {
    const bundle = await getBundle(req.params.id);
    res.json(bundle);
  } catch (e) {
    res.status(404).json({ error: 'Bundle not found' });
  }
});

// GET /fhir/bundle
// Example: /fhir/bundle?patient=123&_count=10
router.get('/bundle', async (req, res) => {
  try {
    const bundles = await searchBundles(req.query);
    res.json(bundles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;