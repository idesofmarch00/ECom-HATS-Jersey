const express = require('express');
const { handleWhatsappWebhook } = require('../controller/Whatsapp');
const router = express.Router();

router.post('/', handleWhatsappWebhook);

exports.router = router;
