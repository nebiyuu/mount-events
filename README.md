created table users and events

CREATE TABLE Events (
    eventId VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
	eventDetails TEXT,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    eventStatus VARCHAR(50) NOT NULL
); and 
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    userpassword VARCHAR(255) NOT NULL
);
