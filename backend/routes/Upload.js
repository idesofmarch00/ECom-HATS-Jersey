const express = require('express');
const { uploadImage } = require('../controller/Upload');
const { upload } = require('../services/cloudinary');
const router = express.Router();

router.post('/', upload.single('image'), uploadImage);

exports.router = router;
