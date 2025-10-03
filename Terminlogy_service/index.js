const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const terminologyRoutes = require('./routes/terminology');
const authMiddleware = require('./middleware/auth');
const auditMiddleware = require('./middleware/audit');

const app = express();
app.use(bodyParser.json());
app.use(authMiddleware);
app.use(auditMiddleware);
app.use('/terminology', terminologyRoutes);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/emr_demo';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(5001, () => console.log('Terminology Service running on port 5001'));
});