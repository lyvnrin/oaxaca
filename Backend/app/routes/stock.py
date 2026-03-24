from fastapi import APIRouter
from pydantic import BaseModel
from ..database import get_conn

router = APIRouter(tags=["stock"])


class RestockIn(BaseModel):
    stock_id: int
    level: float


class OrderIn(BaseModel):
    cust_id: int
    table_id: int
    items: list[dict]


DISH_DEPLETIONS = {
    1:  [(1, 3), (2, 3), (3, 3)],
    2:  [(29, 3), (30, 3), (22, 3), (24, 3)],
    3:  [(18, 4), (5, 4), (10, 4), (11, 4)],
    4:  [(4, 3), (23, 3)],
    5:  [(20, 4), (35, 4), (32, 4)],
    6:  [(19, 4), (8, 4), (11, 4)],
    7:  [(7, 3), (30, 3), (36, 3), (38, 3)],
    8:  [(18, 5), (14, 5), (15, 5), (16, 5)],
    9:  [(26, 3), (27, 3), (37, 3)],
    10: [(26, 3), (46, 3)],
    11: [(6, 3), (2, 3)],
    12: [(30, 2), (34, 2)],
    13: [(29, 2)],
    14: [(3, 2), (43, 2)],
    15: [(31, 2), (44, 2), (11, 2), (14, 2)],
    16: [(12, 3), (2, 3), (52, 3)],
    17: [(47, 3), (48, 3), (2, 3), (49, 3)],
    18: [(31, 3), (39, 3), (45, 3)],
    19: [(50, 5)],
    20: [(51, 1)],
}


@router.get("/stock")
def get_stock():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM stock ORDER BY stock_id").fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.post("/stock/restock")
def restock(payload: RestockIn):
    conn = get_conn()
    conn.execute(
        "UPDATE stock SET level = ? WHERE stock_id = ?",
        (payload.level, payload.stock_id)
    )
    conn.commit()
    conn.close()
    return {"message": "Restocked"}


@router.post("/stock/deplete")
def deplete_stock(payload: OrderIn):
    conn = get_conn()
    for item in payload.items:
        for stock_id, pct in DISH_DEPLETIONS.get(item["item_id"], []):
            conn.execute(
                "UPDATE stock SET level = MAX(0, level - ?) WHERE stock_id = ?",
                (pct * item["quantity"], stock_id)
            )
    conn.commit()
    conn.close()
    return {"message": "Stock depleted"}


@router.post("/stock/replenish")
def replenish_stock(payload: OrderIn):
    conn = get_conn()
    for item in payload.items:
        for stock_id, pct in DISH_DEPLETIONS.get(item["item_id"], []):
            conn.execute(
                "UPDATE stock SET level = MIN(100, level + ?) WHERE stock_id = ?",
                (pct * item["quantity"], stock_id)
            )
    conn.commit()
    conn.close()
    return {"message": "Stock replenished"}
