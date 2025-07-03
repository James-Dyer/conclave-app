const mongoose = require('mongoose');

const chargeSchema = new mongoose.Schema({
  memberName: String,
  description: String,
  tags: [String],
  status: String
});

module.exports = mongoose.model('Charge', chargeSchema);
