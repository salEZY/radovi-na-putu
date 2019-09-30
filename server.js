require('dotenv').config()
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const passport = require('passport')
const { check, validationResult } = require('express-validator')

const connectDb = require('./utils/db')
const Street = require('./models/Street')
const auth = require('./utils/auth')

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

// Show all closed streets
app.get('/streets', async (req, res) => {
  try {
    const streets = await Street.find()
    res.json(streets)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error!')
  }
})
// Add a closed street
app.post(
  '/add',
  [
    auth,
    [
      check('name', 'Ime ulice je obavezno')
        .not()
        .isEmpty(),
      check('startLat', 'Pocetna latituda je obavezna')
        .not()
        .isEmpty(),
      check('startLon', 'Pocetna longituda je obavezna')
        .not()
        .isEmpty(),
      check('endLat', 'Krajnja latituda je obavezna')
        .not()
        .isEmpty(),
      check('endLon', 'Krajnja longituda je obavezna')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, description, startLat, startLon, endLat, endLon } = req.body
    const closedStreet = {
      user: req.user.id,
      name,
      description,
      startLat,
      startLon,
      endLat,
      endLon
    }

    try {
      let street = await Street.findOne({ user: req.user.id })

      if (street) {
        return res
          .status(400)
          .json({ msg: 'Ulica vec postoji u bazi podataka!' })
      }

      street = new Street(closedStreet)
      await street.save()
      res.send(`Ulica ${street.name} je ubacena u bazu podataka!`)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error!')
    }
  }
)

// io.on('connection', socket => {
//   console.log('da')
//   socket.on('street add', street => {
//     io.sockets.emit(`Ulica ${street.name} dodata u spisak zatvorenih ulica!`)
//   })
// })

http.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}!`)
})
