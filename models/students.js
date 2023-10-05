const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  num: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  sType: {
    type: String,
    required: true
  },
  package: {
    type: Number,
    required: true
  },
  colour: {
    type: Number,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  startYr: {
    type: Number,
    required: true
  },
  startMth: {
    type: Number,
    required: true
  },
  startDay: {
    type: Number,
    required: true
  },
  classesNishCancelled: {
    type: Number,
    required: true
  },
  birthday: {
    type: String,
    required: true
  },
  studentImageFileName: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Student',studentSchema);