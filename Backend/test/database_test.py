import sqlite3


def create_connection(db_file="Backend/databases/oaxaca.db"):
    conn = sqlite3.connect(db_file)
    conn.execute("PRAGMA foreign_keys = ON")
    print(f"Connected to {db_file} successfully.")
    return conn

def main():
    conn = create_connection()
    cursor = conn.cursor()

    # Check if tables exist
    tables = ["tables", "customers", "orders", "menu_items", "staff"]
    for table in tables:
        cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table}'")
        result = cursor.fetchone()
        if result:
            print(f"Table '{table}' exists.")
            cursor.execute(f"SELECT * FROM {table}")
            rows = cursor.fetchall()
            for row in rows:
                print(row)
        else:
            print(f"Table '{table}' does NOT exist.")

if __name__ == "__main__":
    main()
