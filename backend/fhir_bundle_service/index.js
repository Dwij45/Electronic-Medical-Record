const express = require('express');
const bodyParser = require('body-parser');
const fhirerouter = require('./routes/fhire')

const app = express();
app.use(bodyParser.json());
app.use('/fhir', fhirerouter);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`FHIR Bundle Service running on port ${PORT}`));