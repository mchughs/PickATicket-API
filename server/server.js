const express = require('express');
const bodyParser = require('body-parser');
const csvtojson = require('csvtojson');
const csvFilePath = './shows.csv';

const {mongoose} = require('./db/mongoose');
const {Show} = require('./models/show');
const {InventoryItem} = require('./models/inventoryitem');

const app = express();
const port = process.env.PORT || 3000;

// Tells express to use JSON
app.use(bodyParser.json());

/**************************************************************
  Inserting and getting the CSV data into the database as JSON
***************************************************************/

// Fetches all shows
app.get('/allshows', (req, res) => {
  Show.find().then(shows => {
    res.send({shows});
  }, (err) => {
    res.status(400).send(err);
  });
});

// Will post all the shows into the database
app.post('/allshows', (req, res) => {
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

/**************************************************************
  Inserting and getting the show data into the Inventory
***************************************************************/

// Fetch all shows in inventory
app.get('/inventory', (req, res) => {
  InventoryItem.find().then(shows => {
    res.send({shows});
  }, (err) => {
    res.status(400).send(err);
  });
});

// Will post one show into the inventory
app.post('/inventory', (req, res) => {
  const show = new InventoryItem({
    title: req.body.title,
    startDate: req.body.startDate,
    genre: req.body.genre,
  });

  show.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
