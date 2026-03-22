import sqlite3
conn = sqlite3.connect('oaxaca.db')

conn.execute('DROP TABLE IF EXISTS order_item')
conn.execute('DROP TABLE IF EXISTS orders')
conn.execute('DROP TABLE IF EXISTS customers')
conn.execute('DROP TABLE IF EXISTS tables')
conn.execute('DROP TABLE IF EXISTS menu_items')
conn.execute('DROP TABLE IF EXISTS staff')

conn.execute('''CREATE TABLE tables (
    table_id INTEGER PRIMARY KEY,
    name TEXT,
    occupied INTEGER NOT NULL DEFAULT 0,
    assigned_waiter INTEGER REFERENCES staff(staff_id)
)''')

conn.execute('''CREATE TABLE customers (
    cust_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT,
    table_id   INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(table_id)
)''')

conn.execute('''CREATE TABLE menu_items (
    item_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name VARCHAR(100) NOT NULL,
    price     DECIMAL(10,2) NOT NULL,
    available INTEGER NOT NULL DEFAULT 1,
    cogs      REAL NOT NULL DEFAULT 0
)''')

conn.execute('''CREATE TABLE staff (
    staff_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name           VARCHAR(100) NOT NULL,
    password       VARCHAR(255) NOT NULL,
    role           VARCHAR(50) NOT NULL CHECK(role IN ('Waiter', 'Kitchen Staff', 'Manager')),
    on_shift       INTEGER NOT NULL DEFAULT 0,
    orders_handled INTEGER NOT NULL DEFAULT 0,
    total_sales    REAL NOT NULL DEFAULT 0
)''')

conn.execute('''CREATE TABLE orders (
    order_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    cust_id    INTEGER,
    table_id   INTEGER,
    total_cost DECIMAL(10,2),
    status     TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    waiter_id  INTEGER,
    FOREIGN KEY (cust_id) REFERENCES customers(cust_id),
    FOREIGN KEY (table_id) REFERENCES tables(table_id)
)''')

conn.execute('''CREATE TABLE order_item (
    order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id      INTEGER,
    item_id       INTEGER,
    quantity      INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
)''')

conn.execute('''CREATE TABLE stock (
    stock_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    category   TEXT NOT NULL,
    level      REAL NOT NULL DEFAULT 100,
    unit       TEXT NOT NULL,
    reorder_at REAL NOT NULL DEFAULT 30,
    used_in    TEXT NOT NULL
)''')

conn.execute('''CREATE TABLE alerts (
    alert_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    table_id   INTEGER NOT NULL,
    raised_by  INTEGER,
    message    TEXT NOT NULL,
    resolved   INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(table_id),
    FOREIGN KEY (raised_by) REFERENCES staff(staff_id)
)''')

conn.commit()
print('Done')
conn.close()
