const express = require('express');
const fhirerouter = express.Router();
const {
  uploadBundle,
  getBundle,
  searchBundles
} = require('../services/fhire')

// POST /fhir/bundle
fhirerouter.post('/bundle', async (req, res) => {
  try {
    const result = await uploadBundle();
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /fhir/bundle/:id
fhirerouter.get('/bundle/:id', async (req, res) => {
  try {
    const bundle = await getBundle(req.params.id);
    res.json(bundle);
  } catch (e) {
    res.status(404).json({ error: 'Bundle not found' });
  }
});

// GET /fhir/bundle
// Example: /fhir/bundle?patient=123&_count=10
fhirerouter.get('/bundle', async (req, res) => {
  try {
    const bundles = await searchBundles(req.query);
    res.json(bundles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = fhirerouter;