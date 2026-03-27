# Support Ticket Management API

Backend API for a helpdesk system where employees can raise tickets, support staff handles them, and managers can track everything.

Built with Express.js, MySQL and JWT authentication.

## Project Description

This backend exam project implements a role-based Support Ticket Management System for organizations. The API allows users to create and track support requests, enables support staff to manage and resolve assigned issues, and gives managers complete visibility and control over the workflow.

The system is designed to demonstrate practical backend engineering skills, including secure authentication, authorization by role, structured REST API design, relational data modeling, pagination and filtering, ticket lifecycle management, and auditable status transitions. It also includes Swagger documentation for easy testing and evaluation.

## How to Run

1. Run `npm install`
2. Create the database in MySQL:
```sql
CREATE DATABASE support_ticket_db;
```
3. Update the `.env` file with your MySQL credentials if needed
4. Seed the database with initial users:
```
node seed.js
```
5. Start the server:
npm start

Server runs on http://localhost:3000
Swagger docs: http://localhost:3000/docs

## Endpoints

| Endpoint | Method | Who can access |
|---|---|---|
| /auth/login | POST | Anyone |
| /users | POST | MANAGER |
| /users | GET | MANAGER |
| /tickets | POST | USER, MANAGER |
| /tickets | GET | MANAGER (all), SUPPORT (assigned), USER (own) |
| /tickets/:id/assign | PATCH | MANAGER, SUPPORT |
| /tickets/:id/status | PATCH | MANAGER, SUPPORT |
| /tickets/:id | DELETE | MANAGER |
| /tickets/:id/comments | POST | MANAGER, SUPPORT (if assigned), USER (if owner) |
| /tickets/:id/comments | GET | MANAGER, SUPPORT (if assigned), USER (if owner) |
| /comments/:id | PATCH | MANAGER or comment author |
| /comments/:id | DELETE | MANAGER or comment author |

GET /tickets also supports query params: `page`, `limit`, `status`, `priority`

## Test Users

| Name | Email | Password | Role |
|---|---|---|---|
| Deep | deep@manager.com | password123 | MANAGER |
| Arjunbala | arjunbala@manager.com | password123 | MANAGER |
| Jayesh | jayesh@support.com | password123 | SUPPORT |
| Preet | preet@user.com | password123 | USER |

## Status Flow

OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED
You can only move one step forward. Skipping steps gives 400 error.
