from restaurant import Customer, Table, Restaurant, Payment, Order, menuItem, AlertType, OrderItem, PaymentStatus

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
    item_id=2,
    name="Cucumber salad",
    description="Salad with cucumbers and seasonings",
    price=6.99,
    calories="200",
    allergens=[],
    vegetarian=True,
    gluten_free=True
))


# TABLE TTESTS

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

# clear the table, check that there is no longer a customer on it
table1.clear_table()
assert not table1.occupied
assert table1.current_customer is None


# create a customer and add them to a table
customer2 = Customer("Bob", table2.table_number)
table2.assign_customer(customer2)

# check its occupied
assert table2.occupied

# try add a customer to an occupied table
try:
    customer3 = Customer("Dave", table2.table_number)
    table2.assign_customer(customer3)

    assert False, "Table is occupied"

except ValueError:
    pass

# check table 2 is empty after clearing it
table2.clear_table()
assert not table2.occupied


# CUSTOMER TESTS

# have a customer place an order
order = customer2.place_order(r, [(1, 2)])

# check all the detailsof the order are correct
assert order.table_number == customer2.table_number
assert customer2.current_order == order
assert order.total_price() == 17.98

# call a waiter
alert = customer2.call_Waiter()
assert alert["table"] == 2
assert alert["type"] == AlertType.HELP_NEEDED

# request payment
payment_request = customer2.request_payment()
assert payment_request["table"] == 2
assert payment_request["type"] == AlertType.PAYMENT_REQUEST
assert payment_request["order_id"] == order.order_id


# ORDER TESTS

# order items total
item = r.menu.get_item_by_id(1)
order_item = OrderItem(item, 2)
assert order_item.line_total() == 17.98

order2 = r.place_order(4, [(1, 2), (1, 1)])
assert order2.total_price() == 26.97
assert not order2.is_paid()


# statuses
assert order2.started_at is None
assert order2.ready_at is None
assert order2.completed_at is None
assert order2.cancelled_at is None



# PAYMENT TESTS

# create a payment that has not been paid
payment = Payment(order2.order_id, order2.total_price())
assert payment.status == PaymentStatus.UNPAID

# process the payment
payment.process()
assert payment.status == PaymentStatus.PAID

# give an order a payment and check its paid
order2.payment = payment
assert order2.is_paid()