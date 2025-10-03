const express = require('express');
const bodyParser = require('body-parser');
const fhirRoutes = require('./routes/fhir');

const app = express();
app.use(bodyParser.json());
app.use('/fhir', fhirRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`FHIR Bundle Service running on port ${PORT}`));