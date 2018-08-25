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

const InventoryItem = mongoose.model('InventoryItem', Schema, 'InventoryItems');

module.exports = {InventoryItem};
