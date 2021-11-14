const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'must provide title'],
    trim: true,
  },
  start: {
    type: Date,
    required: [true, 'must provide start date'],
  },
  end: {
    type: Date,
    required: [true, 'must provide end date'],
  },
  allDay: {
    type: Boolean,
    require: [false],
    default: false,
  },
  resourceId: {
    type: Number,
    require: [false],
    default: 1,
  },
  userId: {
    type: String,
    require: [true, 'must provide userId'],
  },
})

module.exports = mongoose.model('Task', TaskSchema)
