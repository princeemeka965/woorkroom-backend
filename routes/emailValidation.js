const express = require('express');
const router = express.Router();

const {
    sendOTP
} = require('../controllers/emailValidation.js');

router.post('/send-otp', sendOTP);

module.exports = router