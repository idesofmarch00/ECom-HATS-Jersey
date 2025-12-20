const express = require('express');
const { fetchBanners, createBanner, deleteBanner } = require('../controller/Banner');
const router = express.Router();

// Public — anyone can see banners
router.get('/', fetchBanners);

// Admin only — create and delete banners
router.post('/', createBanner);
router.delete('/:id', deleteBanner);

exports.router = router;
