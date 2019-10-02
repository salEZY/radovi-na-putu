const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { JWT } = require('../utils/config')
const { check, validationResult } = require('express-validator')

const User = require('../models/User')
const { sendEmail } = require('../utils/helpers')
const auth = require('../utils/auth')

// Test route
router.get('/', (req, res) => res.send('User route!'))

// Register route
router.post(
  '/register',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check(
      'password2',
      'Please re-enter the password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password, password2 } = req.body

    if (password !== password2) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Niste uneli istu lozinku dva puta' }] })
    }

    try {
      // Check if user exists
      let user = await User.findOne({ email })

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Korisnik već postoji' }] })
      }

      user = new User({
        name,
        email,
        password
      })
      // Encrypt password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      await user.save()
      sendEmail(email, 'register')
      // JWT
      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(payload, JWT, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err
        res.json({ token })
      })
    } catch (err) {
      console.log(err.message)
      res.status(500).send('Server error!')
    }
  }
)

// Login route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body

    try {
      // Check if user exists
      let user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({
          errors: [{ msg: 'Uneli ste pogrešno korisničko ime ili password' }]
        })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: 'Uneli ste pogrešno korisničko ime ili password' }]
        })
      }

      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(payload, JWT, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err
        res.json({ token })
      })
    } catch (err) {
      console.log(err.message)
      res.status(500).send('Server error!')
    }
  }
)

// Reset password
router.put('/reset-password', async (req, res) => {
  const email = req.body.email

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Ne postoji korisnik sa odabranim email-om' }] })
    }

    const newPass = Math.floor(Math.random() * 10000000).toString()
    sendEmail(user.email, 'reset', newPass)

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPass, salt)

    await user.save()
    res.send(`Nov password Vam je poslat na adresu: ${user.email}`)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server error!')
  }
})

// Change password
router.put('/change-password', auth, async (req, res) => {
  const { password, password2, newPassword } = req.body

  if (password !== password2) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'Niste uneli istu lozinku dva puta' }] })
  }

  if (!newPassword) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'Molimo unesite novu lozinku' }] })
  }
  try {
    const user = await User.findById({ _id: req.user.id })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)

    await user.save()
    res.send(`${user.name} uspešno ste promenili lozinku!`)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server error!')
  }
})

module.exports = router
