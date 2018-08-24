const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Show} = require('./models/show');

const app = express();
const port = process.env.PORT || 3000;

app.get('/shows', (req, res) => {
  // Returns all shows
  Show.find().then(shows => {
    res.send({shows});
  }, (err) => {
    res.status(400).send(err);
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
