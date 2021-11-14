const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const CustomError = require('../errors')
const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({})
  res.status(200).json({ tasks })
})

const createTask = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body)
  res.status(201).json({ task })
})
const getTaskByUser = asyncWrapper(async (req, res, next) => {
  const { userId: userId } = req.params
  const tasks = await Task.find({ userId: userId })
  if (!task) {
    return next(CustomError.NotFoundError(`No task with id : ${userId}`))
  }
  res.status(200).json({ tasks })
})
const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params
  const task = await Task.findOne({ _id: taskID })
  if (!task) {
    return next(CustomError.NotFoundError(`No task with id : ${taskID}`))
  }
  res.status(200).json({ task })
})
const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params
  const task = await Task.findOneAndDelete({ _id: taskID })
  if (!task) {
    return next(CustomError.NotFoundError(`No task with id : ${taskID}`))
  }
  res.status(200).json({ task })
})
const updateTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params

  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  })

  if (!task) {
    return next(CustomError.NotFoundError(`No task with id : ${taskID}`))
  }

  res.status(200).json({ task })
})

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getTaskByUser,
}
