const express = require('express');
const bodyParser = require('body-parser');
const { Router } = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const route = Router();
const url = process.env.MONGO_URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let lastData = {};

// Connect to mongodb
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error(error);
});

// create dailies schema
const dailiesSchema = new mongoose.Schema(
  {dailies: [{}]}
);
const Dailies = mongoose.model('Dailies', dailiesSchema);

// Trying to create new schemas to indentify different kind of data

// Pulse Ox Summaries
const pulseOxSchema = new mongoose.Schema(
  {pulseox: [{}]}
);
const PulseOx = mongoose.model('PulseOx', pulseOxSchema);

// Respiration Summaries
const respirationSchema = new mongoose.Schema(
  {allDayRespiration: [{}]}
);
const Respiration = mongoose.model('Respiration', respirationSchema);

route.post('/post', async (req, res) => {
  try {
    lastData = req.body;
    console.log(lastData);
    // check if lastData is dailies, respiration or pulseOx type of data

    if (lastData.hasOwnProperty('dailies')) {
      const dailies = new Dailies(lastData);
      await dailies.save();
      console.log("Dailies inserted into MongoDB");
      return res.status(200).send('Request received successfully!');
    } else if (lastData.hasOwnProperty('allDayRespiration')) {
      const respiration = new Respiration(lastData);
      await respiration.save();
      console.log("Respiration inserted into MongoDB");
      return res.status(200).send('Request received successfully!');
    } else if (lastData.hasOwnProperty('pulseOx')) {
      const pulseOx = new PulseOx(lastData);
      await pulseOx.save();
      console.log("PulseOx inserted into MongoDB");
      return res.status(200).send('Request received successfully!');
    } else {
      console.log("Unknown data type");
      return res.status(200).send('Request received successfully!');
    }
  } catch (e) {
    return res.status(500).send(`An error occurred: ${e.message}`);
  }
});

route.get('/', (req, res) => {
  try {
    return res.status(200).send(`Health Status:\n${JSON.stringify(lastData, null, 4)}`);
  } catch (e) {
    return res.status(500).send(`An error occurred: ${e.message}`);
  }
});

app.use(route);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
