import csv
import sqlite3
import os

# MENU ITEMS --------------------------
def load_menu_from_csv(csv_path: str, db_path: str):
    # READS OAXACA MENU CSV + INSERTS ALL ITEMS 
    items = []

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                price = float(row["Price (£)"].strip())
            except ValueError:
                price = 0.0

            try:
                cogs = float(row["COGS (£)"].strip())
            except ValueError:
                cogs = 0.0

            try:
                prep_time = int(row["Prep Time (mins)"].strip())
            except (ValueError, KeyError):
                prep_time = 15

            items.append({
                "item_id":   int(row["ID"].strip()),
                "item_name": row["Item Name"].strip(),
                "price":     price,
                "available": 1 if row["Available"].strip().lower() == "true" else 0,
                "cogs":      cogs,
                "prep_time_mins": prep_time,
            })

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.executemany("""
        INSERT OR REPLACE INTO menu_items (item_id, item_name, price, available, cogs, prep_time_mins)
        VALUES (:item_id, :item_name, :price, :available, :cogs, :prep_time_mins)
    """, items)
    conn.commit()

    print(f"Inserted {len(items)} menu items into {db_path}")
    conn.close()
    return items

if __name__ == "__main__":
    BASE = os.path.dirname(__file__)
    load_menu_from_csv(
        csv_path=os.path.join(BASE, "menu_items.csv"),
        db_path=os.path.join(BASE, "oaxaca.db"),
    )