const Report = require('./report.model');
const Post = require('../post/post.model');
const { sendResponse } = require('../../utils/apiResponse');
const { validate, schemas } = require('../../utils/validators');
const { AppError } = require('../../middleware/error.middleware');

exports.createReport = async (req, res, next) => {
  try {
    const { error, value } = validate(schemas.createReport, req.body);

    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      throw new AppError(400, messages);
    }

    // Check if post exists
    const post = await Post.findById(value.postId);
    if (!post || post.isDeleted) {
      throw new AppError(404, 'Post not found');
    }

    // Check if user already reported this post
    const existingReport = await Report.findOne({
      postId: value.postId,
      reportedBy: req.user.id,
      status: 'PENDING',
    });

    if (existingReport) {
      throw new AppError(409, 'You have already reported this post');
    }

    const report = new Report({
      postId: value.postId,
      reportedBy: req.user.id,
      reason: value.reason,
    });

    await report.save();

    sendResponse(res, 201, report, 'Report submitted successfully');
  } catch (error) {
    next(error);
  }
};

exports.getReportsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const reports = await Report.find({ postId })
      .populate('reportedBy', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    sendResponse(res, 200, reports, 'Reports retrieved successfully');
  } catch (error) {
    next(error);
  }
};
