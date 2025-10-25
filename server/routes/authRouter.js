const express = require('express');
require('dotenv').config();

const {shopifyAuth, shopifyAuthCallback} = require('../controllers/authController')

const router = express.Router();

router.get('/auth', shopifyAuth);
router.get('/auth/callback', shopifyAuthCallback);

module.exports = router;