const { sendResponse } = require('../utils/apiResponse');

const ROLE_HIERARCHY = {
  USER: 0,
  MODERATOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, null, 'Authentication required');
    }

    const userRoleLevel = ROLE_HIERARCHY[req.user.role] ?? -1;
    const isAuthorized = allowedRoles.some(role => {
      const roleLevel = ROLE_HIERARCHY[role] ?? -1;
      return userRoleLevel >= roleLevel;
    });

    if (!isAuthorized) {
      return sendResponse(res, 403, null, 'Insufficient permissions');
    }

    next();
  };
};

module.exports = { roleMiddleware, ROLE_HIERARCHY };
