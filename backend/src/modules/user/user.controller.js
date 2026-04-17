const User = require('./user.model');
const { sendResponse } = require('../../utils/apiResponse');
const { validate, schemas } = require('../../utils/validators');
const { AppError } = require('../../middleware/error.middleware');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    sendResponse(res, 200, user, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { error, value } = validate(schemas.updateProfile, req.body);

    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      throw new AppError(400, messages);
    }

    const allowedFields = ['name', 'email', 'avatar', 'bio'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (value[field] !== undefined) {
        updateData[field] = value[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    sendResponse(res, 200, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.clearCookie('token');
    sendResponse(res, 200, null, 'Account deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      throw new AppError(404, 'User not found');
    }

    sendResponse(res, 200, user, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};
