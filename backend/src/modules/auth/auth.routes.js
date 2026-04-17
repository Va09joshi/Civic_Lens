const express = require('express');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { authLimiter } = require('../../middleware/rateLimit.middleware');
const authController = require('./auth.controller');

const router = express.Router();

router.post('/signup', authLimiter, authController.signup);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.post('/refresh-token', authMiddleware, authController.refreshToken);

module.exports = router;
