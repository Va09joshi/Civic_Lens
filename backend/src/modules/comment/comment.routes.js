const express = require('express');
const { authMiddleware, optionalAuth } = require('../../middleware/auth.middleware');
const { apiLimiter } = require('../../middleware/rateLimit.middleware');
const commentController = require('./comment.controller');

const router = express.Router();

router.post('/', authMiddleware, apiLimiter, commentController.createComment);
router.get('/:postId', optionalAuth, commentController.getCommentsByPost);
router.get('/detail/:id', commentController.getCommentById);
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;
