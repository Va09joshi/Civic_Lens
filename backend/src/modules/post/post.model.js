const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: 5,
      maxlength: 200,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: 10,
      maxlength: 5000,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    category: {
      type: String,
      enum: [
        'POTHOLE',
        'STREETLIGHT',
        'SANITATION',
        'WATER',
        'ELECTRICITY',
        'TRAFFIC',
        'POLLUTION',
        'CORRUPTION',
        'MUNICIPAL_SERVICES',
        'POLITICAL_GOVERNANCE',
        'PUBLIC_TRANSPORT',
        'ROAD_SAFETY',
        'DRAINAGE',
        'PARKS_PUBLIC_SPACES',
        'OTHER',
      ],
      required: [true, 'Category is required'],
    },
    type: {
      type: String,
      enum: ['ISSUE', 'NEWS'],
      required: [true, 'Type is required'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    commentsCount: {
      type: Number,
      default: 0,
    },
    aiAnalysis: {
      score: {
        type: Number,
        min: 0,
        max: 1,
      },
      label: {
        type: String,
        enum: ['Likely True', 'Possibly Misleading', 'Likely False'],
      },
      reason: String,
      analyzedAt: Date,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Create geospatial index
postSchema.index({ 'location': '2dsphere' });
postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1 });
postSchema.index({ createdBy: 1 });

// Query middleware to exclude deleted posts
postSchema.query.active = function () {
  return this.where({ isDeleted: false });
};

postSchema.query.notBlocked = function () {
  return this.where({ isBlocked: false });
};

module.exports = mongoose.model('Post', postSchema);
