/**
 * Standardized API Response Wrapper
 */
class ApiResponse {
  constructor(statusCode, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

const sendResponse = (res, statusCode, data = null, message = 'Success') => {
  res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

module.exports = { ApiResponse, sendResponse };
