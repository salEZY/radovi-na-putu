require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')

const connectDb = require('./utils/db')
require('./utils/passport')(passport)

const app = express()
connectDb()
app.use(express.json({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())

app.use('/user', require('./routes/user'))
app.use('/google', require('./routes/google'))

app.get('/', (req, res) => {
  res.send('U svakom trenutku proverite koje ulice su zatvorene!')
})

app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}!`)
})
