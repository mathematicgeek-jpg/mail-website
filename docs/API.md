# Mathematics Geek API Documentation

Backend APIs for **mathematicsgeek.com** are built using **FastAPI** (Python).

* **Base URL**: `http://localhost:8000` (or production URL)
* **Interactive Docs**: `/docs` (Swagger UI) or `/redoc` (ReDoc)

---

## Authentication

All admin/moderator endpoints require a JWT bearer token.

### 1. Admin Login
* **Endpoint**: `POST /api/auth/login`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "your-password"
  }
  ```
* **Response**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```

---

## Leads & Inquiries

### 1. Submit Demo Class Inquiry
* **Endpoint**: `POST /api/demo-inquiry`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "name": "Rohan Malhotra",
    "phone": "+919876543210",
    "email": "rohan@gmail.com",
    "city": "Delhi",
    "state": "Delhi",
    "country": "India",
    "studentClass": "Class 10",
    "board": "ICSE",
    "preferredMode": "Online Live Sessions",
    "message": "Need help with board exam preps."
  }
  ```
* **Response**:
  ```json
  {
    "id": "76e3381a-6d60-4411-a83d-6ff84bf72957",
    "name": "Rohan Malhotra",
    "phone": "+919876543210",
    "email": "rohan@gmail.com",
    ...
  }
  ```

### 2. Get All Inquiries
* **Endpoint**: `GET /api/demo-inquiries`
* **Access**: Admin (Requires Bearer Token)

### 3. Update Inquiry Status
* **Endpoint**: `PUT /api/admin/inquiry/{inquiry_id}/status`
* **Access**: Admin (Requires Bearer Token)
* **Request Body**:
  ```json
  {
    "status": "contacted"
  }
  ```

### 4. Delete Inquiry
* **Endpoint**: `DELETE /api/admin/inquiry/{inquiry_id}`
* **Access**: Admin (Requires Bearer Token)

---

## Testimonials

### 1. Submit Testimonial
* **Endpoint**: `POST /api/testimonial`
* **Access**: Public (requires admin approval before public listing)

### 2. List Testimonials
* **Endpoint**: `GET /api/testimonials?approved_only=true`
* **Access**: Public

### 3. Approve Testimonial
* **Endpoint**: `PUT /api/admin/testimonial/{testimonial_id}/approve`
* **Access**: Admin (Requires Bearer Token)
* **Request Body**:
  ```json
  {
    "approved": true
  }
  ```

---

## Blog Engine

### 1. List Blog Posts
* **Endpoint**: `GET /api/blog/posts`
* **Params**: `category` (optional), `tag` (optional), `limit` (default: 50)
* **Access**: Public

### 2. Get Post by Slug
* **Endpoint**: `GET /api/blog/posts/{slug}`
* **Access**: Public (Increments view count)

### 3. Create Blog Post
* **Endpoint**: `POST /api/admin/blog/posts`
* **Access**: Admin (Requires Bearer Token)

---

## Gamification Arena

### 1. List Game Templates
* **Endpoint**: `GET /api/games/templates`
* **Access**: Public

### 2. Start Game Session
* **Endpoint**: `POST /api/games/start`
* **Request Body**:
  ```json
  {
    "template_id": "gt1",
    "player_name": "Shrey M."
  }
  ```
* **Response**: Returns session ID, player name, time limit, and an array of safe questions (without correct answers).

### 3. Submit Answer
* **Endpoint**: `POST /api/games/answer`
* **Params**: `session_id`, `question_id`, `answer`, `time_taken`
* **Response**: Returns if answer is correct, correct answer, explanation, gained XP, and streak.

### 4. Complete Session
* **Endpoint**: `POST /api/games/complete/{session_id}`
* **Response**: Updates global leaderboard and user progress profile.

### 5. Get Leaderboard
* **Endpoint**: `GET /api/games/leaderboard`
* **Access**: Public
