const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
}).plugin(uniqueValidator);

const Show = mongoose.model('Show', Schema, 'Shows');

module.exports = {Show};
