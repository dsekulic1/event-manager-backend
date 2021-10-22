const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputDOM = document.querySelector('.task-input')
const formAlertDOM = document.querySelector('.form-alert')
const slackInputDOM = document.querySelector('.slack-input')
const emailMessageInputDOM = document.querySelector('.email-text-input')
const emailToInputDOM = document.querySelector('.email-to-input')
const channelNameInputDOM = document.querySelector('.slack-channel-input')
const slackEmailToInputDOM = document.querySelector('.slack-join-input')
    // Load tasks from /api/tasks
const showTasks = async() => {
    loadingDOM.style.visibility = 'visible'
    try {
        const {
            data: { tasks },
        } = await axios.get('/api/v1/tasks')
        if (tasks.length < 1) {
            tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>'
            loadingDOM.style.visibility = 'hidden'
            return
        }
        const allTasks = tasks
            .map((task) => {
                const { completed, _id: taskID, name } = task
                return `<div class="single-task ${completed && 'task-completed'}">
<h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
<div class="task-links">



<!-- edit link -->
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`
            })
            .join('')
        tasksDOM.innerHTML = allTasks
    } catch (error) {
        tasksDOM.innerHTML =
            '<h5 class="empty-list">There was an error, please try later....</h5>'
    }
    loadingDOM.style.visibility = 'hidden'
}

showTasks()

// delete task /api/tasks/:id

tasksDOM.addEventListener('click', async(e) => {
    const el = e.target
    if (el.parentElement.classList.contains('delete-btn')) {
        loadingDOM.style.visibility = 'visible'
        const id = el.parentElement.dataset.id
        try {
            await axios.delete(`/api/v1/tasks/${id}`)
            showTasks()
        } catch (error) {
            console.log(error)
        }
    }
    loadingDOM.style.visibility = 'hidden'
})

// form

formDOM.addEventListener('submit', async(e) => {
    e.preventDefault()
    const name = taskInputDOM.value

    try {
        await axios.post('/api/v1/tasks', { name })
        showTasks()
        taskInputDOM.value = ''
        formAlertDOM.style.display = 'block'
        formAlertDOM.textContent = `success, task added`
        formAlertDOM.classList.add('text-success')
    } catch (error) {
        formAlertDOM.style.display = 'block'
        formAlertDOM.innerHTML = `error, please try again`
    }
    setTimeout(() => {
        formAlertDOM.style.display = 'none'
        formAlertDOM.classList.remove('text-success')
    }, 3000)
})

async function sendSlackMessage() {
    const message = slackInputDOM.value;
    slackInputDOM.value = '';
    await axios.post('/api/v1/slack', { message })
}

async function sendEmail() {
    const emailMessage = emailMessageInputDOM.value;
    const emailTo = emailToInputDOM.value;
    emailMessageInputDOM.value = '';
    emailToInputDOM.value = ''
    await axios.post('/api/v1/email', { emailMessage, emailTo })
}

async function createChannel() {
    const channel = channelNameInputDOM.value;
    await axios.post('/api/v1/slack/create', { channel }).then(async response => {
        const channelId = response.data.channelId.replace(/ /g, '');
        const emailMessage = "Plesae join your channel: " + "https://eventmanagerglobal.slack.com/app_redirect?channel=" + channelId;
        const emailTo = slackEmailToInputDOM.value;
        slackEmailToInputDOM.value = '';
        channelNameInputDOM.value = ''
        await axios.post('/api/v1/email', { emailMessage, emailTo })
    })

}