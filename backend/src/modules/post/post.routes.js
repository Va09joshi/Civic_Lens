const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinary');
const { authMiddleware, optionalAuth } = require('../../middleware/auth.middleware');
const { apiLimiter } = require('../../middleware/rateLimit.middleware');
const postController = require('./post.controller');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'civiclens/posts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    resource_type: 'image',
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/', authMiddleware, apiLimiter, upload.array('images', 5), postController.createPost);
router.get('/', optionalAuth, postController.getPosts);
router.get('/:id', optionalAuth, postController.getPostById);
router.patch('/:id', authMiddleware, upload.array('images', 5), postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);
router.post('/:id/like', authMiddleware, postController.toggleLike);
router.get('/category/:category', optionalAuth, postController.getPostsByCategory);
router.get('/city/:city', optionalAuth, postController.getPostsByCity);

module.exports = router;
