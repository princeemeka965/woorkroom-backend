const express = require('express');
const router = express.Router();

const {
    createAccount, loginAccount, lynchpinValidate
} = require('../controllers/AuthenticationController.js');

router.post('/create-account', createAccount);
router.post('/login-account', loginAccount);
router.post('refresh_lynchpin', lynchpinValidate);

module.exports = router