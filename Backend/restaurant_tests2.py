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

# create tables
table1 = Table(1, 4)
table2 = Table(2, 6)

# check they are not occupied and there is no customer (which is the default value)
assert not table1.occupied
assert table1.current_customer is None

# create a customer and abb then to a table
customer1 = Customer("Alice", table1.table_number)
table1.assign_customer(customer1)

# check the table is now occupied by customer1
assert table1.occupied
assert table1.current_customer == customer1

