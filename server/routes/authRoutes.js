const express = require('express');
const router = express.Router();
const { signup, login, googleAuth, googleCallback, guestLogin } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/guest', guestLogin);

// Google OAuth
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

module.exports = router;
