const asyncWrapper = require('../middleware/async')
require('dotenv').config()
const { spawn } = require('child_process');

const sendEmail = asyncWrapper(async(req, res) => {
    const pythonPromise = () => {
        return new Promise((resolve, reject) => {
            //emailMessage, emailTo
            const python = spawn("python", ['./emailSender/emailSender.py', req.body.emailMessage, req.body.emailTo]);
            python.stdout.on("data", (data) => {
                resolve(data.toString());
            });

            python.stderr.on("data", (data) => {
                reject(data.toString());
            });
        });
    };
    try {
        const dataFromPython = await pythonPromise();
        res.status(200).json(dataFromPython);

    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = sendEmail