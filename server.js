const express = require('express')
const bodyParser = require('body-parser')

const connectDb  = require('./utils/db')
const PORT = process.env.PORT || 5000

const app = express()
connectDb()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('U svakom trenutku proverite koje ulice su zatvorene!')
})

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}!`)
})