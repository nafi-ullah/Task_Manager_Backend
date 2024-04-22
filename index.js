const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const taskFilePath = path.join(__dirname, 'tasklist.json');

app.use(express.json());

function readTasks() {
    try {
        const tasksData = fs.readFileSync(taskFilePath);
        return JSON.parse(tasksData);
    } catch (error) {
        if (error.code === 'ENOENT') {
          
            fs.writeFileSync(taskFilePath, '[]');
            return [];
        } else {
            throw error;
        }
    }
}

function writeTasks(tasks) {
    fs.writeFileSync(taskFilePath, JSON.stringify(tasks, null, 2));
}

function validateTask(task) {
    if (!task.title || !task.description || !task.status) {
        return false;
    }
    return true;
}


app.get('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
});

// hit url /tasks?status=pending or /tasks?status=completed 
// sort /tasks?sortBy=title or /tasks?sortBy=status
app.get('/tasks', (req, res) => {
    let tasks = readTasks();

    if (req.query.status) {
        tasks = tasks.filter(task => task.status === req.query.status);
    }

    if (req.query.sortBy) {
        tasks.sort((a, b) => {
            if (a[req.query.sortBy] < b[req.query.sortBy]) return -1;
            if (a[req.query.sortBy] > b[req.query.sortBy]) return 1;
            return 0;
        });
    }

    if (req.query.search) {
        const searchQuery = req.query.search.toLowerCase();
        const filteredTasks = tasks.filter(task =>
            task.title.toLowerCase().includes(searchQuery) ||
            task.description.toLowerCase().includes(searchQuery)
        );
        return res.json(filteredTasks);
    }

    res.json(tasks);
});


app.post('/tasks', (req, res) => {
   
    const newTask = {
        id: String(Date.now()), 
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'pending'
    };

    if (!validateTask(newTask)) {
        return res.status(400).json({ error: 'Title, description, and status are required fields' });
    }

    const tasks = readTasks();
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const updatedTask = {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'pending'
    };

    if (!validateTask(updatedTask)) {
        return res.status(400).json({ error: 'Title, description, and status are required fields' });
    }

    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);
    res.json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const filteredTasks = tasks.filter(t => t.id !== req.params.id);
    if (tasks.length === filteredTasks.length) {
        return res.status(404).json({ error: 'Task not found' });
    }
    writeTasks(filteredTasks);
    res.sendStatus(204);
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
