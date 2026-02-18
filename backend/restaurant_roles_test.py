from restaurant import Restaurant, menuItem, Role, KitchenStaff, OrderStatus



# create a restaurant
r = Restaurant("Oaxaca", "London") 

# add a menu item
r.menu.add_item(menuItem(
    item_id=1,
    name="Margherita Pizza",
    price=8.99,
    gluten_free=True
))

# Create staff
kitchen = r.create_staff("Alice", "pass", Role.KITCHEN_STAFF)
waiter = r.create_staff("Bob", "pass", Role.WAITER)

assert kitchen.role == Role.KITCHEN_STAFF
assert waiter.role == Role.WAITER