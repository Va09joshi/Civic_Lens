# CivicLens Backend

Production-ready Node.js backend for a civic issue & news platform with AI credibility scoring.

## Features

- ✅ **User Authentication** - JWT with HTTP-only cookies
- ✅ **Role-Based Access Control** - USER, MODERATOR, ADMIN, SUPER_ADMIN
- ✅ **CRUD APIs** - Posts, Comments, Reports
- ✅ **AI Credibility Scoring** - LLaMA3 via Groq API
- ✅ **Image Uploads** - Cloudinary integration
- ✅ **Pagination & Filtering** - Optimized queries
- ✅ **Soft Deletes** - Data preservation
- ✅ **Security** - Helmet, CORS, rate limiting, input sanitization
- ✅ **Error Handling** - Centralized middleware
- ✅ **MongoDB Indexes** - Performance optimized

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Groq API** - AI credibility analysis
- **Helmet** - Security headers
- **Joi** - Input validation

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── db.js           # MongoDB connection
│   ├── cloudinary.js   # Cloudinary setup
│   └── groq.js         # Groq API setup
├── modules/            # Feature modules
│   ├── auth/           # Authentication
│   ├── user/           # User management
│   ├── post/           # Posts CRUD
│   ├── comment/        # Comments CRUD
│   ├── report/         # Report system
│   ├── admin/          # Admin operations
│   └── ai/             # AI services
├── middleware/         # Express middleware
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── error.middleware.js
│   └── rateLimit.middleware.js
├── utils/              # Utility functions
│   ├── apiResponse.js
│   ├── pagination.js
│   └── validators.js
├── routes/             # Route aggregator
├── app.js              # Express app setup
└── server.js           # Server entry point
```

## Installation

### 1. Clone & Setup

```bash
cd backend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing key (min 32 chars)
- `CLOUDINARY_*` - Cloudinary credentials
- `GROQ_API_KEY` - Groq API key
- `FRONTEND_URL` - Your frontend URL

### 3. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000` by default.

## API Endpoints

### Authentication

```
POST   /api/auth/signup          - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/logout          - Logout user
POST   /api/auth/refresh-token   - Refresh JWT token
```

### Users

```
GET    /api/users/me             - Get current user profile
PATCH  /api/users/me             - Update profile
DELETE /api/users/me             - Delete account (soft)
GET    /api/users/:id            - Get user by ID
```

### Posts

```
POST   /api/posts                - Create post
GET    /api/posts                - Get all posts (paginated, filterable)
GET    /api/posts/:id            - Get single post
PATCH  /api/posts/:id            - Update post
DELETE /api/posts/:id            - Delete post (soft)
POST   /api/posts/:id/like       - Toggle like
GET    /api/posts/category/:category  - Posts by category
GET    /api/posts/city/:city     - Posts by city
```

### Comments

```
POST   /api/comments             - Create comment
GET    /api/comments/:postId     - Get comments on post
DELETE /api/comments/:id         - Delete comment
```

### Reports

```
POST   /api/reports              - Report post
GET    /api/reports/post/:postId - Get reports for post
```

### Admin

**User Management:**
```
GET    /api/admin/users          - List all users
DELETE /api/admin/users/:id      - Delete user (SUPER_ADMIN only)
PATCH  /api/admin/users/:id/ban  - Ban user
PATCH  /api/admin/users/:id/unban - Unban user
PATCH  /api/admin/users/:id/verify - Verify user
PATCH  /api/admin/users/:id/role - Change user role (SUPER_ADMIN only)
```

**Post Management:**
```
GET    /api/admin/posts          - List all posts
PATCH  /api/admin/posts/:id/block - Block post
PATCH  /api/admin/posts/:id/unblock - Unblock post
DELETE /api/admin/posts/:id      - Delete post
```

**Comment Management:**
```
GET    /api/admin/comments       - List all comments
DELETE /api/admin/comments/:id   - Delete comment
```

**Report Management:**
```
GET    /api/admin/reports        - List all reports
PATCH  /api/admin/reports/:id/resolve - Resolve report
```

## Authentication

