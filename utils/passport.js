const GoogleStrategy = require('passport-google-oauth20').Strategy
const { googleClientID, googleClientSecret } = require('./config')

// Load user model
const GoogleUser = require('../models/Google')

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: '/google/callback',
        proxy: true
      },
      (accessToken, refreshToken, profile, cb) => {
        //console.log(accessToken);
        //console.log(profile);

        const newUser = {
          googleID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value
        }

        // Check for existing user
        GoogleUser.findOne({
          googleID: profile.id
        }).then(user => {
          if (user) {
            return cb(null, user)
          } else {
            // Create user
            new GoogleUser(newUser).save().then(user => {
              return cb(null, user)
            })
          }
        })
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user))
  })
}
