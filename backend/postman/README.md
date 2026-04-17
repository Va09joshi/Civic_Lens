# Postman Collections - CivicLens Backend

## 📦 Collections Included

### 1. **CivicLens-Admin.postman_collection.json**
Complete admin operations including:
- ✅ Authentication (Admin login, logout)
- ✅ User Management (Get users, ban, unban, verify, change role, delete)
- ✅ Post Management (Get posts, block, unblock, delete)
- ✅ Comment Management (Get comments, delete)
- ✅ Report Management (Get reports, resolve with actions)

### 2. **CivicLens-User.postman_collection.json**
Complete user operations including:
- ✅ Authentication (Signup, login, logout, refresh token)
- ✅ User Profile (Get profile, update, delete, get others)
- ✅ Posts (Create, read, update, delete, like, filter by category/city)
- ✅ Comments (Create, read, delete)
- ✅ Reports (Report post, view reports)
- ✅ Health Check

---

## 🚀 How to Import

### Step 1: Open Postman
- Download from https://www.postman.com/downloads/
- Or use web version: https://web.postman.co

### Step 2: Import Collections

**Option A: File Import**
1. Click **Import** button (top left)
2. Select **Upload Files**
3. Choose `CivicLens-Admin.postman_collection.json` or `CivicLens-User.postman_collection.json`
4. Click **Import**

**Option B: Folder Import**
1. Click **File** → **Open**
2. Navigate to `postman/` folder
3. Both collections will be imported

### Step 3: Create Environment (Optional but Recommended)

1. Click **Environments** (left sidebar)
2. Click **Create New**
3. Name: `CivicLens Dev`
4. Add variables:
   ```
   base_url: http://localhost:5000/api
   token: (auto-filled after login)
   user_id: (auto-filled after signup/login)
   post_id: (auto-filled after creating post)
   comment_id: (auto-filled after creating comment)
   report_id: (auto-filled after creating report)
   ```
5. Click **Save**

### Step 4: Select Environment
- Click the environment dropdown (top right)
- Select `CivicLens Dev`

---

## 🔑 Setup & Configuration

### For User Collection:

**Step 1: Login or Signup**
- Use **Signup** endpoint to create account
- Or use **Login** endpoint with test credentials:
  ```
  email: john@civiclens.com
  password: UserPass123
  ```

**Automatic Token Capture:**
- The signup/login requests have **Tests** script
- Token automatically saved to `{{token}}` variable
- User ID automatically saved to `{{user_id}}` variable

### For Admin Collection:

**Step 1: Admin Login**
- Use **Admin Login** endpoint
- Test credentials:
  ```
  email: admin@civiclens.com
  password: AdminPass123
  ```

**Step 2: Token Automatically Captured**
- Token saved to `{{token}}` variable
- Ready for all admin operations

---

## 📝 Usage Examples

### Example 1: Create Post as User

1. Import **CivicLens-User** collection
2. Go to **Authentication** → **Login**
3. Click **Send**
4. Token auto-captured ✅
5. Go to **Posts** → **Create Post (Without Image)**
6. Click **Send**
7. Post ID auto-captured ✅
8. Go to **Posts** → **Like Post**
9. Click **Send** (uses `{{post_id}}`)

### Example 2: Manage Users as Admin

1. Import **CivicLens-Admin** collection
2. Go to **Authentication** → **Admin Login**
3. Click **Send**
4. Token auto-captured ✅
5. Go to **User Management** → **Get All Users**
6. Click **Send**
7. From response, copy a user ID
8. Paste into Postman environment: `user_id`
9. Go to **User Management** → **Ban User**
10. Click **Send** (automatically uses `{{user_id}}`)

### Example 3: Moderate Reports

1. Go to **Report Management** → **Get All Reports**
2. Click **Send**
3. From response, copy a report ID
4. Paste into: `report_id` environment variable
5. Go to **Report Management** → **Resolve Report (Block)**
6. Click **Send**

---

## 🔄 Request Types

### Authentication Requests
- **No Auth Required** for signup
- Use token from login for other requests

### Admin Requests
- **Require Admin Token**
- Get from admin login endpoint

### User Requests
- **Some public** (get posts, browse)
- **Some protected** (create post, comment)
- Get token from signup/login

---

## 📊 Variable Reference

| Variable | Auto-Set By | Used In |
|----------|-------------|---------|
| `base_url` | Manual | All requests |
| `token` | Login/Signup | All authenticated requests |
| `user_id` | Login/Signup | Get user, Update, Delete |
| `post_id` | Create Post | Get post, Update, Delete, Like, Comment |
| `comment_id` | Create Comment | Get comment, Delete |
| `report_id` | Create Report | Resolve report |

---

## ✅ Test Credentials

**ADMIN (Use for Admin collection):**
```
Email: admin@civiclens.com
Password: AdminPass123
Role: SUPER_ADMIN
```

**USER (Use for User collection):**
```
Email: john@civiclens.com
Password: UserPass123
Role: USER
```

Other test users (after seeding):
```
Email: jane@civiclens.com
Password: UserPass123
```

---

## 🎯 Common Workflows

### Workflow 1: Create & Moderate Post

1. **As User:**
   - Login
   - Create post
   - Add comments
   - Like post

2. **As Admin:**
   - Get all posts
   - View specific post
   - If problematic: Block or Delete

### Workflow 2: Handle Reports

1. **As User:**
   - Report inappropriate post
   - Provide reason

2. **As Admin:**
   - Get all reports (filter by PENDING)
   - Review report details
   - Resolve with action (BLOCK/DELETE/DISMISS)

### Workflow 3: Manage Users

1. **As Admin:**
   - Get all users
   - Ban user
   - Change user role
   - Verify user (if needed)

---

## 📋 Tips & Tricks

### Automatic Token Management
- Postman **Tests** scripts auto-capture values
- No need to manually copy-paste tokens
- Just login once, all requests work

### Pagination
- All list endpoints support `page` and `limit`
- Default: `page=1`, `limit=10`
- Max limit: 100

### Filtering
- Posts: Filter by `category` or `city`
- Users: Filter by `role` or `isBanned`
- Reports: Filter by `status` (PENDING/RESOLVED)

### Error Testing
- Try invalid IDs to see 404 responses
- Try without token to see 401 responses
- Try as user to see 403 (forbidden) responses

---

## 🔗 Environment Setup

### Development
```
base_url: http://localhost:5000/api
```

### Production
```
base_url: https://your-domain.com/api
```

Just change in environment variables!

---

## 📞 Troubleshooting

### "Invalid token" Error
- Regenerate token: Run login endpoint again
- Check token is selected in environment dropdown
- Verify `{{token}}` is used in request

### "Variable not found" Error
- Check variable name matches: `{{variable_name}}`
- Ensure request that auto-sets variable was run first
- Manually paste value if auto-capture failed

### "500 Server Error"
- Check backend is running: `npm run dev`
- Check MongoDB connection
- Review server logs for details

### "CORS Error"
- Ensure backend CORS is configured
- Frontend URL matches `FRONTEND_URL` in `.env`
- Check if using right base_url

---

## 📚 Related Documentation

See main README for:
- Full API documentation: `API_DOCUMENTATION.md`
- Testing guide: `TESTING.md`
- Setup instructions: `SETUP.md`

---

**Built with ❤️ for CivicLens**

Import both collections and start testing immediately! 🚀
