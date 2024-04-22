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

app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
});

app.post('/tasks', (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: String(Date.now()), 
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'pending'
    };
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
