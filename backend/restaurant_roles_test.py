from restaurant import Restaurant, menuItem, Role, KitchenStaff, OrderStatus



# create a restaurant
r = Restaurant("Oaxaca", "London") 

# add a menu item
r.menu.add_item(menuItem(
    item_id=1,
    name="Margherita Pizza",
    description="Pizza with tomato sauce and mozzarella cheese",
    price=8.99,
    calories="700",
    allergens=["dairy"],
    vegetarian=True,
    gluten_free=True
))

# Create staff
kitchen = r.create_staff("Alice", "pass", Role.KITCHEN_STAFF)
waiter = r.create_staff("Bob", "pass", Role.WAITER)

assert kitchen.role == Role.KITCHEN_STAFF
assert waiter.role == Role.WAITER

# Updating prices as a waiter
updated = waiter.update_menu_price(r, "Margherita Pizza", 9.99)
assert updated.price == 9.99, "Failed to update price"

# Change availability
waiter.set_item_availability(r, 1, False)

for i in r.menu.get_available_items():
    assert i.item_id != 1, "Item not available"

# Order with unavailable item
try:
    r.place_order(table_number=1, items=[(1, 1)])
    assert False, "Order not allowed, unavaiable item"
except ValueError:
    pass

# Make item available
waiter.set_item_availability(r, 1, True)

# Order with available item
order = r.place_order(table_number=1, items=[(1, 2)])
assert order.status == OrderStatus.PENDING

# Confirm order as waiter
waiter.confirm_order(r, order.order_id)
assert order.status == OrderStatus.IN_PROGRESS
assert order.started_at is not None

# Kitchen staff marks order as ready
kitchen.mark_ready(r, order.order_id)
assert order.status == OrderStatus.READY
assert order.ready_at is not None

# Waiter marks order as completed
waiter.mark_completed(r, order.order_id)
assert order.status == OrderStatus.COMPLETED
assert order.completed_at is not None

