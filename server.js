require('dotenv').config()
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const passport = require('passport')

const connectDb = require('./utils/db')
const Street = require('./models/Street')

connectDb()
require('./utils/passport')(passport)
//app.use(express.json({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())

app.use('/user', require('./routes/user'))
app.use('/google', require('./routes/google'))

app.get('/', (req, res) => {
  res.send('U svakom trenutku proverite koje ulice su zatvorene!')
})

// io.on('connection', socket => {
//   console.log('da')
//   socket.on('street add', street => {
//     io.sockets.emit(`Ulica ${street.name} dodata u spisak zatvorenih ulica!`)
//   })
// })

http.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}!`)
})
