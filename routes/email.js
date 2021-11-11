const express = require('express')
const router = express.Router()

const { sendEmail, sendPasswordResetEmail } = require('../controllers/email')

router.route('/').post(sendEmail)

module.exports = router
