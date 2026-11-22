const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getGoogleAuthUrl, handleGoogleCallback } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.get('/google', protect, getGoogleAuthUrl);
router.get('/google/callback', handleGoogleCallback);

module.exports = router;
