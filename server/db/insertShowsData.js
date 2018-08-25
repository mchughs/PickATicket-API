const MongoClient = require('mongodb').MongoClient;
const csvtojson = require('csvtojson');
const csvFilePath = './../shows.csv';

// Preforms the initial populating of the DB with the csv data

// Connects to the mongodb server
MongoClient.connect('mongodb://localhost:27017/PickATicket',
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      return console.log('Unable to connect to server', err);
    }
    console.log('Connected to server');

    // Converts our CSV to a JSON format
    // Attempts to then insert the data into the database
    csvtojson({noheader: true, headers:['title', 'startDate', 'genre']})
      .fromFile(csvFilePath)
      .then(jsonObj => {
        const collection = client.db('PickATicket').collection('Shows');

        collection.insertMany(jsonObj, (err, r) => {
          if (err) {
            console.log('Unable to insert data into database', err);
          } else {
            console.log('Inserted data into database');
          }
          client.close();
        });
      });
  }
)
