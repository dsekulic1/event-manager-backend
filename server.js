const { everyDayJob, jobForAdd } = require('./controllers/scheduleController')
require('dotenv').config()
require('express-async-errors')

//express
const express = require('express')
const app = express()

// rest of the packages
const cookieParser = require('cookie-parser')
//const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const fileUpload = require('express-fileupload')
const rateLimiter = require('express-rate-limit')

//db
const connectDB = require('./db/connect')

//routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const slack = require('./routes/slack')
const email = require('./routes/email')
const tasks = require('./routes/tasks')

//middleware
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
)
//app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

//app.use(express.static('./public'))
app.use(fileUpload())
app.use(express.json())
//app.use(job())
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/tasks', tasks)
app.use('/api/v1/slack', slack)
app.use('/api/v1/email', email)

app.use(notFound)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 8080

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`App listening at http://localhost:${port}`))
  } catch (error) {
    console.log(error)
  }
}
everyDayJob()
jobForAdd()
start()
