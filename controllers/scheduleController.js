const { sendEventEmail } = require('./email')
const { getTodayTasks } = require('./tasks')
const { getUsers } = require('./userController')
const CustomError = require('../errors')
const schedule = require('node-schedule')
const User = require('../models/User')
const Task = require('../models/Task')
module.exports = () => {
  schedule.scheduleJob('*/0 */0 * * *', async () => {
    for (const job in schedule.scheduledJobs) schedule.cancelJob(job)
    try {
      //getting tasks from db
      var x = new Date().getTimezoneOffset() * 60000
      var localISOTime = new Date(Date.now() - x).toISOString().slice(0, -1)
      const startDate = localISOTime.split('T')[0]
      const date = new Date(Date.now() - x)
      date.setDate(date.getDate() + 1)
      const endDate = date.toISOString().slice(0, -1).split('T')[0]

      const tasks = await Task.find(
        {
          start: {
            $gte: startDate,
            $lt: endDate,
          },
        },
        { _id: 1, title: 1, start: 1, end: 1, userId: 1 }
      )

      //getting user from db
      const users = await User.find({}, { _id: 1, name: 1, email: 1 })
      let schedules = {}
      //schedule cron job at specific time
      tasks.map((task) => {
        const { title, start, end, userId, _id } = task
        const { name, email } = users.filter((obj) => {
          return obj._id == userId
        })[0]

        var dateS = new Date(start)
        var hours = dateS.getHours()
        var minutes = dateS.getMinutes()
        if (minutes === 0) {
          minutes = 30
          hours = hours - 1
        } else {
          minutes = minutes - 30
        }
        console.log(hours + '----' + minutes)
        const data = {
          name: name,
          title: title,
          start: start,
          end: end,
        }
        schedules[`${_id}`] = schedule.scheduleJob(
          { hour: hours, minute: minutes },
          function () {
            sendEventEmail(email, data)
          }
        )
      })
    } catch (error) {
      console.log(error)
      throw new CustomError.BadRequestError(error)
    }
  })
}
