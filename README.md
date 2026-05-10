Team Task Manager
=================
Live URL: https://reliable-integrity-production-4268.up.railway.app
GitHub: https://github.com/anjalisashok/team-task-manager

TECH STACK
----------
Frontend: React + Vite
Backend: Django REST Framework
Database: PostgreSQL
Auth: JWT Tokens
Deployment: Railway

FEATURES
--------
- Signup/Login with JWT authentication
- Role-based access (Admin/Member)
- Create and manage projects with team members
- Create tasks with title, description, status, priority, due date
- Assign tasks to project members
- Update task status (todo / in-progress / done)
- Dashboard with task stats and overdue alerts

API ENDPOINTS
-------------
POST /api/auth/signup/     - Register
POST /api/auth/login/      - Login
GET  /api/auth/me/         - Current user
GET  /api/projects/        - List projects
POST /api/projects/        - Create project
GET  /api/projects/:id/    - Project detail
GET  /api/tasks/           - List tasks
POST /api/tasks/           - Create task
PUT  /api/tasks/:id/       - Update task
GET  /api/tasks/dashboard/ - Dashboard stats
