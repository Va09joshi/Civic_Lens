const User = require('../user/user.model');
const Post = require('../post/post.model');
const Comment = require('../comment/comment.model');
const Report = require('../report/report.model');
const { sendResponse } = require('../../utils/apiResponse');
const { getPaginationParams, getMetadata } = require('../../utils/pagination');
const { AppError } = require('../../middleware/error.middleware');

// ========== USER MANAGEMENT ==========

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { role, isBanned } = req.query;

    const filter = { isDeleted: false };
    if (role) filter.role = role;
    if (isBanned !== undefined) filter.isBanned = isBanned === 'true';

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    sendResponse(res, 200, {
      users,
      metadata: getMetadata(page, limit, total),
    }, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // SUPER_ADMIN can only delete other SUPER_ADMINs cannot be deleted by ADMIN
    if (req.user.role !== 'SUPER_ADMIN') {
      throw new AppError(403, 'Only SUPER_ADMIN can delete users');
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user._id.toString() === req.user.id) {
      throw new AppError(400, 'Cannot delete yourself');
    }

    user.isDeleted = true;
    await user.save();

    sendResponse(res, 200, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.banUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user._id.toString() === req.user.id) {
      throw new AppError(400, 'Cannot ban yourself');
    }

    user.isBanned = true;
    await user.save();

    sendResponse(res, 200, user, 'User banned successfully');
  } catch (error) {
    next(error);
  }
};

exports.unbanUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    user.isBanned = false;
    await user.save();

    sendResponse(res, 200, user, 'User unbanned successfully');
  } catch (error) {
    next(error);
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    user.isVerified = true;
    await user.save();

    sendResponse(res, 200, user, 'User verified successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      throw new AppError(400, 'Invalid role');
    }

    if (req.user.role !== 'SUPER_ADMIN') {
      throw new AppError(403, 'Only SUPER_ADMIN can change roles');
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    user.role = role;
    await user.save();

    sendResponse(res, 200, user, 'User role updated successfully');
  } catch (error) {
    next(error);
  }
};

// ========== POST MANAGEMENT ==========

exports.getAllPosts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { isBlocked, isDeleted } = req.query;

    const filter = {};
    if (isBlocked !== undefined) filter.isBlocked = isBlocked === 'true';
    if (isDeleted !== undefined) filter.isDeleted = isDeleted === 'true';

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    sendResponse(res, 200, {
      posts,
      metadata: getMetadata(page, limit, total),
    }, 'Posts retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.blockPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    post.isBlocked = true;
    await post.save();

    sendResponse(res, 200, post, 'Post blocked successfully');
  } catch (error) {
    next(error);
  }
};

exports.unblockPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    post.isBlocked = false;
    await post.save();

    sendResponse(res, 200, post, 'Post unblocked successfully');
  } catch (error) {
    next(error);
  }
};

exports.deletePostAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    post.isDeleted = true;
    await post.save();

    sendResponse(res, 200, null, 'Post deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ========== COMMENT MANAGEMENT ==========

exports.deleteCommentAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      throw new AppError(404, 'Comment not found');
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

exports.getAllComments = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);

    const total = await Comment.countDocuments({ isDeleted: false });
    const comments = await Comment.find({ isDeleted: false })
      .populate('userId', 'name email')
      .populate('postId', 'title')
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

// ========== REPORT MANAGEMENT ==========

exports.getAllReports = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const total = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
      .populate('postId', 'title')
      .populate('reportedBy', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    sendResponse(res, 200, {
      reports,
      metadata: getMetadata(page, limit, total),
    }, 'Reports retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.resolveReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, resolution } = req.body;

    if (!['DISMISSED', 'WARNING', 'BLOCKED', 'DELETED'].includes(action)) {
      throw new AppError(400, 'Invalid action');
    }

    const report = await Report.findById(id);
    if (!report) {
      throw new AppError(404, 'Report not found');
    }

    report.status = 'RESOLVED';
    report.resolvedBy = req.user.id;
    report.action = action;
    report.resolution = resolution || '';

    // Apply action to post
    const post = await Post.findById(report.postId);
    if (post) {
      if (action === 'BLOCKED') {
        post.isBlocked = true;
      } else if (action === 'DELETED') {
        post.isDeleted = true;
      }
      await post.save();
    }

    await report.save();

    const populatedReport = await report
      .populate('postId', 'title')
      .populate('reportedBy', 'name email')
      .populate('resolvedBy', 'name email');

    sendResponse(res, 200, populatedReport, 'Report resolved successfully');
  } catch (error) {
    next(error);
  }
};
