# CivicLens API Documentation

Complete API reference with examples.

## Base URL

```
http://localhost:5000/api
```

## Response Format

All responses follow this format:

```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message",
  "success": true
}
```

---

## Authentication Endpoints

### 1. Signup

**Request:**
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "isVerified": false,
      "isBanned": false,
      "createdAt": "2024-04-17T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User registered successfully",
  "success": true
}
```

---

### 2. Login

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful",
  "success": true
}
```

**Note:** Token is automatically set in HTTP-only cookie

---

### 3. Logout

**Request:**
```http
POST /auth/logout
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Logout successful",
  "success": true
}
```

---

### 4. Refresh Token

**Request:**
```http
POST /auth/refresh-token
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Token refreshed successfully",
  "success": true
}
```

---

## User Endpoints

### Get Profile

**Request:**
```http
GET /users/me
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "avatar": "https://cdnurl.com/avatar.jpg",
    "bio": "I care about my city",
    "isVerified": false,
    "isBanned": false,
    "createdAt": "2024-04-17T10:00:00Z"
  },
  "message": "Profile retrieved successfully",
  "success": true
}
```

---

### Update Profile

**Request:**
```http
PATCH /users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe Updated",
  "bio": "Updated bio"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": { ... updated user ... },
  "message": "Profile updated successfully",
  "success": true
}
```

---

### Delete Profile

**Request:**
```http
DELETE /users/me
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Account deleted successfully",
  "success": true
}
```

---

## Post Endpoints

### Create Post

**Request:**
```http
POST /posts
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "Pothole on Main Street",
  "description": "There's a large pothole on Main Street near the traffic light that's causing accidents",
  "category": "POTHOLE",
  "type": "ISSUE",
  "location": {
    "city": "Mumbai",
    "lat": 19.0760,
    "lng": 72.8777
  },
  "images": [file1, file2]
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Pothole on Main Street",
    "description": "There's a large pothole...",
    "category": "POTHOLE",
    "type": "ISSUE",
    "images": [
      {
        "url": "https://cloudinary.com/image.jpg",
        "publicId": "civiclens/posts/abc123"
      }
    ],
    "location": {
      "type": "Point",
      "coordinates": [72.8777, 19.0760],
      "city": "Mumbai"
    },
    "likes": [],
    "commentsCount": 0,
    "aiAnalysis": {
      "score": 0.82,
      "label": "Likely True",
      "reason": "The post provides specific location details and describes a real infrastructure issue",
      "analyzedAt": "2024-04-17T10:00:00Z"
    },
    "isBlocked": false,
    "isDeleted": false,
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "..."
    },
    "createdAt": "2024-04-17T10:00:00Z"
  },
  "message": "Post created successfully",
  "success": true
}
```

---

### Get All Posts

**Request:**
```http
GET /posts?page=1&limit=10&category=POTHOLE&city=Mumbai&sortBy=latest
```

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10, max: 100) - Items per page
- `category` - Filter by category
- `city` - Filter by city
- `sortBy` - `latest` (default) or `trending`

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "posts": [
      { ... post object ... },
      { ... post object ... }
    ],
    "metadata": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "pages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Posts retrieved successfully",
  "success": true
}
```

---

### Get Single Post

**Request:**
```http
GET /posts/:id
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": { ... full post object ... },
  "message": "Post retrieved successfully",
  "success": true
}
```

---

### Update Post

**Request:**
```http
PATCH /posts/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": { ... updated post ... },
  "message": "Post updated successfully",
  "success": true
}
```

---

### Delete Post

**Request:**
```http
DELETE /posts/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Post deleted successfully",
  "success": true
}
```

---

### Toggle Like

**Request:**
```http
POST /posts/:id/like
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "post": { ... },
    "liked": true
  },
  "message": "Post like toggled successfully",
  "success": true
}
```

---

### Get Posts by Category

**Request:**
```http
GET /posts/category/POTHOLE?page=1&limit=10
```

**Response:** Same as Get All Posts

---

### Get Posts by City

**Request:**
```http
GET /posts/city/Mumbai?page=1&limit=10
```

**Response:** Same as Get All Posts

---

## Comment Endpoints

### Create Comment

**Request:**
```http
POST /comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "This is a serious issue that needs immediate attention",
  "postId": "507f1f77bcf86cd799439012"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "text": "This is a serious issue...",
    "postId": "507f1f77bcf86cd799439012",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "..."
    },
    "createdAt": "2024-04-17T10:00:00Z"
  },
  "message": "Comment created successfully",
  "success": true
}
```

---

### Get Comments on Post

**Request:**
```http
GET /comments/:postId?page=1&limit=20
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "comments": [
      { ... comment ... },
      { ... comment ... }
    ],
    "metadata": { ... }
  },
  "message": "Comments retrieved successfully",
  "success": true
}
```

---

### Delete Comment

**Request:**
```http
DELETE /comments/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Comment deleted successfully",
  "success": true
}
```

---

## Report Endpoints

### Create Report

**Request:**
```http
POST /reports
Authorization: Bearer {token}
Content-Type: application/json

