const asyncWrapper = require('../middleware/async')
require('dotenv').config()
const { spawn } = require('child_process');
const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_API_TOKEN;
const client = new WebClient(token);

const sendMessage = asyncWrapper(async(req, res) => {
    try {
        // Call the chat.postMessage method using the WebClient
        const result = await client.chat.postMessage({
            channel: '#new',
            text: ':100: Hello :tada:'
        });
        //console.log(result);
    } catch (error) {
        // console.error(error);
    }
})

const createChannel = asyncWrapper(async(req, res) => {
    const pythonPromise = () => {
        return new Promise((resolve, reject) => {
            const python = spawn("python", ['./slackBot/createChannel.py', req.body.channel]);
            python.stdout.on("data", (data) => {
                resolve(data.toString());
            });

            python.stderr.on("data", (data) => {
                reject(data.toString());
            });
        });
    };
    try {
        const channelId = await pythonPromise();
        res.status(201).json({ channelId });
    } catch (error) {
        res.status(500).json(error);
    }
    return res;
})

module.exports = { sendMessage, createChannel }