CREATE TABLE staff_login (
    staff_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    staff_firstname VARCHAR(60) NOT NULL,
    staff_lastname VARCHAR(60) NOT NULL,
    staff_email_address VARCHAR (80) NOT NULL UNIQUE,
    staff_password_hash VARCHAR(60) NOT NULL,
    job_title VARCHAR(60) NOT NULL,
    hire_date DATE NOT NULL,
    shift VARCHAR(60) NOT NULL,
    permissions_level INT NOT NULL,
    last_login TIMESTAMP NULL
);