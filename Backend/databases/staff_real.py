import csv
import sqlite3
import os

# STAFF MEMBERS --------------------------
def load_staff_from_csv(csv_path: str, db_path: str):
    # READS OAXACA STAFF CSV + INSERTS ALL STAFF     
    staff = []

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            staff.append({
                "name":     row["Username"].strip(),
                "password": row["Password"].strip(),
                "role":     row["Role"].strip(),
            })

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.executemany("""
        INSERT INTO staff (name, password, role)
        VALUES (:name, :password, :role)
    """, staff)
    conn.commit()

    print(f"Inserted {len(staff)} staff members into {db_path}")

    conn.close()
    return staff

if __name__ == "__main__":
    BASE = os.path.dirname(__file__)
    load_staff_from_csv(
        csv_path=os.path.join(BASE, "staff.csv"),
        db_path=os.path.join(BASE, "oaxaca-real.db"),
    )