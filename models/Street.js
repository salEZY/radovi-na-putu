const mongoose = require('mongoose')

const StreetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  startLat: {
    type: Number,
    required: true
  },
  startLon: {
    type: Number,
    required: true
  },
  endLat: {
    type: Number,
    required: true
  },
  endLon: {
    type: Number,
    required: true
  },
  closed: {
    type: Boolean,
    default: true
  },
  user: {
    type: String,
    required: true
  }
})

module.exports = Street = mongoose.model('street', StreetSchema)
