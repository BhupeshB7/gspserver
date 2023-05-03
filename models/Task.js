// server/models/Task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  videoLink: {
    type: String,
    // required: true,
  },
  watched: {
    type: Boolean,
    default: false
  },
  locked: {
    type: Boolean,
    default: false
  }
},
{timestamps:true}
);

module.exports = mongoose.model('Tasks2', taskSchema);
