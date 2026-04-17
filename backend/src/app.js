const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

const routes = require('./routes');
const { errorMiddleware } = require('./middleware/error.middleware');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Body Parser
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cookieParser());

// Data Sanitization
app.use(mongoSanitize());

// API Routes
app.use('/api', routes);

// Not Found Handler
app.use('*', (req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: 'Route not found',
    success: false,
  });
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
