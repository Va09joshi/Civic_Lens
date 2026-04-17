# CivicLens Backend - Testing Guide

Complete guide for testing the backend API.

## Prerequisites

- Backend running: `npm run dev` (port 5000)
- Database seeded: `npm run seed` (optional, for test data)
- Postman or similar REST client (optional)

---

## Quick Test Commands

### 1. Health Check

```bash
curl http://localhost:5000/api/health
```

**Expected Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-04-17T10:00:00.000Z"
}
```

---

## Authentication Tests

### Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "TestPass123"
  }'
```

**Expected Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  },
  "message": "User registered successfully",
  "success": true
}
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPass123"
  }'
```

**Save token from response for other tests**

### Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Cookie: token=YOUR_TOKEN_HERE"
```

---

## User Tests

### Get Profile (Authenticated)

```bash
curl http://localhost:5000/api/users/me \
  -H "Cookie: token=YOUR_TOKEN_HERE"
```

### Update Profile

```bash
curl -X PATCH http://localhost:5000/api/users/me \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN_HERE" \
  -d '{
    "name": "Updated Name",
    "bio": "New bio"
  }'
```

### Get User by ID (Public)

```bash
curl http://localhost:5000/api/users/USER_ID_HERE
```

---

## Post Tests

### Create Post (Requires Authentication)

**Using cURL (without image):**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN_HERE" \
  -d '{
    "title": "Pothole on Main Street",
    "description": "There is a large pothole that needs immediate repair",
    "category": "POTHOLE",
    "type": "ISSUE",
    "location": {
      "city": "Mumbai",
      "lat": 19.0760,
      "lng": 72.8777
    }
  }'
```

**Using PostMan (with image upload):**
1. Method: `POST`
2. URL: `http://localhost:5000/api/posts`
3. Headers: `Cookie: token=YOUR_TOKEN_HERE`
4. Body: form-data
   - `title` (text): "Pothole on Main Street"
   - `description` (text): "There is a large pothole that needs..."
   - `category` (text): "POTHOLE"
   - `type` (text): "ISSUE"
   - `location` (text): `{"city":"Mumbai","lat":19.0760,"lng":72.8777}`
   - `images` (file): Select image file(s)

### Get All Posts

```bash
curl "http://localhost:5000/api/posts?page=1&limit=10"
```

### Get All Posts with Filters

```bash
curl "http://localhost:5000/api/posts?category=POTHOLE&city=Mumbai&sortBy=latest&page=1&limit=10"
```

### Get Single Post

```bash
curl http://localhost:5000/api/posts/POST_ID_HERE
```

### Update Post

```bash
curl -X PATCH http://localhost:5000/api/posts/POST_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description"
  }'
```

### Delete Post

```bash
curl -X DELETE http://localhost:5000/api/posts/POST_ID_HERE \
  -H "Cookie: token=YOUR_TOKEN_HERE"
```

### Like/Unlike Post

```bash
curl -X POST http://localhost:5000/api/posts/POST_ID_HERE/like \
  -H "Cookie: token=YOUR_TOKEN_HERE"
```

### Get Posts by Category

```bash
curl "http://localhost:5000/api/posts/category/POTHOLE?page=1&limit=10"
```

### Get Posts by City

```bash
curl "http://localhost:5000/api/posts/city/Mumbai?page=1&limit=10"
```

---

## Comment Tests

### Create Comment

```bash
curl -X POST http://localhost:5000/api/comments \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN_HERE" \
  -d '{
    "text": "This is a serious issue!",
    "postId": "POST_ID_HERE"
  }'
```

### Get Comments on Post

```bash
curl "http://localhost:5000/api/comments/POST_ID_HERE?page=1&limit=20"
```

### Delete Comment

```bash
curl -X DELETE http://localhost:5000/api/comments/COMMENT_ID_HERE \
  -H "Cookie: token=YOUR_TOKEN_HERE"
```

---

## Report Tests

### Create Report

```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN_HERE" \
  -d '{
    "postId": "POST_ID_HERE",
    "reason": "This post contains false information"
  }'
```

### Get Reports for Post

```bash
curl http://localhost:5000/api/reports/post/POST_ID_HERE
```

---

## Admin Tests

**Use admin token obtained from login with admin account**

### Get All Users

```bash
curl "http://localhost:5000/api/admin/users?page=1&limit=10" \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

### Ban User

```bash
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID_HERE/ban \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

### Unban User

```bash
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID_HERE/unban \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

### Verify User

```bash
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID_HERE/verify \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

### Change User Role (SUPER_ADMIN Only)

```bash
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID_HERE/role \
  -H "Content-Type: application/json" \
  -H "Cookie: token=SUPER_ADMIN_TOKEN_HERE" \
  -d '{
    "role": "MODERATOR"
  }'
```

### Get All Posts (Admin)

```bash
curl "http://localhost:5000/api/admin/posts?page=1&limit=10" \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

### Block Post

```bash
curl -X PATCH http://localhost:5000/api/admin/posts/POST_ID_HERE/block \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

### Unblock Post

```bash
curl -X PATCH http://localhost:5000/api/admin/posts/POST_ID_HERE/unblock \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

### Delete Post (Admin)

```bash
curl -X DELETE http://localhost:5000/api/admin/posts/POST_ID_HERE \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

### Get All Comments (Admin)

```bash
curl "http://localhost:5000/api/admin/comments?page=1&limit=10" \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

### Delete Comment (Admin)

```bash
curl -X DELETE http://localhost:5000/api/admin/comments/COMMENT_ID_HERE \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

### Get All Reports (Admin)

```bash
curl "http://localhost:5000/api/admin/reports?status=PENDING" \
  -H "Cookie: token=ADMIN_TOKEN_HERE"
```

