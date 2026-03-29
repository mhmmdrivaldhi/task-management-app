# 🚀 Task Management App (Fullstack)

A fullstack **Task Management Application** built to help users manage daily tasks efficiently.
This project implements authentication, task CRUD operations, and persistent state management using modern technologies.

---

## 📌 Overview

This application allows users to:

* Register and login securely using JWT authentication
* Create, read, update, and delete tasks
* Mark tasks as completed or pending
* Access protected routes on the frontend
* Persist authentication state using Zustand

---

## 🛠️ Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **TypeScript**
* **PostgreSQL**
* **JWT (Authentication)**
* **bcrypt (Password Hashing)**

### Frontend

* **Next.js (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **Zustand (State Management + Persist)**
* **Axios (API Client)**
* **ShadCN/UI**

---

## 📁 Project Structure

### Backend

```
backend/
│── src/
│   ├── controller/    # HTTP request handlers
│   ├── lib/        # Database & environment configuration
│   ├── middleware/    # Custom middleware (auth, etc.)
│   ├── routes/        # API route definitions
│   ├── service/       # Business logic layer & Database Queries
│   ├── utils/         # Helper functions (response, error handler)
│   └── server.ts      # Application entry point
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── schema.sql
└── tsconfig.json
```

### Frontend

```
frontend/
│── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Zustand stores (auth, tasks)
│   ├── lib/           # Axios instance & utilities
│   ├── types/         # TypeScript types
│
├── public/
├── .env
├── .env.example
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
└── next.config.js
├── package.json
├── package-lock.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/mhmmdrivaldhi/task-management-app.git
cd task-management-app
```

---

## 🔧 Backend Setup
```bash
cd backend 
npm install
```

### Install Dependencies

```bash
cd backend
npm install
```

### Environment Configuration

Create `.env` file:

# Server
PORT=
NODE_ENV=

# PostgreSQL

DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
# JWT

JWT_SECRET_KEY=
JWT_EXPIRES_IN=

---

### Database Setup (PostgreSQL)

Create database:

CREATE DATABASE taskdb;

- Create users table:

CREATE TABLE users (
  id         SERIAL              PRIMARY KEY,
  name       VARCHAR(100)        NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(255)        NOT NULL,
  created_at TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

- Create tasks table:

CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200)  NOT NULL,
  description TEXT,
  completed   BOOLEAN       NOT NULL DEFAULT FALSE,
  user_id     INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

---

### Run Backend Server

```bash
npm run dev
```

Backend will run on:

```
http://localhost:5000
```

---

## 🎨 Frontend Setup

### Install Dependencies

```bash
cd frontend
npm install
```

### Environment Configuration

Create `.env` file:

NEXT_PUBLIC_API_URL=

### Run Frontend

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:3000
```

---

## 📡 API Documentation
## 🔐 Authentication

#### Register

```
POST /api/users
```

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-03-29T10:11:36.436Z",
	"updated_at": "2026-03-29T10:11:36.436Z"
  }
}
```

---

#### Login

```
POST /api/users/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "User Login successfully",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-03-29T04:53:06.841Z",
	  "updated_at": "2026-03-29T05:25:19.453Z"
    }
  }
}
```

---

## ✅ Task Endpoints

### Get My Tasks

```
GET /api/tasks/my-tasks
```

Headers:

```
Authorization: Bearer <token>
```

---

### Create Task

```
POST /api/tasks
```

Request:

```json
{
  "title": "Learn Next.js",
  "description": "App Router",
  "completed": false
}
```

---

### Update Task

```
PUT /api/tasks/:id
```

Response:

```json
{
	"success": true,
	"message": "Task updated successfully",
	"data": {
		"id": 1,
		"title": "Build Feature 1",
		"description": "Make a responsive design",
		"completed": true,
		"user_id": 1,
		"created_at": "2026-03-29T05:33:47.717Z",
		"updated_at": "2026-03-29T05:37:11.368Z"
	}
}
```

---

### Delete Task

```
DELETE /api/tasks/:id
```

---

### Toggle Task Completion

```
PUT /api/tasks/:id
```

Request:

```json
{
  "completed": true
}
```

---

## 🔐 Authentication Flow

1. User logs in → receives JWT token
2. Token stored in:
   * Zustand (persist middleware)
   * localStorage
3. Axios interceptor attaches token to every request
4. Protected routes validate authentication before rendering

---

## ⚠️ Common Issues & Troubleshooting

### 500 Internal Server Error

* Check backend logs
* Validate database queries
* Ensure proper error handling middleware

### Slow API Response

* Verify PostgreSQL connection
* Check query performance
* Ensure no blocking operations

### Unauthorized (401)

* Token expired or missing
* Axios interceptor not attaching token

---

## ✨ Future Improvements

* Pagination & filtering for tasks
* Search functionality
* Refresh token implementation
* Role-based access control (RBAC)
* Realtime updates (WebSocket / Socket.io)
* API documentation with Swagger

---

## 👨‍💻 Author

Developed by **Muhammad Rivaldhi**

---

## ⭐ Notes

This project is built as a **Junior Backend Engineer Technical Test @ICN** demonstrating:

* Clean architecture (backend)
* Scalable state management (frontend)
* Authentication best practices
* RESTful API design

---
