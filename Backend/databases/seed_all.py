import os
from menu_items import load_menu_from_csv
from load_tables import load_tables_from_csv
from staff_real import load_staff_from_csv
from stock import load_stock_from_csv

BASE = os.path.dirname(__file__)
DB = os.path.join(BASE, "oaxaca.db")

load_menu_from_csv(os.path.join(BASE, "menu-items.csv"), DB)
load_tables_from_csv(os.path.join(BASE, "tables.csv"), DB)
load_staff_from_csv(os.path.join(BASE, "staff.csv"), DB)
load_stock_from_csv(os.path.join(BASE, "stock.csv"), DB)