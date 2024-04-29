const express = require('express');
const db = require('../DB/dbconnect');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const router = express.Router();


router.get('/tasks/:id',auth, (req, res) => {
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

//http://localhost:3000/tasks?status=complete
//http://localhost:3000/tasks
//http://localhost:3000/tasks?sortBy=title
//http://localhost:3000/tasks?search=porte

router.get('/tasks',admin, (req, res) => {
    let sql = 'SELECT * FROM tasks';
    const { status, sortBy, search } = req.query;
    let conditions = [];

    if (status) {
        sql += ` WHERE status = '${status}'`;
    }

    if (sortBy) {
        sql += ` ORDER BY ${sortBy}`;
    }

    if (search) {
        const searchQuery = `%${search}%`;
        conditions.push(`(title LIKE '${searchQuery}' OR description LIKE '${searchQuery}')`);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }


    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
       
        res.json(result);
    });
});

// GET /tasks?userid=123&status=completed&sortBy=title&search=meeting
router.get('/usertasks',auth, (req, res) => {
    const userId = req.query.userid; 
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    let sql = 'SELECT * FROM tasks WHERE userid = ?';
    const { status, sortBy, search } = req.query;
    const params = [userId];

    if (status) {
        sql += ' AND status = ?';
        params.push(status);
    }

    if (search) {
        const searchQuery = `%${search}%`;
        sql += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(searchQuery, searchQuery);
    }

    if (sortBy) {
        sql += ` ORDER BY ${sortBy}`;
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(result);
    });
});




router.post('/tasks',auth, (req, res) => {
    // Extract task data from request body
    const { userid, title, description, status } = req.body;
  
    // Insert task into "tasks" table
    const insertTaskQuery = 'INSERT INTO tasks (userid, title, description, status) VALUES (?, ?, ?, ?)';
    db.query(insertTaskQuery, [userid, title, description, status], (err, result) => {
      if (err) {
        console.error('Error adding task:', err);
        res.status(500).json({ error: 'Failed to add task' });
      } else {
        console.log('Task added successfully:', result);
        res.status(201).json({ message: 'Task added successfully' });
      }
    });
});


router.put('/tasks/:id',auth, (req, res) => {
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

router.delete('/tasks/:id',auth, (req, res) => {
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

