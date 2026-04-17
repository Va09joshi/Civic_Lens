const express = require('express');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { roleMiddleware } = require('../../middleware/role.middleware');
const adminController = require('./admin.controller');

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

// ========== USER MANAGEMENT ==========
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', roleMiddleware(['SUPER_ADMIN']), adminController.deleteUser);
router.patch('/users/:id/ban', adminController.banUser);
router.patch('/users/:id/unban', adminController.unbanUser);
router.patch('/users/:id/verify', adminController.verifyUser);
router.patch('/users/:id/role', roleMiddleware(['SUPER_ADMIN']), adminController.updateUserRole);

// ========== POST MANAGEMENT ==========
router.get('/posts', adminController.getAllPosts);
router.patch('/posts/:id/block', adminController.blockPost);
router.patch('/posts/:id/unblock', adminController.unblockPost);
router.delete('/posts/:id', adminController.deletePostAdmin);

// ========== COMMENT MANAGEMENT ==========
router.get('/comments', adminController.getAllComments);
router.delete('/comments/:id', adminController.deleteCommentAdmin);

// ========== REPORT MANAGEMENT ==========
router.get('/reports', adminController.getAllReports);
router.patch('/reports/:id/resolve', adminController.resolveReport);

module.exports = router;
