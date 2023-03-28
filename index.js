const express = require('express');
const bodyParser = require('body-parser');
const { Router } = require('express');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const route = Router();
const url = process.env.MONGODB_URI;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let lastData = {};

route.post('/post', (req, res) => {
  try {
    lastData = req.body;
    console.log(lastData);
    const client = new MongoClient(url);
    client.connect(function(err) {
      if (err) {
        console.error(err);
        res.status(500).send(`An error occurred: ${err.message}`);
        return;
      }

      console.log("Connected to MongoDB");
      const db = client.db();
      const myobj = lastData;
      db.collection("mycollection").insertOne(myobj, function(err, result) {
        if (err) {
          console.error(err);
          res.status(500).send(`An error occurred: ${err.message}`);
          return;
        }

        console.log("Data inserted into MongoDB");
        client.close();
        res.status(200).send('Request received successfully!');
      });
    });
  } catch (e) {
    res.status(500).send(`An error occurred: ${e.message}`);
  }
});

route.get('/', (req, res) => {
  try {
      res.status(200).send(`Health Status:\n${JSON.stringify(lastData, null, 4)}`);
  } catch (e) {
    res.status(500).send(`An error occurred: ${e.message}`);
  }
});

app.use(route);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