Uses JWT stored in HTTP-only cookies:

**Login Response:**
```json
{
  "statusCode": 200,
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  },
  "message": "Login successful",
  "success": true
}
```

Token is automatically set in cookies for subsequent requests.

## Query Parameters

### Pagination

```
GET /api/posts?page=1&limit=10
```

Response includes metadata:
```json
{
  "posts": [...],
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Filtering & Sorting

```
GET /api/posts?category=POTHOLE&city=Mumbai&sortBy=latest
GET /api/posts?sortBy=trending
```

### Admins

```
GET /api/admin/users?role=ADMIN&isBanned=false
GET /api/admin/reports?status=PENDING
```

## Data Models

### User

```javascript
{
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN',
  isVerified: Boolean,
  isBanned: Boolean,
  isDeleted: Boolean,
  avatar: String,
  bio: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Post

```javascript
{
  title: String,
  description: String,
  images: [{ url, publicId }],
  category: enum,
  type: 'ISSUE' | 'NEWS',
  location: {
    type: 'Point',
    coordinates: [lng, lat],
    city: String
  },
  likes: ObjectId[],
  commentsCount: Number,
  aiAnalysis: {
    score: Number (0-1),
    label: 'Likely True' | 'Possibly Misleading' | 'Likely False',
    reason: String,
    analyzedAt: Date
  },
  isBlocked: Boolean,
  isDeleted: Boolean,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment

```javascript
{
  text: String,
  postId: ObjectId,
  userId: ObjectId,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Report

```javascript
{
  postId: ObjectId,
  reportedBy: ObjectId,
  reason: String,
  status: 'PENDING' | 'RESOLVED',
  resolvedBy: ObjectId,
  resolution: String,
  action: 'DISMISSED' | 'WARNING' | 'BLOCKED' | 'DELETED',
  createdAt: Date,
  updatedAt: Date
}
```

## AI Credibility Analysis

When a post is created, the backend automatically analyzes its credibility using LLaMA3:

```javascript
{
  score: 0.75,        // 0.0 to 1.0
  label: "Likely True",
  reason: "Post provides specific details with context...",
  analyzedAt: "2024-04-17T10:30:00Z"
}
```

## Error Handling

Centralized error middleware with consistent response format:

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Invalid email or password",
  "success": false
}
```

Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

## Security Features

- **Helmet** - HTTP security headers
- **CORS** - Cross-origin requests
- **Rate Limiting** - 100 req/15min general, 5 req/15min auth
- **Input Validation** - Joi schema validation
- **Data Sanitization** - XSS prevention
- **Passwords** - bcryptjs hashing
- **JWT** - HTTP-only secure cookies
- **Soft Deletes** - Data preservation

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `JWT_SECRET`
- [ ] Use MongoDB Atlas
- [ ] Configure Cloudinary
- [ ] Set `FRONTEND_URL` to your domain
- [ ] Enable HTTPS
- [ ] Set secure cookies
- [ ] Monitor logs
- [ ] Set up backups

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm install --production
COPY src ./src
CMD ["node", "src/server.js"]
```

Build and run:
```bash
docker build -t civiclens-backend .
docker run -p 5000:5000 --env-file .env civiclens-backend
```

## Performance Optimization

- **MongoDB Indexes** - Geospatial, createdAt, category
- **Pagination** - Limit 100 per page
- **Query Optimization** - Lean queries, field selection
- **Connection Pooling** - Mongoose defaults to 10
- **Rate Limiting** - Prevents abuse
- **Caching** - Implement Redis for frequently accessed data

## Development

### Scripts

```bash
npm run dev      # Start with nodemon
npm start        # Start production
npm run lint     # Run ESLint
npm run lint:fix # Fix linting issues
```

### Code Standards

- Use meaningful variable names
- Add JSDoc comments for functions
- Keep modules focused and single-responsibility
- Error handling in all async functions
- Validate all inputs

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/xyz`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/xyz`
5. Create Pull Request

## License

MIT © CivicLens Team

## Support

For issues or questions, please create an issue or contact the development team.

---

Built with ❤️ by CivicLens Team
