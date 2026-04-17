const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/user/user.routes');
const postRoutes = require('../modules/post/post.routes');
const commentRoutes = require('../modules/comment/comment.routes');
const reportRoutes = require('../modules/report/report.routes');
const adminRoutes = require('../modules/admin/admin.routes');

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;
