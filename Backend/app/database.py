import sqlite3
import os

DB = os.path.join(os.path.dirname(__file__), "..", "oaxaca.db") 

def get_conn():
    conn = sqlite3.connect(DB, timeout=10)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode=WAL")
    conn.row_factory = sqlite3.Row
    return conn