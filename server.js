const connectDB = require('./db/connect')
const express = require('express')
var cors = require('cors')
const app = express()
const tasks = require('./routes/tasks')
const slack = require('./routes/slack')
const email = require('./routes/email')
require('dotenv').config()
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

<<<<<<< HEAD
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

=======
//middleware
>>>>>>> c715c16114bb22527af8a4ac012ae0497a29887f
app.use(express.static('./public'))
app.use(express.json())
app.use(cors())
app.options('*', cors())
//routes
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

start()
