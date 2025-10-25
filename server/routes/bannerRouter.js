const express = require('express');
const {getBanners, createBanner} = require('../controllers/BannerController');

const router = express.Router();

router.get('/ads', getBanners);
router.post('/ads/create', createBanner);

module.exports = router;