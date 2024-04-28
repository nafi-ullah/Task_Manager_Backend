const mysql = require('mysql');

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

module.exports = db;


// sudo /opt/lampp/lampp start
// sudo /opt/lampp/manager-linux-x64.run
