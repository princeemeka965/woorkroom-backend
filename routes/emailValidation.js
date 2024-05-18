const express = require('express');
const router = express.Router();

const {
    sendOTP,
    verifyOTP
} = require('../controllers/EmailValidationController.js');

router.post('/send-otp', sendOTP);
router.post('/verifyOTP', verifyOTP)

module.exports = router