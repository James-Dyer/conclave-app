const mongoose = require('mongoose');

const chargeSchema = new mongoose.Schema({
  memberId: Number,
  memberName: String,
  amount: Number,
  dueDate: String,
  description: String,
  tags: [String],
  status: String
});

module.exports = mongoose.model('Charge', chargeSchema);
