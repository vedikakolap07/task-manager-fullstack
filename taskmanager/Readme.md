# Task Manager — Full Stack App

A full-stack task management application with a React frontend and a Spring Boot REST API backend, supporting task creation, status tracking, and deletion, persisted to MySQL.

## Features

- Create, view, update, and delete tasks
- Filter tasks by status (All / To Do / In Progress / Done)
- Priority levels (Low, Medium, High) with color-coded badges
- Due date tracking with overdue indicators
- Progress bar showing task completion
- Responsive dark-themed UI

## Tech Stack

**Frontend:** React, Vite, lucide-react (icons)

**Backend:** Spring Boot, Spring Data JPA, MySQL

**Architecture:** Layered backend (Controller → Service → Repository), REST API

## Project Structure

```
.
├── taskmanager/        # Spring Boot backend
│   └── src/main/java/com/vedika/taskmanager/
│       ├── controller/  # REST endpoints
│       ├── service/     # Business logic
│       ├── repository/  # Data access (Spring Data JPA)
│       ├── model/       # Entity classes
│       └── config/      # CORS configuration
└── task-frontend/      # React frontend (Vite)
    └── src/
        ├── App.jsx
        └── App.css
```

## API Endpoints

| Method | Endpoint              | Description                  |
|--------|------------------------|-------------------------------|
| POST   | `/api/tasks`            | Create a new task             |
| GET    | `/api/tasks`             | Get all tasks                 |
| GET    | `/api/tasks?status=X`    | Get tasks filtered by status  |
| GET    | `/api/tasks/{id}`        | Get a single task             |
| PUT    | `/api/tasks/{id}`        | Update a task                 |
| DELETE | `/api/tasks/{id}`        | Delete a task                 |

## Running Locally

### Backend

1. Create a MySQL database:
   ```sql
   CREATE DATABASE taskmanager_db;
   ```
2. Update `src/main/resources/application.properties` with your MySQL credentials.
3. Run:
   ```bash
   ./mvnw spring-boot:run
   ```
   The API will be available at `http://localhost:8080`.

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd task-frontend
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Screenshots

_Add a screenshot or GIF of the app here._

## Author

Vedika Kolap