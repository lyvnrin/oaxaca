from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import customers, orders, menu, staff, alerts, stock

app = FastAPI(title="Oaxaca API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(menu.router)
app.include_router(staff.router)
app.include_router(stock.router)
app.include_router(alerts.router)