const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  (req, res) => {
    console.log('DA')
  }
)

router.get('/verify', (req, res) => {
  if (req.user) {
    console.log(req.user)
  } else {
    console.log('Not Auth')
  }
})

router.get('/error', (req, res) => {
  res.send('OAuth not working')
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
  console.log('Logged out!')
})

module.exports = router