{
  "postId": "507f1f77bcf86cd799439012",
  "reason": "This post contains false information and is misleading"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "postId": "507f1f77bcf86cd799439012",
    "reportedBy": "507f1f77bcf86cd799439011",
    "reason": "This post contains false information...",
    "status": "PENDING",
    "createdAt": "2024-04-17T10:00:00Z"
  },
  "message": "Report submitted successfully",
  "success": true
}
```

---

## Admin Endpoints

**All admin endpoints require authentication and ADMIN role or higher**

### Get All Users

**Request:**
```http
GET /admin/users?page=1&limit=10&role=USER&isBanned=false
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "users": [ ... ],
    "metadata": { ... }
  },
  "message": "Users retrieved successfully",
  "success": true
}
```

---

### Ban User

**Request:**
```http
PATCH /admin/users/:id/ban
Authorization: Bearer {admin_token}
```

---

### Unban User

**Request:**
```http
PATCH /admin/users/:id/unban
Authorization: Bearer {admin_token}
```

---

### Verify User

**Request:**
```http
PATCH /admin/users/:id/verify
Authorization: Bearer {admin_token}
```

---

### Change User Role (SUPER_ADMIN only)

**Request:**
```http
PATCH /admin/users/:id/role
Authorization: Bearer {super_admin_token}
Content-Type: application/json

{
  "role": "MODERATOR"
}
```

---

### Block Post

**Request:**
```http
PATCH /admin/posts/:id/block
Authorization: Bearer {admin_token}
```

---

### Unblock Post

**Request:**
```http
PATCH /admin/posts/:id/unblock
Authorization: Bearer {admin_token}
```

---

### Get All Reports

**Request:**
```http
GET /admin/reports?status=PENDING
Authorization: Bearer {admin_token}
```

---

### Resolve Report

**Request:**
```http
PATCH /admin/reports/:id/resolve
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "action": "BLOCKED",
  "resolution": "Post violates community guidelines"
}
```

**Actions:** `DISMISSED`, `WARNING`, `BLOCKED`, `DELETED`

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Email is required",
  "success": false
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "data": null,
  "message": "Invalid email or password",
  "success": false
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "data": null,
  "message": "Insufficient permissions",
  "success": false
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "data": null,
  "message": "Post not found",
  "success": false
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "data": null,
  "message": "Email already registered",
  "success": false
}
```

### 429 Too Many Requests

```json
{
  "statusCode": 429,
  "data": null,
  "message": "Too many requests, please try again later",
  "success": false
}
```

### 500 Server Error

```json
{
  "statusCode": 500,
  "data": null,
  "message": "Internal Server Error",
  "success": false
}
```

---

## Categories

Available post categories:
- `POTHOLE`
- `STREETLIGHT`
- `SANITATION`
- `WATER`
- `ELECTRICITY`
- `TRAFFIC`
- `POLLUTION`
- `CORRUPTION`
- `OTHER`

---

## Roles & Permissions

| Role | Can | Cannot |
|------|-----|--------|
| USER | Create posts, Comment, Like, Report | Manage users, moderate, resolve reports |
| MODERATOR | Everything USER can + Delete inappropriate content | Manage users, change roles |
| ADMIN | Everything MODERATOR can + Manage all content and users | Delete users, change roles |
| SUPER_ADMIN | Everything + Delete users + Change roles | – |

---

## Rate Limits

- **General API:** 100 requests per 15 minutes
- **Authentication:** 5 requests per 15 minutes

---

Built with ❤️ by CivicLens Team
