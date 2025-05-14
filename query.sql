
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
);

-- CREATE TABLE organizer (
--     organizer_id SERIAL PRIMARY KEY,
--     organizer_name VARCHAR(255) UNIQUE NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     image VARCHAR(255)
-- );

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    userpassword VARCHAR(255) NOT NULL
);

-- CREATE TABLE users ( --name modification in the design it was Attendee 
--     user_id SERIAL PRIMARY KEY, --same modification its attendee_id in the design
--     user_name VARCHAR(255) UNIQUE NOT NULL, --same modification its name in the design
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     image VARCHAR(255)
-- );


CREATE TABLE Events (
    eventId VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
	eventDetails TEXT,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    eventStatus VARCHAR(50) NOT NULL
);

-- CREATE TABLE Event (
--     event_id SERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     description TEXT,
--     date TIMESTAMP NOT NULL,
--     start_time TIMESTAMP NOT NULL,
--     end_time TIMESTAMP NOT NULL,
--     location VARCHAR(255),
--     capacity VARCHAR(255),
--     image VARCHAR(255) 
-- );

CREATE TABLE ticket_type (
    ticket_type_id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES Event(event_id),
    type VARCHAR(50),
    price DECIMAL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    quantity INTEGER,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE reservations (
  reservation_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  ticket_type_id INT NOT NULL,
  quantity INT NOT NULL,
  status VARCHAR(20) DEFAULT 'reserved', -- 'reserved', 'paid', 'expired'
  reserved_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiry_date TIMESTAMP,
  tx_ref VARCHAR(255), -- Optional: incase if we want to link to Chapa payment
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (event_id) REFERENCES event(event_id),
  FOREIGN KEY (ticket_type_id) REFERENCES ticket_type(ticket_type_id)
);

CREATE TABLE discount_codes (
    discount_id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(10) CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
    value NUMERIC NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    usage_limit INTEGER, 
    usage_count INTEGER DEFAULT 0,
    event_id INTEGER REFERENCES event(event_id) ON DELETE SET NULL,
    ticket_type_id INTEGER REFERENCES ticket_type(ticket_type_id) ON DELETE SET NULL
);

CREATE TABLE purchases (
  purchase_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  ticket_type_id INTEGER REFERENCES ticket_type(ticket_type_id),
  quantity INTEGER NOT NULL,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  discount_code VARCHAR,
  total_price NUMERIC(10, 2)
);

