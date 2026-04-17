# CivicLens Backend - Setup Guide

## Quick Start (5 minutes)

### 1. Prerequisites

Ensure you have installed:
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **MongoDB** (v5+) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git**

### 2. Clone Repository

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Setup

Copy the example env file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:

#### Get Cloudinary Credentials
1. Sign up at https://cloudinary.com/
2. Go to Dashboard
3. Copy `Cloud Name`, `API Key`, `API Secret`

#### Get Groq API Key
1. Visit https://console.groq.com/
2. Create account/login
3. Generate API key

#### MongoDB URI
**Option A: Local MongoDB**
```
MONGODB_URI=mongodb://localhost:27017/civiclens
```

**Option B: MongoDB Atlas (Cloud)**
1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Create database user
3. Get connection string
4. Add IP address to whitelist
5. Copy URI: `mongodb+srv://username:password@cluster.mongodb.net/civiclens`

#### JWT Secret
Generate a strong random key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Start Development Server

```bash
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
🚀 Server is running on port 5000
📍 Environment: development
🌐 API Base URL: http://localhost:5000/api
```

### 6. Seed Database (Optional)

Load sample data:
```bash
npm run seed
```

Test credentials:
- **SUPER_ADMIN:** admin@civiclens.com / AdminPass123
- **MODERATOR:** moderator@civiclens.com / ModeratorPass123
- **USER:** john@civiclens.com / UserPass123
- **USER:** jane@civiclens.com / UserPass123

### 7. Test API

Open browser or use Postman:
```
http://localhost:5000/api/health
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

---

## Docker Setup

### Using Docker Compose (Recommended)

#### 1. Install Docker
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

#### 2. Create `.env` file
```bash
cp .env.example .env
```

#### 3. Update `.env` with credentials
- CLOUDINARY_*
- GROQ_API_KEY

#### 4. Start Services

```bash
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- Backend on port 5000

#### 5. View Logs

```bash
docker-compose logs -f backend
```

#### 6. Stop Services

```bash
docker-compose down
```

#### 7. Rebuild After Changes

```bash
docker-compose up --build -d
```

---

## Development Workflow

### File Structure

```
backend/
├── src/
│   ├── config/              # Configuration
│   ├── modules/             # Feature modules
│   ├── middleware/          # Express middleware
│   ├── utils/               # Utilities
│   ├── routes/              # Routes
│   ├── app.js               # App config
│   └── server.js            # Entry point
├── scripts/                 # Scripts (seed)
├── package.json
├── .env.example
├── README.md
└── API_DOCUMENTATION.md
```

### Common Commands

```bash
# Development
npm run dev              # Start with auto-reload

# Production
npm start                # Start server

# Linting
npm run lint             # Check code style
npm run lint:fix         # Fix linting issues

# Database
npm run seed             # Populate with sample data

# Testing (Setup when needed)
npm test                 # Run tests
npm run test:watch       # Watch mode
```

### Code Standards

- **Naming:** camelCase for functions/variables, PascalCase for classes
- **Comments:** JSDoc for public functions
- **Error Handling:** Use AppError class
- **Validation:** Use Joi schemas
- **Database:** Use Mongoose query helpers

---

## Trouble Shooting

### MongoDB Connection Refused

**Problem:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Start MongoDB: `mongod` (if local)
2. Use MongoDB Atlas URI in `.env`
3. Check MongoDB is running: `mongo --version`

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Change PORT in `.env`
2. Kill process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)
3. Task Manager → End task (Windows)

### Missing Environment Variables

**Problem:** `TypeError: Cannot read property 'cloud_name' of undefined`

**Solutions:**
1. Copy `.env.example` to `.env`
2. Fill in all values
3. Restart server

### Invalid Groq API Key

**Problem:** `401 Unauthorized` from AI analysis

**Solutions:**
1. Verify API key at https://console.groq.com/
2. Check key is not expired
3. Ensure it's set in `.env`

### Cloudinary Upload Fails

**Problem:** Image upload returns 403/500

**Solutions:**
1. Verify credentials at https://cloudinary.com/console
2. Check API secret accuracy
3. Ensure Cloud Name matches

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `JWT_SECRET`
- [ ] Use MongoDB Atlas
- [ ] Set correct `FRONTEND_URL`
- [ ] Enable HTTPS/SSL
- [ ] Configure environment variables
- [ ] Set up monitoring/logging
- [ ] Enable database backups
- [ ] Configure rate limiting
- [ ] Review security settings

### Deploy on Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create civiclens-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MONGODB_URI=your_atlas_uri
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_secret
heroku config:set GROQ_API_KEY=your_groq_key

# Deploy
git push heroku main
```

### Deploy on AWS EC2

```bash
# SSH to instance
ssh -i key.pem ubuntu@instance-ip

# Install Node
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone <repo>
cd backend

# Install dependencies
npm ci --only=production

# Set environment
cp .env.example .env
# Edit .env

# Start with PM2
npm install -g pm2
pm2 start src/server.js --name "civiclens"
pm2 startup
pm2 save
```

### Deploy with Docker

```bash
# Build image
docker build -t civiclens-backend .

# Run container
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name civiclens \
  civiclens-backend
```

---

## Performance Tips

1. **MongoDB Indexes:** Already configured in models
2. **Connection Pooling:** Mongoose default is 10 connections
3. **Pagination:** Defaults to 10 items per page
4. **Caching:** Implement Redis for frequently accessed data
5. **Rate Limiting:** Enabled by default (100 req/15min)
6. **Query Optimization:** Use `.lean()` for read-only queries
7. **Image Optimization:** Cloudinary handles resizing

---

## Monitoring & Logging

### Console Logs (Development)
Already configured to show:
- Connection status
- Errors and stack traces
- Request paths and methods

### Production Logging
Consider adding:
- **Winston** - Structured logging
- **Morgan** - HTTP request logging
- **Sentry** - Error tracking

### Health Check

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-04-17T10:00:00.000Z"
}
```

---

## Security Reminders

✅ Already Implemented:
- Helmet headers
- CORS configuration
- Rate limiting
- Input sanitization
- Password hashing (bcrypt)
- JWT authentication
- Secure cookies

⚠️ TODO for Production:
- [ ] HTTPS/SSL certificates
- [ ] Database backups
- [ ] Regular security audits
- [ ] DDoS protection (CloudFlare)
- [ ] API key rotation
- [ ] Audit logging

---

## Support & Resources

- **MongoDB Docs:** https://docs.mongodb.com/
- **Express Guide:** https://expressjs.com/
- **Mongoose ORM:** https://mongoosejs.com/
- **JWT Intro:** https://jwt.io/introduction
- **Groq API:** https://console.groq.com/docs/models

---

Need help? Check the main [README.md](./README.md) or [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

Built with ❤️ by CivicLens Team
