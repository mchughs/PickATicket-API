const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PickATicket',
  { useNewUrlParser: true });

module.exports = {mongoose};
