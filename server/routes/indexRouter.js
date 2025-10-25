const express = require('express');

const authRouter = require('./authRouter');
const bannerRouter = require('./bannerRouter');

const router = express.Router();

router.use('/', authRouter);
router.use('/', bannerRouter);

module.exports = router;