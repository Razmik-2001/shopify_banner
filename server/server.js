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

// CSP և X-Frame-Options ուղղված middleware
app.use((req, res, next) => {
    // Հանում ենք հնացած X-Frame-Options հեդերը
    res.removeHeader("X-Frame-Options");

    const shop = req.query.shop;
    let frameAncestors = "https://admin.shopify.com https://*.myshopify.com";

    // Եթե shop կա, ավելացնում ենք CSP-ում
    if (shop) {
        frameAncestors = `https://${shop} ${frameAncestors}`;
    }

    res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors ${frameAncestors};`
    );

    next();
});

// Express static + fallback - առանց փոփոխության
app.use(express.static(path.join(__dirname, '../client/build')));

app.all(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
