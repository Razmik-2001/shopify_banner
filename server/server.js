const express = require('express');
require('dotenv').config();

const connectDB = require('./config/connectDB');

const indexRouter = require('./routes/indexRouter');
const path = require("node:path");

const {
    PORT
} = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter);

app.use(express.static(path.join(__dirname, '../client/build')));

app.all(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});


connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});