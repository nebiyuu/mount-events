# Mount Events – Event Management System

A Node.js REST API for managing events, tickets, reservations, and discounts, built with Express and PostgreSQL.

## Features

- User registration and authentication (JWT)
- Organizer and attendee roles
- Event creation, update, deletion (organizer-only)
- Ticket type management (CRUD)
- Ticket reservation and purchase (with discount codes)
- Automatic expiration of unpaid reservations (via cron)
- Discount code management (admin/organizer)
- Data validation with Joi
- Database migrations with Knex

## Dependencies

- **express** – Web framework for building REST APIs  
- **pg** – PostgreSQL database driver  
- **dotenv** – Loads environment variables from `.env` file  
- **jsonwebtoken** – Handles JWT-based authentication  
- **bcryptjs** – Securely hashes passwords  
- **cors** – Enables Cross-Origin Resource Sharing  
- **joi** – Schema validation for request bodies  
- **node-cron** – Schedules tasks (e.g. ticket expiration checks)  
- **nodemon** – Auto-restarts the server on file changes (development)  
- **knex** – SQL query builder, used for migrations and seeders  

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory with your PostgreSQL and JWT settings:

```
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
```

## Database Setup

Migration files are located in the [`migrations`](migrations) directory.

To create all the tables, run:

```bash
npx knex migrate:latest
```

Alternatively, you can use the raw SQL in [`query.sql`](query.sql).

## Running the Server

Start the server in development mode:

```bash
npm start
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Authentication

- `POST /api/auth/register/organizer` – Register as organizer
- `POST /api/auth/register/attendee` – Register as attendee
- `POST /api/auth/login` – Login
- `DELETE /api/auth/delete-organizer/:userId` – Delete organizer by user ID
- `DELETE /api/auth/delete-attendee/:userId` – Delete attendee by user ID
- `PUT /api/auth/update-attendee/:userId` – Update attendee by user ID
- `PUT /api/auth/update-organizer/:userId` – Update attendee by user ID


### Events

- `POST /api/events/create-events` – Create event (organizer only)
- `GET /api/events/events` – List all events
- `PUT /api/events/update-events/:eventId` – Update event (organizer only)
- `DELETE /api/events/delete-events/:eventId` – Delete event (organizer only)
- `GET /api/events/get-events/:eventId` – Get event details

### Tickets

- `POST /api/ticket/createTicket` – Create ticket type
- `GET /api/ticket/getTicket/:id` – Get ticket type by ID
- `GET /api/ticket/:event_id/ticket-types` – List ticket types for event
- `PUT /api/ticket/updateTicket/:id` – Update ticket type
- `DELETE /api/ticket/deleteTicket/:id` – Delete ticket type
- `GET /api/ticket/:id/availability` – Check ticket availability
- `POST /api/ticket/purchase-ticket` – Purchase ticket
- `POST /api/ticket/reservation` – Reserve ticket

### Discounts

- `POST /api/admin/discount/create` – Create discount code

## Reservation Expiry

Unpaid reservations expire automatically (checked every hour by cron). Expired reservations release tickets back to availability.

## Validation

All input is validated using Joi schemas in the [`validations`](validations) directory.

## License

MIT

