const express = require('express');
const db = require('../DB/dbconnect');

const router = express.Router();

const createTasksTable = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) ,
    description VARCHAR(300),
    status VARCHAR(50)
  )
`;

db.query(createTasksTable, (err) => {
  if (err) {
    console.error('Error creating "tasks" table:', err);
  } else {
    console.log('"tasks" table created (or already exists)');
  }
});


router.get('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    db.query(sql, [taskId], (err, result) => {
        if (err) {
            console.error('Error fetching task:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(result[0]);
    });
});

router.get('/tasks', (req, res) => {
    let sql = 'SELECT * FROM tasks';
    const { status, sortBy, search } = req.query;

    if (status) {
        sql += ` WHERE status = '${status}'`;
    }

    if (sortBy) {
        sql += ` ORDER BY ${sortBy}`;
    }

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (search) {
            const searchQuery = `%${search}%`;
            result = result.filter(task =>
                task.title.toLowerCase().includes(searchQuery) ||
                task.description.toLowerCase().includes(searchQuery)
            );
        }
        res.json(result);
    });
});



router.post('/tasks', (req, res) => {
    // Extract task data from request body
    const { title, description , status} = req.body;
  
    // Insert task into "tasks" table
    const insertTaskQuery = 'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)';
    db.query(insertTaskQuery, [title, description, status], (err, result) => {
      if (err) {
        console.error('Error adding task:', err);
        res.status(500).json({ error: 'Failed to add task' });
      } else {
        console.log('Task added successfully:', result);
        res.status(201).json({ message: 'Task added successfully' });
      }
    });
  });

router.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, description, status } = req.body;
    const sql = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?';
    db.query(sql, [title, description, status || 'pending', taskId], (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({
            id: taskId,
            title,
            description,
            status: status || 'pending'
        });
    });
});

router.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query(sql, [taskId], (err, result) => {
        if (err) {
            console.error('Error deleting task:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.sendStatus(204);
    });
});

module.exports = router;

