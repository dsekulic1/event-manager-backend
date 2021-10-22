const connectDB = require('./db/connect')
const express = require('express')
const app = express()
const tasks = require('./routes/tasks')
const slack = require('./routes/slack')
const email = require('./routes/email')
    //middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//routes
app.use('/api/v1/tasks', tasks);
//get all the tasks
//create a new task
//get single task
//update task
//delete task
app.use('/api/v1/slack', slack);
app.use('/api/v1/email', email);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8080;

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`App listening at http://localhost:${port}`));
    } catch (error) {
        console.log(error);
    }
}

start()