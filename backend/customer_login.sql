CREATE TABLE customer_login (
    customer_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    customer_firstname VARCHAR(60) NOT NULL,
    customer_lastname VARCHAR(60) NOT NULL,
    phone_number VARCHAR (20) NOT NULL,
    email_address VARCHAR (80) NOT NULL,
    staff_password_hash VARCHAR(80) NOT NULL,
    dietary_preferences VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL,
    marketing_opt_in BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);