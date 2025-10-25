const express = require('express');
const cors = require("cors");
require('dotenv').config();

const connectDB = require('./config/connectDB');

const indexRouter = require('./routes/indexRouter');
const path = require("node:path");

const {
    PORT
} = process.env;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter);

app.use((req, res, next) => {
    const shop = req.query.shop || '';
    res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com https://*.myshopify.com;`
    );
    next();
});

app.use(express.static(path.join(__dirname, '../client/build')));

app.all(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});


connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});