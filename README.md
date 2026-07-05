# Makeup Backend

Express API for the Angular makeup frontend.

## Run locally

1. Install dependencies:
   npm install
2. Create environment file:
   copy .env.example .env
3. Start backend:
   npm run dev

Backend runs on http://localhost:5000 by default.

## Architecture

The backend is structured in layers:

- `src/config`: environment and DynamoDB setup
- `src/routes`: endpoint declarations
- `src/controllers`: HTTP request/response handling
- `src/services`: business logic
- `src/repositories`: DynamoDB data access
- `src/middleware`: reusable Express middleware
- `src/utils`: shared helpers and error utilities

Entry points:

- `server.js` (root) delegates to `src/server.js`
- `src/server.js` starts the app
- `src/app.js` builds Express app and registers middleware/routes

## Auth storage (DynamoDB + bcrypt)

Login and registration use AWS DynamoDB and bcrypt hashing.

Required env values:

- AWS_REGION
- DYNAMODB_USERS_TABLE
- BCRYPT_SALT_ROUNDS

Expected DynamoDB users table key schema:

- Partition key: mobile_number (String)

Stored user item shape:

- id (String)
- name (String)
- mobile_number (String)
- password_hash (String, bcrypt hash)
- dateRegistered (String, ISO date)

## API routes

All routes are available with and without /api prefix.

- POST /auth/login
- POST /auth/register
- GET /auth/me
- POST /auth/logout
- GET /services
- GET /services/:id
- GET /gallery/media
- GET /reviews
- POST /bookings
- GET /bookings/customer/:userId
- GET /bookings?userId=<id>
