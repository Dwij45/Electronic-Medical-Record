const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const conceptMapRoutes = require('./routes/conceptMap');

const app = express();
app.use(bodyParser.json());
app.use('/conceptmap', conceptMapRoutes);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/emr_demo';
const PORT = process.env.PORT || 5002;

async function main(){
try {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    app.listen(PORT, () => console.log(`ConceptMap Service running on port ${PORT}`));
  });
} catch (error) {
  console.error('Error connecting to MongoDB:', error);
}
}
main();