const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: String,
  email: String,
  tags: [String],
  status: String
});

module.exports = mongoose.model('Member', memberSchema);
