from restaurant import Restaurant, menuItem, Role, Customer, Table

r = Restaurant("Oaxaca", "London")

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

# # Create staff
# kitchen = r.create_staff("Alice", "pass", Role.KITCHEN_STAFF)
# waiter = r.create_staff("Bob", "pass", Role.WAITER)
# print("Staff:", r.staff)
# print("Menu initially:", r.menu.get_available_items())
#
# # updating prices as a waiter
# updated = waiter.update_menu_price(r, "Margherita Pizza", 9.99)
# print("Updated item:", updated)
# print("Menu after price update:", r.menu.get_available_items())
#
# # setting item availability as a waiter
# ok = waiter.set_item_availability(r, 1, False)   # item_id=1
# print("Set availability success:", ok)
# print("Menu available items now:", r.menu.get_available_items())
#
# # customer ordering a currently unavailable item should fail
# try:
#     r.place_order(table_number=12, items=[(1, 2)])
#     print("ERROR: order should not have been placed")
# except ValueError as e:
#     print("Expected order failure:", e)
#
# # changing availability back to True should allow ordering again
# waiter.set_item_availability(r, 1, True)
# print("Menu available items restored:", r.menu.get_available_items())
#
# # place a valid order
# order = r.place_order(table_number=12, items=[(1, 2)])
# print("Placed order:", order.order_id, "status:", order.status.value, "total:", order.total_price())

# created table
t1 = Table(1, 4)
print("Table:", t1)

# check state
assert t1.occupied is False
assert t1.current_customer is None
print("inital state is correct")

# assign a customer to a table
cust1 = Customer("John Doe", 1)
t1.assign_customer(cust1)
print("Table after assigning customer:", t1)

assert t1.occupied is True
assert t1.current_customer == cust1
print("Assign customer OK")

# trying to assign another customer to the same table should raise an error
try:
    cust2 = Customer("Jane Smith", 1)
    t1.assign_customer(cust2)
    print("ERROR: should not have been able to assign second customer to occupied table")
except ValueError as e:
    print("Expected error when assigning second customer to occupied table:", e)

t1.clear_table()

# check state after clearing
assert t1.occupied is False
assert t1.current_customer is None
print("clear table OK")


