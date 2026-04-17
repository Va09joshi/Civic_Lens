const Comment = require('./comment.model');
const Post = require('../post/post.model');
const { sendResponse } = require('../../utils/apiResponse');
const { validate, schemas } = require('../../utils/validators');
const { getPaginationParams, getMetadata } = require('../../utils/pagination');
const { AppError } = require('../../middleware/error.middleware');

exports.createComment = async (req, res, next) => {
  try {
    const { error, value } = validate(schemas.createComment, req.body);

    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      throw new AppError(400, messages);
    }

    // Check if post exists
    const post = await Post.findById(value.postId);
    if (!post || post.isDeleted) {
      throw new AppError(404, 'Post not found');
    }

    const comment = new Comment({
      text: value.text,
      postId: value.postId,
      userId: req.user.id,
    });

    await comment.save();
    post.commentsCount += 1;
    await post.save();

    const populatedComment = await comment.populate('userId', 'name email avatar');

    sendResponse(res, 201, populatedComment, 'Comment created successfully');
  } catch (error) {
    next(error);
  }
};

exports.getCommentsByPost = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post || post.isDeleted) {
      throw new AppError(404, 'Post not found');
    }

    const filter = {
      postId,
      isDeleted: false,
    };

    const total = await Comment.countDocuments(filter);
    const comments = await Comment.find(filter)
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    sendResponse(res, 200, {
      comments,
      metadata: getMetadata(page, limit, total),
    }, 'Comments retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment || comment.isDeleted) {
      throw new AppError(404, 'Comment not found');
    }

    // Check authorization
    if (comment.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AppError(403, 'Unauthorized to delete this comment');
    }

    comment.isDeleted = true;
    await comment.save();

    // Decrement post comment count
    const post = await Post.findById(comment.postId);
    if (post) {
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      await post.save();
    }

    sendResponse(res, 200, null, 'Comment deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.getCommentById = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('userId', 'name email avatar');

    if (!comment || comment.isDeleted) {
      throw new AppError(404, 'Comment not found');
    }

    sendResponse(res, 200, comment, 'Comment retrieved successfully');
  } catch (error) {
    next(error);
  }
};
