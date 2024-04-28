const express = require('express');
const db = require('./DB/dbconnect');
const routes = require('./routes/router');
const userRoutes = require('./routes/user');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use('/users', userRoutes);
app.use('/', routes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
