const { sendEventEmail } = require('./email')
const { getTodayTasks } = require('./tasks')

const cron = require('node-cron')

module.exports = () => {
  cron.schedule('*/1 * * * *', () => {
    // const tasks = getTodayTasks()
    // console.log(ISODate(Date.now()))
    //sendEventEmail()
    console.log('Task is running every 5 minute ')
  })
}
