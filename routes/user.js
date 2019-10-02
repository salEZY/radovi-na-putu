const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT } = require('../utils/config')
const { check, validationResult } = require('express-validator')

const User = require('../models/User')
const { sendEmail } = require('../utils/helpers')

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
        .json({ errors: [{ msg: 'Passwords do not match' }] })
    }

    try {
      // Check if user exists
      let user = await User.findOne({ email })

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] })
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
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] })
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

module.exports = router
