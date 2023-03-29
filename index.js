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

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error(error);
});

const dataSchema = new mongoose.Schema(
  {
    dailies: [
      {
        userId: {type: String, required: true},
        userAccessToken: {type: String, required: true},
        summaryId: {type: String, required: true},
        calendarDate: {type: Date, required: true},
        activityType: {type: String, required: true},
        activeKilocalories: {type: Number, default: 0},
        bmrKilocalories: {type: Number, required: true},
        steps: {type: Number, default: 0},
        distanceInMeters: {type: Number, default: 0},
        durationInSeconds: {type: Number, required: true},
        activeTimeInSeconds: {type: Number, default: 0},
        startTimeInSeconds: {type: Number, required: true},
        startTimeOffsetInSeconds: {type: Number, required: true},
        moderateIntensityDurationInSeconds: {type: Number, default: 0},
        vigorousIntensityDurationInSeconds: {type: Number, default: 0},
        stepsGoal: {type: Number, required: true},
        intensityDurationGoalInSeconds: {type: Number, required: true},
        floorsClimbedGoal: {type: Number, required: true},
        minHeartRateInBeatsPerMinute: {type: Number},
        maxHeartRateInBeatsPerMinute: {type: Number},
        averageHeartRateInBeatsPerMinute: {type: Number},
        restingHeartRateInBeatsPerMinute: {type: Number},
        timeOffsetHeartRateSamples: {type: Object},
        averageStressLevel: {type: Number},
        maxStressLevel: {type: Number},
        stressDurationInSeconds: {type: Number},
        restStressDurationInSeconds: {type: Number},
        activityStressDurationInSeconds: {type: Number},
        lowStressDurationInSeconds: {type: Number},
        mediumStressDurationInSeconds: {type: Number},
        stressQualifier: {type: String},
      },
    ],
  }
);

const Data = mongoose.model('Data', dataSchema);

route.post('/post', async (req, res) => {
  try {
    lastData = req.body;
    console.log(lastData);
    const myData = new Data(lastData);
    await myData.save();
    console.log("Data inserted into MongoDB");
    return res.status(200).send('Request received successfully!');
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
