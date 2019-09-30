const jwt = require('jsonwebtoken')
const { JWT } = require('./config')

module.exports = (req, res, next) => {
  // get token from header
  const token = req.header('x-auth-token')
  // check if no token
  if (!token) {
    return res.status(401).json({
      msg: 'No token, denied!'
    })
  }
  // Verify token
  try {
    const decoded = jwt.verify(token, JWT)
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid!' })
  }
}
