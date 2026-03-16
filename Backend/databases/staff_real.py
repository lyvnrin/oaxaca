import csv
import sqlite3
import os

# STAFF MEMBERS --------------------------
def load_staff_from_csv(csv_path: str, db_path: str):
    # READS OAXACA STAFF CSV + INSERTS ALL STAFF     
    items = []

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
         

            items.append({
                "Name":   row["Name"].strip(),
                "Password": row["Password"].strip(),
                "Role":     row["Role"].strip(),
            })

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.executemany("""
        INSERT OR REPLACE INTO staff (Name, Password, Role)
        VALUES (:Name, :Password, :Role)
    """, items)
    conn.commit()

    print(f"Inserted {len(items)} staff members into {db_path}")

    conn.close()
    return items

if __name__ == "__main__":
    BASE = os.path.dirname(__file__)
    load_staff_from_csv(
        csv_path=os.path.join(BASE, "staff.csv"),
        db_path=os.path.join(BASE, "oaxaca-real.db"),
    )