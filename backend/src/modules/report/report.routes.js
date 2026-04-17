const express = require('express');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { apiLimiter } = require('../../middleware/rateLimit.middleware');
const reportController = require('./report.controller');

const router = express.Router();

router.post('/', authMiddleware, apiLimiter, reportController.createReport);
router.get('/post/:postId', reportController.getReportsByPost);

module.exports = router;
