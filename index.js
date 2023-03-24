const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let lastData = {};

app.post('/post', (req, res) => {
  try {
    lastData = req.body;
    console.log(lastData);
    res.status(200).send('Request received successfully!');
  } catch (e) {
    res.status(500).send(`An error occurred: ${e.message}`);
  }
});

app.get('/', (req, res) => {
  try {
      res.status(200).send(`Health Status:\n${JSON.stringify(lastData, null, 4)}`);
  } catch (e) {
    res.status(500).send(`An error occurred: ${e.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
