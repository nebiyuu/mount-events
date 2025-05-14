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

### Installation

To install all dependencies, run:

```bash
npm install express pg dotenv jsonwebtoken bcryptjs cors joi node-cron nodemon knex
```
### Database Setup
- Migration files are located in ./migrations directory
- To create all the tables, run:
```bash
npx knex migrate:latest
```

- if you prefer raw SQL, all the queries used to create all the necessary tables are available in [query.sql] file.

