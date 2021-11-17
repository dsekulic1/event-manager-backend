const { getTodayTasks } = require('./tasks')

const cron = require('node-cron')

module.exports = () => {
  cron.schedule('5 * * * *', () => {
    const tasks = getTodayTasks()
    console.log(Date.now())
    console.log('Task is running every 5 minute ' + tasks.tasks)
  })
}
