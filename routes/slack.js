const express = require('express')
const router = express.Router()

const { sendMessage, createChannel } = require('../controllers/slack')

router.route('/').post(sendMessage)
router.route('/create').post(createChannel)

module.exports = router