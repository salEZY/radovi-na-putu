const mongoose = require('mongoose')

const GoogleSchema = new mongoose.Schema({
  googleID: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Google = mongoose.model('googleUsers', GoogleSchema)
