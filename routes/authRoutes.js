const express = require('express')
const router = express.Router()

const {
  register,
  login,
  logout,
  passwordReset,
  resetPassword,
} = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.post('/passwordreset', passwordReset)
router.post('/resetpassword', resetPassword)
module.exports = router