### Resolve Report (Admin)

```bash
curl -X PATCH http://localhost:5000/api/admin/reports/REPORT_ID_HERE/resolve \
  -H "Content-Type: application/json" \
  -H "Cookie: token=ADMIN_TOKEN_HERE" \
  -d '{
    "action": "BLOCKED",
    "resolution": "This post violates community guidelines"
  }'
```

---

## Testing with Postman

### 1. Import Collection (Optional)

Create a new Postman collection and add these folders:
- Auth
- Users
- Posts
- Comments
- Reports
- Admin

### 2. Set Environment Variables

In Postman Environment:
```
base_url: http://localhost:5000/api
token: (leave empty, will be filled after login)
admin_token: (leave empty, will be filled after admin login)
post_id: (will be filled after creating post)
user_id: (will be filled after creating/getting user)
```

### 3. Use Dynamic Values

After signup/login, set token:
```
Tests tab:
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.data.token);
```

After creating post, set post_id:
```
Tests tab:
var jsonData = pm.response.json();
pm.environment.set("post_id", jsonData.data._id);
```

### 4. Use in Requests

In Cookie header:
```
token={{token}}
```

In URL:
```
{{base_url}}/posts/{{post_id}}
```

---

## Integration Test Scenario

### Step-by-step workflow:

**1. Signup**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Test",
    "email": "johntest@test.com",
    "password": "Test123456"
  }'
# Save token as TOKEN
```

**2. Get Profile**
```bash
curl http://localhost:5000/api/users/me \
  -H "Cookie: token=TOKEN"
```

**3. Create Post**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: token=TOKEN" \
  -d '{
    "title": "Integration Test Post",
    "description": "Testing the full API workflow",
    "category": "POTHOLE",
    "type": "ISSUE",
    "location": {"city": "Mumbai", "lat": 19.0760, "lng": 72.8777}
  }'
# Save post ID as POST_ID
```

**4. Get Posts**
```bash
curl "http://localhost:5000/api/posts"
```

**5. Like Post**
```bash
curl -X POST http://localhost:5000/api/posts/POST_ID/like \
  -H "Cookie: token=TOKEN"
```

**6. Comment on Post**
```bash
curl -X POST http://localhost:5000/api/comments \
  -H "Content-Type: application/json" \
  -H "Cookie: token=TOKEN" \
  -d '{
    "text": "Great issue report!",
    "postId": "POST_ID"
  }'
```

**7. Report Post**
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -H "Cookie: token=TOKEN" \
  -d '{
    "postId": "POST_ID",
    "reason": "Test report"
  }'
```

**8. Logout**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Cookie: token=TOKEN"
```

---

## Error Handling Tests

### Test Invalid Email

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "password": "Pass123456"
  }'
```

**Expected (400):**
```json
{
  "statusCode": 400,
  "data": null,
  "message": "\"email\" must be a valid email",
  "success": false
}
```

### Test Weak Password

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@test.com",
    "password": "weak"
  }'
```

**Expected (400):**
```json
{
  "statusCode": 400,
  "data": null,
  "message": "\"password\" with value \"weak\" fails to match the required pattern",
  "success": false
}
```

### Test Duplicate Email

```bash
# First signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "duplicate@test.com",
    "password": "Pass123456"
  }'

# Second signup with same email
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another",
    "email": "duplicate@test.com",
    "password": "Pass123456"
  }'
```

**Expected (409):**
```json
{
  "statusCode": 409,
  "data": null,
  "message": "Email already registered",
  "success": false
}
```

### Test Missing Token

```bash
curl http://localhost:5000/api/users/me
```

**Expected (401):**
```json
{
  "statusCode": 401,
  "data": null,
  "message": "No authentication token provided",
  "success": false
}
```

### Test Invalid Token

```bash
curl http://localhost:5000/api/users/me \
  -H "Cookie: token=invalid_token_here"
```

**Expected (401):**
```json
{
  "statusCode": 401,
  "data": null,
  "message": "Invalid token",
  "success": false
}
```

### Test Unauthorized Access

```bash
# Try to access admin endpoint as regular user
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID/ban \
  -H "Cookie: token=USER_TOKEN"
```

**Expected (403):**
```json
{
  "statusCode": 403,
  "data": null,
  "message": "Insufficient permissions",
  "success": false
}
```

---

## Performance Testing

### Load Testing with Apache Bench

```bash
# Install: brew install httpd (Mac) or apt-get install apache2-utils (Linux)

# Test 1000 requests with 10 concurrent
ab -n 1000 -c 10 http://localhost:5000/api/health
```

### Load Testing with wrk

```bash
# Install: brew install wrk

wrk -t12 -c400 -d30s http://localhost:5000/api/health
```

---

## Monitoring Requests

### View Backend Logs

```bash
npm run dev
# Watch console for request logs
```

### Monitor with MongoDB

```bash
# Connect to MongoDB
mongo

# Select database
use civiclens

# View collections
show collections

# Count documents
db.posts.count()
db.users.count()
db.comments.count()

# View recent posts
db.posts.find().sort({createdAt: -1}).limit(5)
```

---

## Checklist

- [ ] Health check passes
- [ ] Signup creates user
- [ ] Login returns token
- [ ] Token works for authenticated endpoints
- [ ] Posts can be created (with image if available)
- [ ] Posts can be retrieved and filtered
- [ ] Comments can be added to posts
- [ ] Like toggle works
- [ ] Reports can be submitted
- [ ] Admin endpoints require admin role
- [ ] Errors are handled gracefully
- [ ] Rate limiting is active
- [ ] Database indexes are working

---

Built with ❤️ by CivicLens Team
