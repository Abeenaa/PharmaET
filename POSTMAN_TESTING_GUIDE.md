# 📮 Postman Testing Guide - PharmaET API

## 1️⃣ Import Collection

1. Open **Postman**
2. Click **Import** (top left)
3. Choose **Upload Files**
4. Select `postman_collection.json` from PharmaET folder
5. Click **Import**

You should now see a collection called "PharmaET API" with 7 requests.

---

## 2️⃣ Test Workflow

### **Step 1: Login (Get Tokens)**

1. Click `1. Login - Super Admin`
2. Click **Send**
3. You'll see response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": "ef50de3b-c6f6-44a3-97ae-57728f134a61",
    "email": "admin@pharmaet.local",
    "name": "Super Admin",
    "role": "SUPER_ADMIN"
  }
}
```

4. **Save the tokens:**
   - Copy `access_token` value (full string)
   - Go to **Variables** tab at bottom
   - Paste into `access_token` variable
   - Do the same for `refresh_token`

---

### **Step 2: Get Current User (Protected Endpoint)**

1. Click `2. Get Current User (Protected)`
2. Click **Send**
3. Should return your user info (proves token works!)

Response:
```json
{
  "id": "ef50de3b-c6f6-44a3-97ae-57728f134a61",
  "email": "admin@pharmaet.local",
  "name": "Super Admin",
  "role": "SUPER_ADMIN",
  "branch_id": null,
  "is_active": true
}
```

---

### **Step 3: Refresh Token**

1. Click `3. Refresh Token`
2. Click **Send**
3. You get a **new access_token** (old one still valid for 1 hour)

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": { ... }
}
```

---

### **Step 4: Logout**

1. Click `4. Logout`
2. Click **Send**
3. Response: `{ "message": "Logged out successfully" }`
4. Token is now **blacklisted**

---

### **Step 5: Verify Token is Blacklisted**

1. Click `5. Try Protected Endpoint After Logout`
2. Click **Send**
3. Should get **401 Unauthorized**:
```json
{
  "message": "Invalid or expired token",
  "error": "Unauthorized",
  "statusCode": 401
}
```

✅ This proves logout worked!

---

## 3️⃣ Test All User Roles

Try logging in as different users to see role differences:

**Test Cases:**

| User | Email | Password | Expected Role |
|------|-------|----------|----------------|
| Super Admin | admin@pharmaet.local | admin123 | SUPER_ADMIN |
| Manager | manager@pharmaet.local | admin123 | BRANCH_ADMIN |
| Pharmacist | pharmacist@pharmaet.local | admin123 | PHARMACIST |
| Cashier | cashier@pharmaet.local | admin123 | CASHIER |

### Test Invalid Login

Create a new request:
1. **Method:** POST
2. **URL:** `http://localhost:3000/api/auth/login`
3. **Body (raw JSON):**
```json
{
  "email": "admin@pharmaet.local",
  "password": "wrongpassword"
}
```
4. **Send** → Should get **401 Unauthorized**

---

## 4️⃣ Using Variables (Auto-Save Tokens)

### Method 1: Manual (Already done above)
Copy-paste tokens into Variables tab

### Method 2: Automatic (Using Tests Tab)

In the **Login** request, add under **Tests** tab:
```javascript
// Auto-save tokens to variables
var jsonData = pm.response.json();
pm.environment.set("access_token", jsonData.access_token);
pm.environment.set("refresh_token", jsonData.refresh_token);
```

Then every time you login:
1. Send login request
2. Tokens auto-populate in other requests
3. No manual copying needed!

---

## 5️⃣ Environment Setup (Optional but Recommended)

Create an environment file for different deployment URLs:

1. Click **Environments** (left sidebar)
2. Click **+ Create**
3. Name it: `PharmaET Dev`
4. Add variables:
   - `base_url` = `http://localhost:3000/api`
   - `access_token` = (empty, will auto-fill)
   - `refresh_token` = (empty, will auto-fill)
5. Click **Save**

Then in requests, replace URLs with:
```
{{base_url}}/auth/login
```

---

## 6️⃣ Test Error Cases

### Test Case 1: Invalid Email
```json
{
  "email": "nonexistent@pharmaet.local",
  "password": "admin123"
}
```
**Expected:** 401 Unauthorized

### Test Case 2: Invalid Password
```json
{
  "email": "admin@pharmaet.local",
  "password": "wrongpassword"
}
```
**Expected:** 401 Unauthorized

### Test Case 3: Expired Token
1. Login and get `access_token`
2. Wait 1 hour (or modify JWT expiration for testing)
3. Try `GET /auth/me`
**Expected:** 401 Unauthorized

### Test Case 4: No Authorization Header
1. Go to `2. Get Current User (Protected)`
2. Remove the Authorization header
3. Click Send
**Expected:** 401 Unauthorized

---

## 7️⃣ Response Status Codes

| Endpoint | Status | Meaning |
|----------|--------|---------|
| Login (valid) | 200 | Success |
| Login (invalid) | 401 | Unauthorized |
| GET /me (valid token) | 200 | Success |
| GET /me (no token) | 401 | Unauthorized |
| GET /me (expired token) | 401 | Token expired |
| Logout | 200 | Success |
| Refresh (valid) | 200 | New token issued |
| Refresh (invalid) | 401 | Bad refresh token |

---

## 8️⃣ Debugging Tips

**Can't connect?**
- Ensure server is running: `npm run start:dev`
- Check port 3000 is not blocked
- Verify `http://localhost:3000/api/auth/login` loads

**Token not working?**
- Make sure it's in format: `Bearer <token>`
- Check token hasn't expired
- Verify token copied completely (no extra spaces)

**Getting 500 error?**
- Check server console for error messages
- Verify database is running: `docker ps`
- Try restarting server

---

## 9️⃣ Next: Import and Test Now! 🚀

1. Download `postman_collection.json`
2. Import into Postman
3. Run: `1. Login - Super Admin`
4. Save tokens to Variables
5. Run: `2. Get Current User (Protected)`
6. Profit! ✅

---

## 📊 Quick Reference

**All Endpoints:**
- `POST /auth/login` - Get tokens
- `GET /auth/me` - Get user info (requires token)
- `POST /auth/refresh-token` - Get new access token
- `POST /auth/logout` - Blacklist token

**Demo Users (all use password `admin123`):**
- admin@pharmaet.local (Super Admin)
- manager@pharmaet.local (Branch Manager)
- pharmacist@pharmaet.local (Pharmacist)
- cashier@pharmaet.local (Cashier)

**Base URL:** `http://localhost:3000/api`

**Token Format:** `Bearer eyJhbGciOiJIUzI1NiIs...`
