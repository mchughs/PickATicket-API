const mongoose = require('mongoose');

const Show = mongoose.model('Show', {
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
})

module.exports = {Show};
