const { sendResponse } = require('../utils/apiResponse');

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('[ERROR]', {
    statusCode,
    message,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return sendResponse(res, 400, null, messages.join(', '));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendResponse(res, 409, null, `${field} already exists`);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return sendResponse(res, 400, null, 'Invalid ID format');
  }

  sendResponse(res, statusCode, null, message);
};

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorMiddleware, AppError };
