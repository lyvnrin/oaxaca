import unittest
from restaurant import Customer, Table, Restaurant, menuItem, OrderItem, Payment, PaymentStatus, AlertType


class RestaurantTests(unittest.TestCase):
    def setUp(self):
        # create a restaurant
        self.restaurant = Restaurant('Oaxaca', 'London')

        # add item to menu
        self.restaurant.menu.add_item(menuItem(
            item_id=1,
            name="Margherita Pizza",
            description="Pizza with tomato sauce and mozzarella cheese",
            price=8.99,
            calories="700",
            allergens=["dairy"],
            vegetarian=True,
            gluten_free=True
        ))
    def test_table_initial_state(self):
        table = Table(1, 4)
        # checks current table state
        self.assertFalse(table.occupied)
        self.assertIsNone(table.current_customer)

    def test_assign_customer(self):
        table = Table(1, 4)
        # create a customer and abb then to a table
        customer = Customer("Alice", 1)

        table.assign_customer(customer)
        self.assertTrue(table.occupied)
        self.assertEqual(table.current_customer, customer)

    def test_assign_customer_to_occupied_table(self):
        table = Table(1, 4)
        customer1 = Customer("Alice", 1)
        customer2 = Customer("Bob", 1)

        table.assign_customer(customer1)

        with self.assertRaises(ValueError):
            table.assign_customer(customer2)

    def test_clear_table(self):
        table = Table(1, 4)
        customer = Customer("Alice", 1)

        table.assign_customer(customer)
        table.clear_table()

        self.assertFalse(table.occupied)
        self.assertIsNone(table.current_customer)

if __name__ == "__main__":
        unittest.main()

#
# # have a customer place an order
# order = customer2.place_order(r, [(1, 2)])
#
# # check all the detailsof the order are correct
# assert order.table_number == customer2.table_number
# assert customer2.current_order == order
# assert order.total_price() == 17.98
#
# # call a waiter
# alert = customer2.call_Waiter()
# assert alert["table"] == 2
# assert alert["type"] == AlertType.HELP_NEEDED

# # request payment
# payment_request = customer2.request_payment()
# assert payment_request["table"] == 2
# assert payment_request["type"] == AlertType.PAYMENT_REQUEST
# assert payment_request["order_id"] == order.order_id
#
#
# # ORDER TESTS
#
# # order items total
# item = r.menu.get_item_by_id(1)
# order_item = OrderItem(item, 2)
# assert order_item.line_total() == 17.98
#
# order2 = r.place_order(4, [(1, 2), (1, 1)])
# assert order2.total_price() == 26.97
# assert not order2.is_paid()
#
#
# # statuses
# assert order2.started_at is None
# assert order2.ready_at is None
# assert order2.completed_at is None
# assert order2.cancelled_at is None
#
#
#
# # PAYMENT TESTS
#
# # create a payment that has not been paid
# payment = Payment(order2.order_id, order2.total_price())
# assert payment.status == PaymentStatus.UNPAID
#
# # process the payment
# payment.process()
# assert payment.status == PaymentStatus.PAID
#
# # give an order a payment and check its paid
# order2.payment = payment
# assert order2.is_paid()