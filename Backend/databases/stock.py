import csv
import sqlite3
import os

def load_stock_from_csv(csv_path: str, db_path: str):
    items = []

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            items.append({
                "name":       row["Name"].strip(),
                "category":   row["Category"].strip(),
                "level":      float(row["Level"].strip()),
                "unit":       row["Unit"].strip(),
                "reorder_at": float(row["Reorder At"].strip()),
                "used_in":    row["Used In"].strip(),
            })

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.executemany("""
        INSERT OR IGNORE INTO stock (name, category, level, unit, reorder_at, used_in)
        VALUES (:name, :category, :level, :unit, :reorder_at, :used_in)
    """, items)
    conn.commit()

    print(f"Inserted {len(items)} stock items into {db_path}")
    conn.close()
    return items

if __name__ == "__main__":
    BASE = os.path.dirname(__file__)
    load_stock_from_csv(
        csv_path=os.path.join(BASE, "stock.csv"),
        db_path=os.path.join(BASE, "oaxaca-real.db"),
    )