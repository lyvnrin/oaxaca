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