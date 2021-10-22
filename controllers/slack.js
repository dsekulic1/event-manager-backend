const asyncWrapper = require('../middleware/async')
require('dotenv').config()
const { spawn } = require('child_process');

const sendMessage = asyncWrapper(async(req, res) => {
    const pythonPromise = () => {
        return new Promise((resolve, reject) => {
            const python = spawn("python", ['./slackBot/slack.py', req.body.message]);
            python.stdout.on("data", (data) => {
                resolve(data.toString());
            });

            python.stderr.on("data", (data) => {
                reject(data.toString());
            });
        });
    };
    // need to refactoring this to use custom error message and handle all on frontend
    try {
        const dataFromPython = await pythonPromise();
        res.status(201).json(dataFromPython);
    } catch (error) {
        res.status(500).json(error);
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