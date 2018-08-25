const express = require('express');
const bodyParser = require('body-parser');
const csvtojson = require('csvtojson');
const csvFilePath = './shows.csv';

const {mongoose} = require('./db/mongoose');
const {Show} = require('./models/show');

const app = express();
const port = process.env.PORT || 3000;

// Sets up a function to run between client and server processes
// Tells express to use JSON
app.use(bodyParser.json());

// Fetches all shows
app.get('/shows', (req, res) => {
  // Returns all shows
  Show.find().then(shows => {
    res.send({shows});
  }, (err) => {
    res.status(400).send(err);
  });
});

// Will post all the shows into the database
app.post('/shows', (req, res) => {
  csvtojson({noheader: true, headers:['title', 'startDate', 'genre']})
  .fromFile(csvFilePath)
  .then(shows => {
    Show.insertMany(shows).then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
