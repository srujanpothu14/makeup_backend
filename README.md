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
- DYNAMODB_SERVICES_TABLE
- DYNAMODB_OFFERS_TABLE
- DYNAMODB_BUSINESS_DETAILS_TABLE
- DYNAMODB_BOOKINGS_TABLE
- DYNAMODB_GALLERY_TABLE
- DYNAMODB_REVIEWS_TABLE
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

All routes are available with and without the `/api` prefix.

All endpoints except `GET /health`, `POST /auth/register`, and `POST /auth/login` require:

```http
Authorization: Bearer <token>
```

### Health

#### GET /health

Public. Returns service health.

Request body: none

### Auth

#### POST /auth/register

Registers a user and returns a JWT.

Request body:

```json
{
  "name": "Jane Doe",
  "mobileNumber": "9876543210",
  "password": "1234"
}
```

Accepted aliases:

- Name: `name`, `fullName`, `full_name`, `fullname`
- Mobile number: `mobileNumber`, `mobile_number`, `phone`
- Password: `password`, `pin`, `hashedPassword`, `hashedpassowrd`

Validation:

- `name` is required.
- Mobile number must be 10 digits.
- Password is required.
- If `pin` is provided, it must be 4 digits.

#### POST /auth/login

Logs in a user and returns a JWT.

Request body:

```json
{
  "mobileNumber": "9876543210",
  "password": "1234"
}
```

Accepted aliases:

- Mobile number: `mobileNumber`, `mobile_number`, `phone`
- Password: `password`, `pin`

#### GET /auth/me

Protected. Returns the current authenticated user.

Request body: none

#### POST /auth/logout

Protected. Returns a logout confirmation.

Request body: none

### Catalog

#### GET /services

Protected. Returns active services.

Request body: none

#### GET /services/:id

Protected. Returns one service by `service_id`.

Request body: none

#### POST /services

Protected. Creates a service.

Request body:

```json
{
  "title": "Bridal Makeup",
  "category": "Makeup",
  "durationMin": 120,
  "price": 8000,
  "description": "Complete bridal makeup package",
  "thumbnailUrl": "https://example.com/service.jpg",
  "artistId": "artist_1",
  "isActive": true
}
```

Required fields: `title`, `category`, `durationMin`, `price`

#### GET /offers

Protected. Returns offers.

Request body: none

#### GET /offers/:id

Protected. Returns one offer by `offer_id`.

Request body: none

#### GET /gallery

Protected. Returns gallery media from DynamoDB.

Request body: none

#### GET /reviews

Protected. Returns reviews from DynamoDB.

Request body: none

#### GET /feedbacks

Protected. Alias for `/reviews`.

Request body: none

#### GET /testimonials

Protected. Alias for `/reviews`.

Request body: none

### Bookings

#### POST /bookings

Protected. Creates a booking.

Request body:

```json
{
  "customerId": "user_id",
  "customerName": "Jane Doe",
  "customerPhone": "9876543210",
  "services": ["service_id_1", "service_id_2"],
  "bookingDate": "2026-07-15",
  "bookingTime": "14:30"
}
```

Notes:

- `customerId` falls back to the authenticated user id when omitted.
- New bookings are created with `status: "pending"`.

#### GET /bookings

Protected. Returns all bookings, or bookings for a user when `userId` is provided.

Query parameters:

- `userId` optional customer id filter

Request body: none

Example:

```http
GET /bookings?userId=user_id
```

#### GET /bookings/customer/:userId

Protected. Returns bookings for the path `userId`.

Request body: none

### Settings

#### GET /settings

Protected. Returns business details from DynamoDB.

Request body: none

#### GET /settings/:id

Protected. Returns business details by id. The backend checks common key names such as `id`, `business_id`, `details_id`, `businessId`, and `businessID`.

Request body: none

#### PUT /settings

Protected. Updates business details.

Request body:

```json
{
  "name": "Jane Doe",
  "business_name": "Jane Makeup Studio",
  "studio": "Jane Makeup Studio",
  "designation": "Makeup Artist",
  "location": "Hyderabad",
  "locationUrl": "https://maps.example.com",
  "phone": "9876543210",
  "contact_number": "9876543210",
  "instagram": "https://instagram.com/example",
  "instagram_url": "https://instagram.com/example",
  "whatsapp": "9876543210",
  "bio": "Professional makeup artist",
  "facebook": "https://facebook.com/example",
  "facebook_url": "https://facebook.com/example",
  "photo": "https://example.com/photo.jpg"
}
```

Required fields: `studio`

### Admin Users

#### GET /admin/users

Protected. Returns all users.

Request body: none

#### GET /admin/users/:mobileNumber

Protected. Returns a user by mobile number.

Request body: none

#### PUT /admin/users/:mobileNumber

Protected. Updates a user.

Request body:

```json
{
  "full_name": "Jane Doe",
  "password": "4321"
}
```

Accepted aliases:

- Full name: `full_name`, `name`

At least one updatable field is required.

#### DELETE /admin/users/:mobileNumber

Protected. Deletes a user by mobile number.

Request body: none

### Admin Settings

#### GET /admin/settings

Protected. Returns business details from DynamoDB.

Request body: none

#### PUT /admin/settings

Protected. Updates business details. Uses the same payload as `PUT /settings`.

### Admin Services

#### GET /admin/services

Protected. Returns all services, including inactive services.

Request body: none

#### GET /admin/services/:id

Protected. Returns one service by `service_id`.

Request body: none

#### POST /admin/services

Protected. Creates a service. Uses the same payload as `POST /services`.

#### PUT /admin/services/:id

Protected. Updates a service.

Request body:

```json
{
  "title": "Bridal Makeup",
  "category": "Makeup",
  "durationMin": 120,
  "price": 8000,
  "description": "Updated description",
  "thumbnailUrl": "https://example.com/service.jpg",
  "artistId": "artist_1",
  "isActive": true
}
```

At least one updatable field is required.

#### PATCH /admin/services/:id/visibility

Protected. Updates service visibility.

Request body:

```json
{
  "isActive": true
}
```

Required fields: `isActive`

#### DELETE /admin/services/:id

Protected. Deletes a service by `service_id`.

Request body: none

### Admin Offers

#### GET /admin/offers

Protected. Returns all offers.

Request body: none

#### GET /admin/offers/:id

Protected. Returns one offer by `offer_id`.

Request body: none

#### POST /admin/offers

Protected. Creates an offer.

Request body:

```json
{
  "offer_id": "offer_1",
  "title": "Bridal Discount",
  "description": "Discount on bridal makeup",
  "serviceId": "service_id",
  "discountPercent": 20
}
```

Required fields: `title`, `serviceId`, `discountPercent`

Notes:

- `offer_id` is optional. If omitted, the backend generates one.

#### PUT /admin/offers/:id

Protected. Updates an offer.

Request body:

```json
{
  "title": "Updated Offer",
  "description": "Updated offer details",
  "serviceId": "service_id",
  "discountPercent": 15
}
```

At least one updatable field is required.

#### DELETE /admin/offers/:id

Protected. Deletes an offer by `offer_id`.

Request body: none
