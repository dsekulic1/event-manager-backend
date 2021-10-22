require('dotenv').config()
const { spawn } = require('child_process');



function createSlackChannel(channel) {
    const pythonPromise = () => {
        return new Promise((resolve, reject) => {
            const python = spawn("python", ['./slackBot/createChannel.py', channel]);
            python.stdout.on("data", (data) => {
                resolve(data.toString());
            });

            python.stderr.on("data", (data) => {
                reject(data.toString());
            });
        });
    };
    try {
        const data = await pythonPromise();
        return data;
    } catch (error) {
        return error;
    }
}

module.exports = createSlackChannel