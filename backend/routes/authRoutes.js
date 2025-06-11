const express = require('express');
const router = express.Router();
const { createNewUser, loginUser, sendOtp, verifyOtp } = require('../controllers/authController');

router.post('/signup', createNewUser);

router.post('/login', loginUser);

router.post('/otp/send', sendOtp);

router.post('/otp/verify', verifyOtp);

module.exports = router;
