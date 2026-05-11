# TaskFlow Team Manager

TaskFlow Team Manager is a full-stack project management web application built using FastAPI, SQLite, HTML, CSS, and JavaScript.  
The application allows users to register, login securely using JWT authentication, manage projects, create tasks, and monitor work progress through a dashboard.

---

# Live Deployment

## Backend API
https://taskflow-team-manager-production-b89e.up.railway.app

## Frontend
https://taskflow-team-manager-production-60f2.up.railway.app/login.html

---

# Features

- User Registration & Login
- JWT Authentication
- Role-Based Access Control (Admin / Member)
- Protected API Routes
- Project Management
- Task Management
- Dashboard Statistics
- Responsive Frontend UI
- REST API using FastAPI
- Railway Cloud Deployment

---

# Role-Based Access Control (RBAC)

## Admin
- Can create projects
- Can create tasks
- Can view dashboard statistics

## Member
- Can login and view data
- Cannot create projects
- Cannot create tasks

Unauthorized actions return:
403 Forbidden

---

# Tech Stack

## Backend
- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication
- Uvicorn

## Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap 5

## Deployment
- Railway

---

# Project Structure

Taskflow_Team_Manager/
│
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── Procfile
│
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── projects.html
│   ├── tasks.html
│   ├── team.html
│   ├── package.json
│   │
│   ├── css/
│   │   └── styles.css
│   │
│   └── js/
│       ├── api.js
│       ├── auth.js
│       ├── dashboard.js
│       ├── projects.js
│       ├── tasks.js
│       └── team.js

---

# API Endpoints

## Authentication
- POST /register
- POST /login

## Projects
- GET /projects
- POST /projects

## Tasks
- GET /tasks
- POST /tasks

## Dashboard
- GET /dashboard

---

# Local Setup

## Clone Repository

git clone <your-repository-url>

cd Taskflow_Team_Manager

---

# Backend Setup

cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload

Backend runs on:
http://127.0.0.1:8000

Swagger Docs:
http://127.0.0.1:8000/docs

---

# Frontend Setup

Open frontend using Live Server in VS Code:

frontend/login.html

---

# Authentication Flow

1. User registers an account
2. User logs in
3. Backend generates JWT token
4. Token stored in browser localStorage
5. Protected APIs accessed using Bearer Token

---

# Future Improvements

- Team Invitation System
- Task Assignment
- Email Notifications
- File Uploads
- PostgreSQL Integration
- Docker Deployment

---

# Author

Ridham Taneja

Built as a full-stack FastAPI project with Railway deployment.