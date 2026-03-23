import os
from scripts.seed_menu import load_menu_from_csv
from scripts.seed_staff import load_staff_from_csv
from scripts.seed_stock import load_stock_from_csv
from scripts.seed_tables import load_tables_from_csv

SCRIPTS_DIR = os.path.dirname(__file__)           # Backend/scripts/
DATA_DIR    = os.path.join(SCRIPTS_DIR, "..", "data")  # Backend/data/
DB          = os.path.join(SCRIPTS_DIR, "..", "oaxaca.db")   # Backend/scripts/oaxaca.db

load_menu_from_csv(os.path.join(DATA_DIR, "menu_items.csv"), DB)
load_staff_from_csv(os.path.join(DATA_DIR, "staff.csv"),     DB)
load_stock_from_csv(os.path.join(DATA_DIR, "stock.csv"),     DB)
load_tables_from_csv(os.path.join(DATA_DIR, "tables.csv"),   DB)