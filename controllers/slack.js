const asyncWrapper = require('../middleware/async')
require('dotenv').config()
const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_API_TOKEN;
const client = new WebClient(token);

const sendMessage = asyncWrapper(async(req, res) => {
    const messageResult = await client.chat.postMessage({ channel: '#new', text: ':100:' + req.body.message + ':tada:' });
    if (!messageResult.ok) {
        return next(createCustomError(`Error : ${messageResult['error']}`, 500))
    }
    return res.status(201).json({ messageResult });
})

const createChannel = asyncWrapper(async(req, res) => {
    const result = await client.conversations.create({ name: req.body.channel });
    if (!result.ok) {
        return next(createCustomError(`Error : ${result['error']}`, 500))
    }
    channelId = result["channel"]["id"].trim();
    console.log(channelId);
    result = await client.conversations.members(channel = channelId, limit = 2);
    if (!result.ok) {
        return next(createCustomError(`Error : ${result['error']}`, 500))
    }
    return res.status(201).json({ channelId });
})

module.exports = { sendMessage, createChannel }