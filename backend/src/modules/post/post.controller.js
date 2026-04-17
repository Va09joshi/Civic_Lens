const Post = require('./post.model');
const User = require('../user/user.model');
const Comment = require('../comment/comment.model');
const { sendResponse } = require('../../utils/apiResponse');
const { validate, schemas } = require('../../utils/validators');
const { getPaginationParams, getMetadata } = require('../../utils/pagination');
const { AppError } = require('../../middleware/error.middleware');
const { analyzeCredibility } = require('../ai/ai.service');
const cloudinary = require('../../config/cloudinary');

const withLikeSummary = (post, currentUserId) => {
  const likes = post.likes || [];
  const likesCount = likes.length;
  const likedByMe = currentUserId
    ? likes.some(like => like && like._id && like._id.toString() === currentUserId.toString())
    : false;

  return {
    ...post,
    likesCount,
    likedByMe,
  };
};

exports.createPost = async (req, res, next) => {
  try {
    const { error, value } = validate(schemas.createPost, req.body);

    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      throw new AppError(400, messages);
    }

    const { title, description, category, type, location } = value;

    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
      }));
    }

    // Create post
    const post = new Post({
      title,
      description,
      category,
      type,
      images,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat],
        city: location.city,
      },
      createdBy: req.user.id,
    });

    // Run AI analysis in background (don't wait)
    analyzeCredibility(title, description)
      .then(analysis => {
        post.aiAnalysis = analysis;
        return post.save();
      })
      .catch(err => console.error('Background AI analysis failed:', err));

    await post.save();

    const populatedPost = await post.populate('createdBy', 'name email avatar');

    sendResponse(res, 201, populatedPost, 'Post created successfully');
  } catch (error) {
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { category, city, sortBy = 'latest' } = req.query;

    // Build filter
    const filter = {};
    filter.isDeleted = false;
    filter.isBlocked = false;

    if (category) {
      filter.category = category;
    }
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    // Build sort
    const sort = sortBy === 'trending' ? { likes: -1, createdAt: -1 } : { createdAt: -1 };

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('createdBy', 'name email avatar')
      .populate('likes', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const transformedPosts = posts.map(post => withLikeSummary(post, req.user?.id));

    sendResponse(res, 200, {
      posts: transformedPosts,
      metadata: getMetadata(page, limit, total),
    }, 'Posts retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('likes', 'name avatar')
      .lean();

    if (!post || post.isDeleted || post.isBlocked) {
      throw new AppError(404, 'Post not found');
    }

    sendResponse(res, 200, withLikeSummary(post, req.user?.id), 'Post retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { error, value } = validate(schemas.updatePost, req.body);

    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      throw new AppError(400, messages);
    }

    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      throw new AppError(404, 'Post not found');
    }

    if (post.createdBy.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AppError(403, 'Unauthorized to update this post');
    }

    Object.keys(value).forEach(key => {
      if (key !== 'location') {
        post[key] = value[key];
      }
    });

    // Re-run AI analysis if title or description changed
    if (value.title || value.description) {
      analyzeCredibility(post.title, post.description)
        .then(analysis => {
          post.aiAnalysis = analysis;
          return post.save();
        })
        .catch(err => console.error('Background AI analysis failed:', err));
    }

    await post.save();

    const populatedPost = await post.populate('createdBy', 'name email avatar');

    sendResponse(res, 200, populatedPost, 'Post updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      throw new AppError(404, 'Post not found');
    }

    if (post.createdBy.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AppError(403, 'Unauthorized to delete this post');
    }

    // Delete associated images from Cloudinary
    for (const image of post.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId).catch(err =>
          console.error('Cloudinary delete failed:', err)
        );
      }
    }

    post.isDeleted = true;
    await post.save();

    sendResponse(res, 200, null, 'Post deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      throw new AppError(404, 'Post not found');
    }

    const userId = req.user.id;
    const likeIndex = post.likes.findIndex(like => like.toString() === userId.toString());

    if (likeIndex === -1) {
      // Add like
      post.likes.push(userId);
    } else {
      // Remove like
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    const populatedPost = await post.populate('createdBy', 'name email avatar');

    sendResponse(res, 200, {
      post: populatedPost,
      liked: likeIndex === -1,
    }, 'Post like toggled successfully');
  } catch (error) {
    next(error);
  }
};

exports.getPostsByCategory = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { category } = req.params;

    const filter = {
      isDeleted: false,
      isBlocked: false,
      category,
    };

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('createdBy', 'name email avatar')
      .populate('likes', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const transformedPosts = posts.map(post => withLikeSummary(post, req.user?.id));

    sendResponse(res, 200, {
      posts: transformedPosts,
      metadata: getMetadata(page, limit, total),
    }, 'Posts retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getPostsByCity = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { city } = req.params;

    const filter = {
      isDeleted: false,
      isBlocked: false,
      'location.city': { $regex: city, $options: 'i' },
    };

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('createdBy', 'name email avatar')
      .populate('likes', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const transformedPosts = posts.map(post => withLikeSummary(post, req.user?.id));

    sendResponse(res, 200, {
      posts: transformedPosts,
      metadata: getMetadata(page, limit, total),
    }, 'Posts retrieved successfully');
  } catch (error) {
    next(error);
  }
};
