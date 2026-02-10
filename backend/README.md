# 🚀 EndpointX Backend API Documentation

## 📋 Overview
RESTful API for EndpointX - a gamified API-building and verification platform. All protected routes require authentication via JWT cookies.

## 🔐 Authentication Routes (`/auth`)

### **POST /auth/signup**
Register a new user account.
- **URL:** `POST /auth/signup`
- **Auth Required:** ❌ No
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```
- **Response:** User info (excludes password)

---

### **POST /auth/login**  
Login user and set authentication cookie.
- **URL:** `POST /auth/login`
- **Auth Required:** ❌ No
- **Request Body:**
```json
{
  "email": "john@example.com", 
  "password": "securepassword"
}
```
- **Response:** JWT token + user info + **sets `authToken` cookie**

---

### **POST /auth/logout**
Clear authentication cookie and logout user.
- **URL:** `POST /auth/logout`
- **Auth Required:** ❌ No
- **Request Body:** *(empty)*
- **Response:** Success message

---

### **GET /auth/user**
Get current user information from authentication cookie.
- **URL:** `GET /auth/user`
- **Auth Required:** ✅ Yes (reads from cookie)
- **Request Body:** *(none)*
- **Response:** Current user details

---

## 📝 Questions Routes (`/questions`)

### **GET /questions**
List all available coding questions.
- **URL:** `GET /questions`
- **Auth Required:** ✅ Yes
- **Request Body:** *(none)*
- **Response:** 
```json
{
  "questions": [
    {
      "id": "uuid-123",
      "title": "Build User API",
      "description": "Create REST endpoints for user management"
    }
  ],
  "count": 5,
  "user": "john@example.com"
}
```

---

### **POST /questions/get**
Get detailed information for a specific question.
- **URL:** `POST /questions/get`
- **Auth Required:** ✅ Yes
- **Request Body:**
```json
{
  "questionId": "your-question-uuid-here"
}
```
- **Response:** Complete question details including API specs, difficulty, etc.

---

### **POST /questions/my-submissions**
Get all code submissions for the current user.
- **URL:** `POST /questions/my-submissions`
- **Auth Required:** ✅ Yes
- **Request Body:** *(empty)*
- **Response:**
```json
{
  "submissions": [
    {
      "submission_id": "uuid-456",
      "question_id": "uuid-123",
      "code_files": {"app.js": "const express = require('express')..."},
      "language": "javascript",
      "framework": "express", 
      "status": "passed",
      "score": 85.5,
      "test_results": {"passed": 8, "failed": 2},
      "submitted_at": "2026-02-11T10:30:00Z",
      "question_title": "Build User API",
      "question_description": "Create REST endpoints...",
      "difficulty": "medium"
    }
  ],
  "count": 3,
  "user": "john@example.com"
}
```

---

### **POST /questions/:id**
Submit code solution for verification.
- **URL:** `POST /questions/{question-uuid}`
- **Auth Required:** ✅ Yes
- **Request Body:**
```json
{
  "language": "javascript",
  "userCode": "const express = require('express');\n// Your API implementation..."
}
```
- **Response:** 
```json
{
  "success": true,
  "message": "Submission queued for verification"
}
```

---

## 🔧 Frontend Integration Examples

```javascript
const API_BASE = 'http://localhost:3000';

// Standard options for authenticated requests
const authOptions = {
  credentials: 'include', // REQUIRED for cookie auth
  headers: { 'Content-Type': 'application/json' }
};

// 1. Login
const loginResponse = await fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  ...authOptions,
  body: JSON.stringify({ 
    email: 'user@example.com', 
    password: 'password123' 
  })
});

// 2. Get all questions  
const questionsResponse = await fetch(`${API_BASE}/questions`, authOptions);

// 3. Get specific question
const questionResponse = await fetch(`${API_BASE}/questions/get`, {
  method: 'POST', 
  ...authOptions,
  body: JSON.stringify({ questionId: 'question-uuid-here' })
});

// 4. Submit answer
const submitResponse = await fetch(`${API_BASE}/questions/question-uuid-here`, {
  method: 'POST',
  ...authOptions, 
  body: JSON.stringify({ 
    language: 'javascript', 
    userCode: 'const app = express();...' 
  })
});

// 5. Get my submissions
const submissionsResponse = await fetch(`${API_BASE}/questions/my-submissions`, {
  method: 'POST',
  ...authOptions
});
```

---

## 🛡️ Authentication & Security

### Cookie-Based Authentication
- **Cookie Name:** `authToken`
- **Type:** JWT (JSON Web Token)
- **Expiry:** 1 hour
- **Security:** httpOnly, sameSite=lax protection
- **Frontend Requirement:** Use `credentials: 'include'` in all fetch requests

### Protected Routes
All routes under `/questions` require authentication. The middleware automatically:
- Verifies JWT token from cookies
- Adds user info to `req.user` object
- Returns 401 if token is missing/invalid/expired

---

## 🏃 Running the Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server  
npm start
```

**Server runs on:** `http://localhost:3000`

---

## 🗃️ Database Schema

The API uses PostgreSQL with the following main tables:
- `users` - User accounts and authentication
- `questions` - Coding challenges and specifications  
- `answers` - User code submissions and results
- `unit_tests` - Test cases for questions

---

## 🐰 Message Queue Integration

The API integrates with RabbitMQ for asynchronous code verification:
- Submissions are queued for processing
- Verification engine runs tests in isolated containers
- Results are stored back to database

---

## 📞 Support & Development

For questions about API usage or development setup, check the main project documentation or contact the development team.