const Joi = require('joi');

const schemas = {
  signup: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    avatar: Joi.string().uri(),
    bio: Joi.string().max(500).allow(''),
    about: Joi.string().max(500).allow(''),
  }).min(1),

  createPost: Joi.object({
    title: Joi.string().required().min(5).max(200),
    description: Joi.string().required().min(10).max(5000),
    category: Joi.string().valid(
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
      'OTHER'
    ).required(),
    type: Joi.string().valid('ISSUE', 'NEWS').required(),
    location: Joi.object({
      city: Joi.string().required(),
      lat: Joi.number().required(),
      lng: Joi.number().required(),
    }).required(),
  }),

  updatePost: Joi.object({
    title: Joi.string().min(5).max(200),
    description: Joi.string().min(10).max(5000),
    category: Joi.string().valid(
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
      'OTHER'
    ),
    type: Joi.string().valid('ISSUE', 'NEWS'),
  }).min(1),

  createComment: Joi.object({
    text: Joi.string().required().min(1).max(1000),
    postId: Joi.string().required(),
  }),

  createReport: Joi.object({
    postId: Joi.string().required(),
    reason: Joi.string().required().min(5).max(1000),
  }),
};

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
  return { error, value };
};

module.exports = { schemas, validate };
