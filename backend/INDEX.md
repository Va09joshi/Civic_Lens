# CivicLens Backend - Quick Index

## 📚 Start Here

- **🆕 New to this?** → Start with [README.md](README.md)
- **⚙️ Setting up?** → Read [SETUP.md](SETUP.md)
- **📖 Learning the API?** → Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **🧪 Testing?** → Follow [TESTING.md](TESTING.md)
- **🏗️ Understanding architecture?** → See [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 📂 File Structure Map

### Documentation Files

| File | Purpose |
|------|---------|
| [README.md](README.md) | Overview, features, installation |
| [SETUP.md](SETUP.md) | Detailed setup & deployment guide |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete API reference with examples |
| [TESTING.md](TESTING.md) | Testing strategies and curl examples |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Project structure and deliverables |
| **INDEX.md** (this file) | Navigation guide |

### Configuration Files

| File | Purpose |
|------|---------|
| `.env.example` | Environment template |
| `.gitignore` | Git ignore rules |
| `.eslintrc.js` | Code linting rules |
| `package.json` | Dependencies & scripts |
| `Dockerfile` | Docker image |
| `docker-compose.yml` | Docker orchestration |

### Source Code (`src/`)

#### Config
- `config/db.js` - MongoDB connection
- `config/cloudinary.js` - Image upload setup
- `config/groq.js` - AI API setup

#### Modules
Each module has: `model.js`, `controller.js`, `routes.js`

- `modules/auth/` - Authentication (signup, login, logout)
- `modules/user/` - User management
- `modules/post/` - Posts CRUD
- `modules/comment/` - Comments CRUD
- `modules/report/` - Report system
- `modules/admin/` - Admin operations
- `modules/ai/` - AI credibility analysis

#### Middleware
- `middleware/auth.middleware.js` - JWT verification
- `middleware/role.middleware.js` - Role-based access
- `middleware/error.middleware.js` - Error handling
- `middleware/rateLimit.middleware.js` - Rate limiting

#### Utilities
- `utils/apiResponse.js` - Response formatting
- `utils/pagination.js` - Pagination helpers
- `utils/validators.js` - Input validation schemas

#### Entry Points
- `app.js` - Express app setup
- `server.js` - Server startup
- `routes/index.js` - Route aggregator

---

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start with auto-reload

# Production
npm start                # Start server

# Maintenance
npm run lint             # Check code quality
npm run lint:fix         # Auto-fix issues
npm run seed             # Populate with test data

# Docker
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
```

---

## 🔐 Authentication Flow

```
User (Frontend)
    ↓
POST /api/auth/signup or /api/auth/login
    ↓
Backend validates credentials
    ↓
Generate JWT token
    ↓
Set in HTTP-only cookie
    ↓
Response with token to frontend
    ↓
Frontend stores token in cookies
    ↓
Subsequent requests send token automatically
    ↓
Auth middleware verifies token
    ↓
Route handler executes
```

---

## 📡 API Endpoint Categories

### 🔓 Public (No auth required)
- `GET /api/health`
- `GET /api/posts` (browse all posts)
- `GET /api/posts/:id`
- `GET /api/comments/:postId`
- `GET /api/posts/category/:category`
- `GET /api/posts/city/:city`

### 🔐 Protected (Auth required)
- `POST /api/posts`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/comments`
- `POST /api/reports`
- `GET /api/users/me`
- `PATCH /api/users/me`

### 👮 Admin Only
- `/api/admin/users/*`
- `/api/admin/posts/*`
- `/api/admin/comments/*`
- `/api/admin/reports/*`

---

## 🗄️ Database Collections

```
civiclens/
├── users (User documents)
├── posts (Post documents)
├── comments (Comment documents)
└── reports (Report documents)
```

**Indexes Created:**
- users: email (unique), createdAt
- posts: createdAt, category, location (geospatial), createdBy
- comments: postId, userId, createdAt
- reports: postId, status, createdAt

---

## 🔄 Main Workflows

### Post Creation Flow
```
Frontend → POST /api/posts [with image]
    ↓
Backend validates input
    ↓
Upload image to Cloudinary
    ↓
Create post in MongoDB
    ↓
Trigger AI analysis (async)
    ↓
Return post data
```

### AI Credibility Analysis
```
Post created/updated
    ↓
Send title + description to Groq API
    ↓
Groq analyzes with LLaMA3
    ↓
Returns score, label, reason
    ↓
Update post with analysis
```

### Admin Moderation
```
User reports post
    ↓
Report stored in MongoDB
    ↓
Admin reviews report
    ↓
Admin resolves with action
    ↓
If blocked: Set post.isBlocked = true
    ↓
If deleted: Set post.isDeleted = true
```

---

## 📊 Response Format

```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message",
  "success": true
}
```

All endpoints return this format consistently.

---

## ⚠️ Common Errors

| Status | Meaning | Solution |
|--------|---------|----------|
| 400 | Bad Request | Check input validation |
| 401 | Unauthorized | Login required / invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Email/resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Check logs |

---

## 🛠️ Environment Setup

### Required Variables

```bash
# Application
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/civiclens

# Auth
JWT_SECRET=generate_strong_key_32_chars_min

# Cloudinary (Images)
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Groq (AI)
GROQ_API_KEY=your_key

# Frontend
FRONTEND_URL=http://localhost:3000
```

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🐳 Docker Workflow

```bash
# Setup
cp .env.example .env
# Fill in Cloudinary & Groq keys

# Start
docker-compose up -d

# Monitor
docker-compose logs -f backend

# Stop
docker-compose down

# Rebuild after code changes
docker-compose up --build -d
```

---

## 🧪 Test Credentials (After Seeding)

```
SUPER_ADMIN
├─ Email: admin@civiclens.com
└─ Password: AdminPass123

MODERATOR
├─ Email: moderator@civiclens.com
└─ Password: ModeratorPass123

USER 1
├─ Email: john@civiclens.com
└─ Password: UserPass123

USER 2
├─ Email: jane@civiclens.com
└─ Password: UserPass123
```

---

## 📈 Performance Tips

1. **Use Pagination:** Always paginate large datasets
2. **Filter Data:** Use category/city filters to reduce load
3. **MongoDB Indexes:** Already configured for common queries
4. **Rate Limiting:** Protects against abuse (100 req/15min)
5. **Caching:** Implement Redis for hot data
6. **Connection Pooling:** Mongoose handles this

---

## 🔒 Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens secure in HTTP-only cookies
- ✅ Input validation with Joi
- ✅ XSS protection with sanitization
- ✅ CORS configured
- ✅ Rate limiting enabled
- ✅ Helmet headers applied
- ✅ SQL Injection protected (using MongoDB)

**For Production:**
- [ ] HTTPS/SSL enabled
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] Error logging configured
- [ ] DDoS protection added
- [ ] Security audits completed

