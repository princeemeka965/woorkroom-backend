const express = require('express');
const router = express.Router();

const {
    createAccount
} = require('../controllers/AuthenticationController.js');

router.post('/create-account', createAccount);

module.exports = router