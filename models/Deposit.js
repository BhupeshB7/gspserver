const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  image: {
    type: String,
  }
});

module.exports = mongoose.model('Deposit', userSchema);
