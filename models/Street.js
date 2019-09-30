const mongoose = require('mongoose')

const StreetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
  }
})

module.exports = Street = mongoose.model('street', StreetSchema)