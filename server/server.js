const express = require('express');
const bodyParser = require('body-parser');
const csvtojson = require('csvtojson');
const csvFilePath = './shows.csv';

const {mongoose} = require('./db/mongoose');
const {InventoryItem} = require('./models/inventoryitem');
const {getShowInfo} = require('./helpers');

const app = express();
const port = process.env.PORT || 3000;

// Tells express to use JSON
app.use(bodyParser.json());

/**************************************************************
  Inserting and getting the show data into the Inventory
***************************************************************/

// Fetch the appropriate information
app.get('/inventory', (req, res) => {
  // A query for the URL should look like the following example
  // Ex: /inventory?queryDate=2018-01-01&showDate=2018-01-07
  const queryDate = req.query.queryDate;
  const showDate = req.query.showDate;

  const genres = ["MUSICAL", "COMEDY", "DRAMA"];

  InventoryItem.find().then(shows => {
    // If query params passed return the ticket information
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

    // else fetch all the shows
    } else {
      res.send({shows});
    }
  }, (err) => {
    res.status(400).send(err);
  });
});

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
