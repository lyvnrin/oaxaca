import sqlite3

def create_connection(db_file="oaxaca.db"):
    conn = sqlite3.connect(db_file)
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def create_tables(conn):
    cursor = conn.cursor()

    # CREATING TABLES
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tables (
            table_id  INTEGER PRIMARY KEY,
            capacity  INTEGER NOT NULL,
            occupied  INTEGER NOT NULL DEFAULT 0
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS customers (
            cust_id   INTEGER PRIMARY KEY AUTOINCREMENT,
            table_id  INTEGER,
            FOREIGN KEY (table_id) REFERENCES tables (table_id)
                ON DELETE SET NULL ON UPDATE NO ACTION
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            order_id   INTEGER PRIMARY KEY AUTOINCREMENT,
            cust_id    INTEGER,
            table_id   INTEGER,
            total_cost DECIMAL(10,2),
            FOREIGN KEY (cust_id) REFERENCES customers (cust_id)
                ON DELETE SET NULL ON UPDATE NO ACTION,
            FOREIGN KEY (table_id) REFERENCES tables (table_id)
                ON DELETE SET NULL ON UPDATE NO ACTION
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS menu_items
        (
            item_id   INTEGER PRIMARY KEY AUTOINCREMENT,
            item_name VARCHAR(100)   NOT NULL,
            price     DECIMAL(10, 2) NOT NULL
        )
    """)


    cursor.execute("""
        CREATE TABLE IF NOT EXISTS staff (
            staff_id  INTEGER PRIMARY KEY AUTOINCREMENT,
            name      VARCHAR(100) NOT NULL,
            password  VARCHAR(255) NOT NULL,
            role      VARCHAR(50) NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS order_item (
            order_item_id  INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id       INTEGER,
            item_id        INTEGER,
            quantity       INTEGER NOT NULL DEFAULT 1,
            FOREIGN KEY (order_id) REFERENCES orders (order_id)
                ON DELETE SET NULL ON UPDATE NO ACTION,
            FOREIGN KEY (item_id) REFERENCES menu_items (item_id)
                ON DELETE SET NULL ON UPDATE NO ACTION
        )
    """)

    conn.commit()
    print("Tables created successfully.")

def insert_customer(conn, table_id=None):
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO customers (table_id) VALUES (?)
    """, (table_id,))
    conn.commit()
    print(f"Customer added with ID: {cursor.lastrowid}, Table: {table_id}")
    return cursor.lastrowid

def get_all_customers(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM customers")
    rows = cursor.fetchall()
    print("\n--- Customers ---")
    for row in rows:
        print(f"  cust_id={row[0]}, table_id={row[1]}")
    return rows

def get_customer_by_id(conn, cust_id):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM customers WHERE cust_id = ?", (cust_id,))
    row = cursor.fetchone()
    if row:
        print(f"Found: cust_id={row[0]}, table_id={row[1]}")
    else:
        print(f"No customer found with ID {cust_id}")
    return row

def delete_customer(conn, cust_id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM customers WHERE cust_id = ?", (cust_id,))
    conn.commit()
    print(f"Customer {cust_id} deleted.")

def seed_data(conn):
    cursor = conn.cursor()

    # TABLES
    tables = [
        (1, 4, 0),
        (2, 2, 1),
        (3, 6, 1),
        (4, 4, 0),
        (5, 2, 0),
    ]
    cursor.executemany(
        "INSERT OR IGNORE INTO tables (table_id, capacity, occupied) VALUES (?, ?, ?)",
        tables
    )

    # CUSTOMERS
    customers = [
        (1,),   # seated at table 1
        (2,),   # seated at table 2
        (3,),   # seated at table 3
        (None,),# not yet seated
    ]
    cursor.executemany(
        "INSERT OR IGNORE INTO customers (table_id) VALUES (?)",
        customers
    )

    # MENU ITEMS
    menu_items = [
        ("Tortilla Chips & Salsa",   4.50),
        ("Guacamole",                5.00),
        ("Chicken Tacos",           12.00),
        ("Beef Burrito",            13.50),
        ("Vegetable Enchiladas",    11.00),
        ("Churros",                  5.50),
        ("Horchata",                 3.50),
        ("Margarita",                8.00),
    ]
    cursor.executemany(
        "INSERT OR IGNORE INTO menu_items (item_name, price) VALUES (?, ?)",
        menu_items
    )

    # STAFF
    staff = [
        ("Alice",   "hash_password_1", "waiter"),
        ("Bob",     "hash_password_2", "waiter"),
        ("Carlos",  "hash_password_3", "kitchen"),
        ("Diana",   "hash_password_4", "manager"),
    ]
    cursor.executemany(
        "INSERT OR IGNORE INTO staff (name, password, role) VALUES (?, ?, ?)",
        staff
    )

    # ORDERS
    orders = [
        (1, 1, 25.50),  # cust 1, table 1
        (2, 2, 13.50),  # cust 2, table 2
        (3, 3, 36.00),  # cust 3, table 3
    ]
    cursor.executemany(
        "INSERT OR IGNORE INTO orders (cust_id, table_id, total_cost) VALUES (?, ?, ?)",
        orders
    )

    # ORDER ITEMS  (order_id, item_id, quantity)
    order_items = [
        (1, 1, 2),  # order 1: 2x Tortilla Chips
        (1, 3, 2),  # order 1: 2x Chicken Tacos
        (1, 8, 1),  # order 1: 1x Margarita
        (2, 4, 1),  # order 2: 1x Beef Burrito
        (2, 7, 1),  # order 2: 1x Horchata
        (3, 2, 1),  # order 3: 1x Guacamole
        (3, 5, 2),  # order 3: 2x Vegetable Enchiladas
        (3, 6, 2),  # order 3: 2x Churros
        (3, 8, 2),  # order 3: 2x Margarita
    ]
    cursor.executemany(
        "INSERT OR IGNORE INTO order_item (order_id, item_id, quantity) VALUES (?, ?, ?)",
        order_items
    )

    conn.commit()
    print("Test data seeded successfully.")


def main():
    conn = create_connection()

    create_tables(conn)
    seed_data(conn)

    # Read back to verify
    get_all_customers(conn)
    get_customer_by_id(conn, 1)


    conn.close()

if __name__ == "__main__":
    main()
