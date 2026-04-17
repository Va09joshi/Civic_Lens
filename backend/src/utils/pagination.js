/**
 * Pagination Helper
 */
const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getMetadata = (page, limit, total) => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
};

module.exports = { getPaginationParams, getMetadata };