---

## 📞 Need Help?

### Quick Issues

- **Port in use?** Change `PORT` in .env
- **MongoDB won't connect?** Check URI or start MongoDB
- **Cloudinary errors?** Verify credentials
- **AI not working?** Check Groq API key
- **Authentication fails?** Verify JWT_SECRET

### Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Groq Console](https://console.groq.com/)

### Files to Check

- Errors? → Check `src/middleware/error.middleware.js`
- Auth issues? → Check `src/modules/auth/`
- Database? → Check `src/config/db.js`
- API issues? → Check relevant controller files

---

## 📋 Development Checklist

- [ ] Node.js installed (v18+)
- [ ] MongoDB running or Atlas account
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and filled
- [ ] Server starts (`npm run dev`)
- [ ] Health check passes
- [ ] Database seeded (`npm run seed`)
- [ ] API endpoints tested
- [ ] Frontend connected

---

## 🚢 Production Deployment

1. **Prepare:**
   - Generate strong JWT_SECRET
   - Use MongoDB Atlas
   - Configure all env vars
   - Run security audit

2. **Build:**
   - Lint code: `npm run lint`
   - Test endpoints
   - Check logs

3. **Deploy:**
   - Docker: `docker build -t app .`
   - Traditional: `npm install` then `npm start`
   - Platform: Heroku / AWS / etc.

4. **Monitor:**
   - Check logs regularly
   - Monitor error rates
   - Track performance
   - Backup database daily

---

## 🎯 Project Stats

| Metric | Count |
|--------|-------|
| API Endpoints | 30+ |
| Database Models | 4 |
| Middleware Functions | 4 |
| Module Folders | 7 |
| Documentation Files | 6 |
| Dependencies | 15+ |
| Lines of Code | 3000+ |

---

## 🗺️ Navigation Guide

**Exploring the code?**
1. Start in `src/app.js` - See app setup
2. Check `src/server.js` - Entry point
3. Look at `src/routes/index.js` - Route aggregator
4. Pick a module like `src/modules/post/` to understand pattern

**Understanding a feature?**
1. Read the model: `*.model.js`
2. See the controller: `*.controller.js`
3. Check the routes: `*.routes.js`

**Debugging?**
1. Check `src/middleware/error.middleware.js`
2. Look at console logs
3. Verify `API_DOCUMENTATION.md` for expected responses

---

## ✨ Key Highlights

🚀 **Production-Ready**
- Clean, scalable architecture
- Security best practices
- Performance optimized
- Error handling
- Documentation complete

🔧 **Easy to Extend**
- Modular structure
- Service layer pattern
- Reusable utilities
- Clear separation of concerns

📚 **Well Documented**
- 6 comprehensive guides
- API reference complete
- Examples provided
- Setup instructions clear

---

Built with ❤️ by the CivicLens Team

Last Updated: April 2024  
Version: 1.0.0
