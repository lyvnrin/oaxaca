from restaurant import Customer, Table, Restaurant, Payment, Order, menuItem

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
r.menu.add_item(menuItem(
    item_id=1,
    name="Cucumber salad",
    description="Salad with cucumbers and seasonings",
    price=6.99,
    calories="200",
    allergens=[],
    vegetarian=True,
    gluten_free=True
))

table1 = Table(1, 4)
table2 = Table(2, 6)

