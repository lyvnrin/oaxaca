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

# Get staff by role
kitchen_staff = r.get_staff_by_role(Role.KITCHEN_STAFF)
assert len(kitchen_staff) == 1

waiters = r.get_staff_by_role(Role.WAITER)
assert len(waiters) == 1


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



# New order
order2 = r.place_order(table_number=2, items=[(1, 1)])
assert order2.status == OrderStatus.PENDING

# Kitchen staff marks it in progress 
kitchen.mark_in_progress(r, order2.order_id)
assert order2.status == OrderStatus.IN_PROGRESS

# Kitchen staff marks order as ready
kitchen.mark_ready(r, order2.order_id)

# Waiter marks order as completed
waiter.mark_completed(r, order2.order_id)

# Try cancelling a completed order
error = False
try:
    waiter.cancel_order(r, order2.order_id)
except ValueError:
    error = True

assert error, "Order cannot be canceled"



# New order
order3 = r.place_order(table_number=3, items=[(1, 2)])

# Get kitchen queue
queue = kitchen.get_kitchen_queue(r)

found = False
for i in queue:
    if i["order id: "] == order3.order_id:
        found = True
        break

assert found, "Order should be in the kitchen staff queue"

kitchen.mark_in_progress(r, order3.order_id)
kitchen.mark_ready(r, order3.order_id)
waiter.mark_completed(r, order3.order_id)

# Empty queue
completed_queue = kitchen.get_kitchen_queue(r)

found = False
for i in completed_queue:
    if i["order id: "] == order3.order_id:
        found = True
        break

assert not found, "The orders have been completed to queue is empty"

# Get order time info
time_info = waiter.get_order_time_info(r, order.order_id)
assert time_info["created_at"] is not None
assert time_info["started_at"] is not None
assert time_info["ready_at"] is not None
assert time_info["completed_at"] is not None

# Get order time info failing
error = False
try:
    waiter.get_order_time_info(r, 999)
except ValueError:
    error = True

assert error