const mysql = require('mysql');
require("dotenv").config();

const db = mysql.createConnection({
    host: "localhost",
    user: "mysqldib",
    password: "nafipass",
    database: "task_manager"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.stack);
        return;
    }
    console.log('Connected to database.');
});
const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) ,
    email VARCHAR(200),
    password VARCHAR(200),
    role VARCHAR(200)
  )
`;

// Create user table if not exists
db.query(createUserTable, (err) => {
  if (err) {
    console.error('Error creating "users" table:', err);
  } else {
    console.log('"users" table created (or already exists)');
  }
});

const createTasksTable = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT,
    title VARCHAR(255) ,
    description VARCHAR(300),
    status VARCHAR(50),
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
  )
`;

db.query(createTasksTable, (err) => {
  if (err) {
    console.error('Error creating "tasks" table:', err);
  } else {
    console.log('"tasks" table created (or already exists)');
  }
});


module.exports = db;


// sudo /opt/lampp/lampp start
// sudo /opt/lampp/manager-linux-x64.run
