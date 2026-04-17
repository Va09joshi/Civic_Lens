const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const { sendResponse } = require('../../utils/apiResponse');
const { validate, schemas } = require('../../utils/validators');
const { AppError } = require('../../middleware/error.middleware');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { error, value } = validate(schemas.signup, req.body);

    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      throw new AppError(400, messages);
    }

    const { name, email, password } = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user._id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendResponse(res, 201, {
      user: user.toJSON(),
      token,
    }, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error, value } = validate(schemas.login, req.body);

    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      throw new AppError(400, messages);
    }

    const { email, password } = value;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (user.isBanned) {
      throw new AppError(403, 'Your account has been banned');
    }

    const token = generateToken(user._id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, 200, {
      user: user.toJSON(),
      token,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  try {
    res.clearCookie('token');
    sendResponse(res, 200, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Authentication required');
    }

    const token = generateToken(req.user.id, req.user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, 200, { token }, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};
