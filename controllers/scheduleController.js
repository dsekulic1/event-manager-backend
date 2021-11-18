const { sendEventEmail } = require('./email')
const { getTodayTasks } = require('./tasks')
const { getUsers } = require('./userController')
const CustomError = require('../errors')
const schedule = require('node-schedule')
const User = require('../models/User')
const Task = require('../models/Task')
var schedules = []
var localISOTime = new Date()

const jobForAdd = () => {
  schedule.scheduleJob('*/25 * * * *', async () => {
    for (const job in schedule.scheduledJobs) schedule.cancelJob(job)
    try {
      var x = new Date().getTimezoneOffset() * 60000
      var localISOTime = new Date(Date.now() - x).toISOString().slice(0, -1)
      const startDate = localISOTime.split('T')[0]
      //getting tasks from db
      const tasks = await Task.find(
        {
          start: {
            $gte: startDate,
          },
        },
        { _id: 1, title: 1, start: 1, end: 1, userId: 1 }
      )

      //getting user from db
      const users = await User.find({}, { _id: 1, name: 1, email: 1 })

      //schedule cron job at specific time
      tasks.map((task) => {
        const { title, start, end, userId, _id } = task

        //get name and email for specific user
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

        const data = {
          name: name,
          title: title,
          start: start,
          end: end,
        }
        if (!schedules.includes(`${_id}`))
          schedules[`${_id}`] = schedule.scheduleJob(
            {
              hour: hours,
              minute: minutes,
              year: dateS.getFullYear(),
              month: dateS.getMonth(),
              day: dateS.getDay(),
            },
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

const everyDayJob = () => {
  schedule.scheduleJob('*/0 */0 * * *', async () => {
    for (const job in schedule.scheduledJobs) schedule.cancelJob(job)
    try {
      //getting tasks from db
      const tasks = await Task.find(
        {},
        { _id: 1, title: 1, start: 1, end: 1, userId: 1 }
      )

      //getting user from db
      const users = await User.find({}, { _id: 1, name: 1, email: 1 })

      //schedule cron job at specific time
      tasks.map((task) => {
        const { title, start, end, userId, _id } = task

        //get name and email for specific user
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

        const data = {
          name: name,
          title: title,
          start: start,
          end: end,
        }
        if (!schedules.includes(`${_id}`))
          schedules[`${_id}`] = schedule.scheduleJob(
            {
              hour: hours,
              minute: minutes,
              year: dateS.getFullYear(),
              month: dateS.getMonth(),
              day: dateS.getDay(),
            },
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
const deleteTaskScheduler = (taskId) => {
  schedule.cancelJob(schedules[`${taskId}`])
}

module.exports = {
  jobForAdd: jobForAdd,
  everyDayJob: everyDayJob,
  deleteTaskScheduler: deleteTaskScheduler,
}
