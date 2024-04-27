const express = require('express');
const db = require('./DB/dbconnect');
const routes = require('./routes/router');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
