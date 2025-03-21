run `npm install pg express nodeman jsonwebtoken bcryptjs dotenv`

###created table users and events
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


##users table
`CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    userpassword VARCHAR(255) NOT NULL
);`
