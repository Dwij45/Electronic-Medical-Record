const axios = require('axios');

const HAPI_FHIR_URL = process.env.HAPI_FHIR_URL || 'http://localhost:8080/fhir';
const HAPI_FHIR_URL2 = 'http://hapi.fhir.org/baseR4';

// Upload a FHIR Bundle to HAPI FHIR
async function uploadBundle() {
  // POST the bundle to /Bundle endpoint
  const response = await axios.post(
  `${HAPI_FHIR_URL2}/Patient`,
  {
    resourceType: "Patient",
    name: [{ use: "official", family: "Sharma", given: ["Ravi"] }],
    gender: "male",
    birthDate: "1985-06-15",
    telecom: [{ system: "phone", value: "9876543210" }]
  },
  { headers: { 'Content-Type': 'application/fhir+json' } }
);
  return response.data;
}

// Get a FHIR Bundle by its ID
async function getBundle(bundleId) {
  const response = await axios.get(`${HAPI_FHIR_URL}/Bundle/${bundleId}`, {
    headers: { 'Accept': 'application/fhir+json' }
  });
  return response.data;
}

// Search Bundles (e.g., by patient ID, or other params)
async function searchBundles(params = {}) {
  // params is an object: { patient: "123", _count: 10, ... }
  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  const response = await axios.get(`${HAPI_FHIR_URL}/Bundle?${query}`, {
    headers: { 'Accept': 'application/fhir+json' }
  });
  return response.data;
}

module.exports = {
  uploadBundle,
  getBundle,
  searchBundles
};