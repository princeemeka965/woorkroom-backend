const express = require('express');
const router = express.Router();

const {
    createAccount, loginAccount
} = require('../controllers/AuthenticationController.js');

router.post('/create-account', createAccount);
router.post('/login-account', loginAccount);

module.exports = router