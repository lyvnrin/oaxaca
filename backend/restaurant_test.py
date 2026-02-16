from restaurant import restaurant, menuItem, Role, KitchenStaff, OrderStatus
from datetime import datetime

r = restaurant("Oaxaca", "London")

# Seed menu
r.menu.add_item(menuItem(
    item_id=1,
    name="Margherita Pizza",
    description="Classic pizza with tomato sauce, mozzarella, and basil.",
    price=8.99,
    calories=800,
    allergens=["gluten", "dairy"],
    vegetarian=True,
    gluten_free=False
))

r.menu.add_item(menuItem(
    2,
    "Grilled Chicken Salad",
    "Fresh salad with grilled chicken",
    11.50,
    450,
    [],
    vegetarian=False,
    gluten_free=True
))

# Create staff
kitchen = r.create_staff("Alice", "pass", Role.KITCHEN_STAFF)
waiter = r.create_staff("Bob", "pass", Role.WAITER)
print("Staff:", r.staff)
print("Menu initially:", r.menu.get_available_items())

# updating prices as a waiter
updated = waiter.update_menu_price(r, "Margherita Pizza", 9.99)
assert updated.price == 9.99, "Failed to update price"

# setting item availability as a waiter
ok = waiter.set_item_availability(r, 1, False)   # item_id=1
assert ok is True , "Failed to set availability"
assert r.menu.get_available_items()[0].item_id != 1, "Item not available"

# customer ordering a currently unavailable item should fail
try:
    r.place_order(table_number=12, items=[(1, 2)])
    assert False, "ERROR: order should not have been placed"
except ValueError as e:
    pass

# changing availability back to True should allow ordering again
waiter.set_item_availability(r, 1, True)
found = False
for i in r.menu.get_available_items():
    if i.item_id == 1:
        found = True
        break
    
assert found, "Item not found"

# place a valid order
order = r.place_order(table_number=12, items=[(1, 2)])
assert order.total_price() == 9.99 * 2, "Wrong total price"
assert order.status == OrderStatus.PENDING, "Order is not pending"

# placing an order
order2 = r.place_order(table_number=13, items=[(1, 1)])

# mark in progress
kitchen.mark_in_progress(r, order2.order_id)
assert order2.status == OrderStatus.IN_PROGRESS, "Order not in progress"
assert order2.started_at is not None, "Order has not been started"