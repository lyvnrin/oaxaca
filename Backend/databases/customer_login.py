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
        CREATE TABLE IF NOT EXISTS order_item (
            order_item   INTEGER PRIMARY KEY AUTOINCREMENT,
            FOREIGN KEY (order_id) REFERENCES order (order_id)
                ON DELETE SET NULL ON UPDATE NO ACTION,
            FOREIGN KEY (item_id) REFERENCES menu_items (item_id)
                ON DELETE SET NULL ON UPDATE NO ACTION,
            quantity INTEGER
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

def main():
    conn = create_connection()

    create_tables(conn)

    # SEED TESTER
    conn.execute("INSERT OR IGNORE INTO tables (table_id, capacity, occupied) VALUES (1, 4, 0)")
    conn.execute("INSERT OR IGNORE INTO tables (table_id, capacity, occupied) VALUES (2, 2, 1)")
    conn.commit()

    # INSERTING CUSTOMERS
    insert_customer(conn, table_id=1)
    insert_customer(conn, table_id=2)
    insert_customer(conn, table_id=None)  # customer not yet seated

    # Read
    get_all_customers(conn)
    get_customer_by_id(conn, 1)

    # Delete
    delete_customer(conn, 3)
    get_all_customers(conn)

    conn.close()

if __name__ == "__main__":
    main()
