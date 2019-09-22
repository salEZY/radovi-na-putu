const mongoose = require('mongoose')
const { URI } = require('./config')

const connectDb = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
    console.log('MongoDB connected!')
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

module.exports = connectDb