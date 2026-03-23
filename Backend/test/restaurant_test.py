import unittest
from app.models.restaurant import Customer, Table, Restaurant, menuItem, OrderItem, Payment, PaymentStatus, AlertType


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
        self.assertFalse(table.occupied)
        self.assertIsNone(table.current_customer)

    def test_assign_customer(self):
        table = Table(1, 4)
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


class CustomerTests(unittest.TestCase):
    def setUp(self):
        self.restaurant = Restaurant('Oaxaca', 'London')
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
        self.customer = Customer("Bob", 2)

    def test_place_order(self):
        order = self.customer.place_order(self.restaurant, [(1, 2)])

        self.assertEqual(order.table_number, self.customer.table_number)
        self.assertEqual(self.customer.current_order, order)
        self.assertAlmostEqual(order.total_price(), 17.98, places=2)

    def test_call_waiter(self):
        alert = self.customer.call_Waiter()

        self.assertEqual(alert["table"], 2)
        self.assertEqual(alert["type"], AlertType.HELP_NEEDED)

    def test_request_payment(self):
        order = self.customer.place_order(self.restaurant, [(1, 2)])
        payment_request = self.customer.request_payment()

        self.assertEqual(payment_request["table"], 2)
        self.assertEqual(payment_request["type"], AlertType.PAYMENT_REQUEST)
        self.assertEqual(payment_request["order_id"], order.order_id)

    class OrderTests(unittest.TestCase):
        def setUp(self):
            self.restaurant = Restaurant('Oaxaca', 'London')
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
            self.order = self.restaurant.place_order(4, [(1, 2), (1, 1)])

        def test_payment_initial_status(self):
            payment = Payment(self.order.order_id, self.order.total_price())

            self.assertEqual(payment.status, PaymentStatus.UNPAID)

        def test_process_payment(self):
            payment = Payment(self.order.order_id, self.order.total_price())
            payment.process()

            self.assertEqual(payment.status, PaymentStatus.PAID)

        def test_order_is_paid_after_payment(self):
            payment = Payment(self.order.order_id, self.order.total_price())
            payment.process()

            self.order.payment = payment

            self.assertTrue(self.order.is_paid())

    class PaymentTests(unittest.TestCase):
        def setUp(self):
            self.restaurant = Restaurant('Oaxaca', 'London')
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
            self.order = self.restaurant.place_order(4, [(1, 2), (1, 1)])

        def test_payment_initial_status(self):
            payment = Payment(self.order.order_id, self.order.total_price())

            self.assertEqual(payment.status, PaymentStatus.UNPAID)

        def test_process_payment(self):
            payment = Payment(self.order.order_id, self.order.total_price())
            payment.process()

            self.assertEqual(payment.status, PaymentStatus.PAID)

        def test_order_is_paid_after_payment(self):
            payment = Payment(self.order.order_id, self.order.total_price())
            payment.process()

            self.order.payment = payment

            self.assertTrue(self.order.is_paid())


if __name__ == "__main__":
    unittest.main()
