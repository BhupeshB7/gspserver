const mongoose = require('mongoose');

const WithdrawalRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  accountNo:{
    type: String,
    default:0,
  },
  ifscCode:{
    type: String,
    default:0,
  },
  GPay:{
    type: String,
    default:0,
  },
  transactionNumber:{
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('WithdrawalRequest', WithdrawalRequestSchema);
