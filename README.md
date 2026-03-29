# Support Ticket Management System

Role-based support ticket system with Express, MySQL, Sequelize, JWT, and Next.js.

## Project Structure

- Backend: root folder
- Frontend: `frontend/`

## Backend Setup

1. Install dependencies:

```bash
npm install
```

2. Create database:

```sql
CREATE DATABASE support_ticket_db;
```

3. Create `.env` from `.env.example` and set values.

4. Seed initial users:

```bash
node seed.js
```

5. Run backend:

```bash
npm run dev
```

Backend URL: `http://localhost:3000`  
Swagger URL: `http://localhost:3000/docs`

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Run frontend:

```bash
npm run dev
```

Frontend URL: `http://localhost:3001`

## Test Users

| Name | Email | Password | Role |
|---|---|---|---|
| Deep | deep@manager.com | password123 | MANAGER |
| Arjunbala | arjunbala@manager.com | password123 | MANAGER |
| Jayesh | jayesh@support.com | password123 | SUPPORT |
| Preet | preet@user.com | password123 | USER |

## Role Permissions

- USER: create own tickets, view own tickets, comment on own tickets
- SUPPORT: view assigned tickets, update status, comment on assigned tickets
- MANAGER: full ticket access, assign tickets, manage users

## Ticket Status Flow

OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED
