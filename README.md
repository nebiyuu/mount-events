run `npm install pg express nodeman jsonwebtoken bcryptjs dotenv`

## created table users and events
##events table
`CREATE TABLE Events (
    eventId VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
	eventDetails TEXT,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    eventStatus VARCHAR(50) NOT NULL
);`
and 


## users table
`CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    userpassword VARCHAR(255) NOT NULL
);`


## Organizers table
`
CREATE TABLE Organizers (
    organizer_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    company_phone_number VARCHAR(20) NOT NULL,
    company_logo VARCHAR(255),
    company_name VARCHAR(100) NOT NULL,
    tin_number VARCHAR(30),
    bank_name VARCHAR(50) NOT NULL,
    bank_account_number VARCHAR(30) NOT NULL,
    business_license_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`
