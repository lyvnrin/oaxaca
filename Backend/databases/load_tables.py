import csv
import sqlite3
import os

def load_tables_from_csv(csv_path: str, db_path: str):
    tables = []
    
    # column mapping: CSV -> DB
    column_map = {"ID": "table_id", "Name": "name", "Occupied": "occupied"}

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row.get("ID"):
                continue
            tables.append({
                "table_id": int(row.get("ID", 0)),
                "name":     row.get("Name", "Unknown").strip(),
                "occupied": int(row.get("Occupied", 0)),
            })

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.executemany("""
        INSERT OR REPLACE INTO tables (table_id, name, occupied)
        VALUES (:table_id, :name, :occupied)
    """, tables)
    conn.commit()
    conn.close()
    print(f"Inserted {len(tables)} tables into {db_path}")
    return tables

if __name__ == "__main__":
    BASE = os.path.dirname(__file__)
    load_tables_from_csv(
        csv_path=os.path.abspath(os.path.join(BASE, "tables.csv")),
        db_path=os.path.abspath(os.path.join(BASE, "oaxaca-real.db")),
    )