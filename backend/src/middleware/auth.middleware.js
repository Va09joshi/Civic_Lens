const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/apiResponse');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return sendResponse(res, 401, null, 'No authentication token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendResponse(res, 401, null, 'Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      return sendResponse(res, 401, null, 'Invalid token');
    }
    return sendResponse(res, 401, null, error.message);
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
    // Silently fail - user is not authenticated but route allows it
  }
  next();
};

module.exports = { authMiddleware, optionalAuth };
