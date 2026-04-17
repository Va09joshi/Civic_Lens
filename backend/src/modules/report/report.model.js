const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Report reason is required'],
      minlength: 5,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['PENDING', 'RESOLVED'],
      default: 'PENDING',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolution: String,
    action: {
      type: String,
      enum: ['DISMISSED', 'WARNING', 'BLOCKED', 'DELETED'],
    },
  },
  { timestamps: true }
);

reportSchema.index({ postId: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
