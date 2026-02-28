CREATE TABLE menu (
    item_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(60) NOT NULL,
    description VARCHAR (80) NOT NULL,
    price NUMERIC (12, 2) NOT NULL,
    calories INT NOT NULL,
    allergens VARCHAR (60) NOT NULL,
    vegetarian BOOLEAN NOT NULL,
    gluten_free BOOLEAN NOT NULL,
    available BOOLEAN NOT NULL
);