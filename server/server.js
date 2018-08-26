const express = require('express');
const bodyParser = require('body-parser');
const csvtojson = require('csvtojson');
const csvFilePath = './shows.csv';

const {mongoose} = require('./db/mongoose');
const {Show} = require('./models/show');
const {InventoryItem} = require('./models/inventoryitem');
const {getShowInfo} = require('./helpers');

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

// Fetch the appropriate information if given query params
// or
// Fetch all shows in inventory
app.get('/inventory', (req, res) => {
  // A query for the URL should look like the following example
  // Ex: /inventory?queryDate=2018-01-01&showDate=2018-01-07
  const queryDate = req.query.queryDate;
  const showDate = req.query.showDate;

  const genres = ["MUSICAL", "COMEDY", "DRAMA"];

  InventoryItem.find().then(shows => {
    if (queryDate && showDate) {
      const inventory = genres
        .map(genre => {
          const showInfo = getShowInfo(shows, genre, queryDate, showDate);
          return {
            genre,
            shows: showInfo
          }
        })
        .filter(genre => genre.shows.length !== 0);

      res.send({inventory});
    } else {
      // If both query params are not provided then fetch all the shows
      res.send({shows});
    }
  }, (err) => {
    res.status(400).send(err);
  });
});

// Will post one show into the inventory or all shows if no body is passed
app.post('/inventory', (req, res) => {
  // If no body is passed
  if (Object.keys(req.body).length === 0) {
    csvtojson({noheader: true, headers:['title', 'startDate', 'genre']})
    .fromFile(csvFilePath)
    .then(shows => {
      InventoryItem.insertMany(shows).then((doc) => {
        res.send(doc);
      }, (err) => {
        res.status(400).send(err);
      });
    });
  // Else pass just the provided body
  } else {
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
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
