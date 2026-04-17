const express = require('express');
const { authMiddleware } = require('../../middleware/auth.middleware');
const userController = require('./user.controller');

const router = express.Router();

router.get('/me', authMiddleware, userController.getProfile);
router.patch('/me', authMiddleware, userController.updateProfile);
router.delete('/me', authMiddleware, userController.deleteProfile);
router.get('/:id', userController.getUserById);

module.exports = router;
