import unittest
from restaurant import Restaurant, menuItem, Role, KitchenStaff, OrderStatus
class StaffTests(unittest.TestCase):
    def setUp(self):
        self.restaurant = Restaurant("Oaxaca", "London")

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

        self.kitchen = self.restaurant.create_staff("Alice", "pass", Role.KITCHEN_STAFF)
        self.waiter = self.restaurant.create_staff("Bob", "pass", Role.WAITER)

    def test_get_staff_by_role_kitchen(self):
        kitchen_staff = self.restaurant.get_staff_by_role(Role.KITCHEN_STAFF)
        self.assertEqual(len(kitchen_staff), 1)

    def test_get_staff_by_role_waiter(self):
        waiters  = self.restaurant.get_staff_by_role(Role.WAITER)
        self.assertEqual(len(waiters), 1)

    def test_kitchen_staff_role(self):
        self.assertEqual(self.kitchen.role, Role.KITCHEN_STAFF)

    def test_waiter_role(self):
        self.assertEqual(self.waiter.role, Role.WAITER)

# menu tests
    def test_waiter_can_update_menu_price(self):
        updated = self.waiter.update_menu_price(self.restaurant, "Margherita Pizza", 9.99)
        self.assertAlmostEqual(updated.price, 9.99, places=2)

    def test_waiter_can_set_item_unavailable(self):
        self.waiter.set_item_availability(self.restaurant, 1, False)
        available_ids = [item.item_id for item in self.restaurant.menu.get_available_items()]
        self.assertNotIn(1, available_ids)

    def test_order_with_unavailable_item_raises_error(self):
        self.waiter.set_item_availability(self.restaurant, 1, False)
        with self.assertRaises(ValueError):
            self.restaurant.place_order(table_number=1, items=[(1, 1)])

    def test_waiter_can_restore_item_availability(self):
        self.waiter.set_item_availability(self.restaurant, 1, False)
        self.waiter.set_item_availability(self.restaurant, 1, True)
        available_ids = [item.item_id for item in self.restaurant.menu.get_available_items()]
        self.assertIn(1, available_ids)
if __name__ == "__main__":
    unittest.main()
#
# # updating prices as a waiter
# updated = waiter.update_menu_price(r, "Margherita Pizza", 9.99)
# assert updated.price == 9.99, "Failed to update price"
#
# # setting item availability as a waiter
# ok = waiter.set_item_availability(r, 1, False)   # item_id=1
# assert ok is True, "Failed to set availability"
# assert all(i.item_id != 1 for i in r.menu.get_available_items()), \
#     "Item not available"
#
#
# # customer ordering a currently unavailable item should fail
# try:
#     r.place_order(table_number=12, items=[(1, 2)])
#     assert False, "ERROR: order should not have been placed"
# except ValueError as e:
#     pass
#
# # changing availability back to True should allow ordering again
# waiter.set_item_availability(r, 1, True)
# found = False
# for i in r.menu.get_available_items():
#     if i.item_id == 1:
#         found = True
#         break
#
# assert found, "Item not found"
#
# # place a valid order
# order = r.place_order(table_number=12, items=[(1, 2)])
# assert order.total_price() == 9.99 * 2, "Wrong total price"
# assert order.status == OrderStatus.PENDING, "Order is not pending"
#
# # create table
# t1 = Table(1, 4)
# print("Table:", t1)
#
# # check initial state
# assert t1.occupied is False
# assert t1.current_customer is None
# print("Initial state is correct")
#
# # assign a customer to a table
# cust1 = Customer("John Doe", 1)
# t1.assign_customer(cust1)
#
# # trying to assign another customer to the same table should raise an error
# try:
#     cust2 = Customer("Jane Smith", 1)
#     t1.assign_customer(cust2)
#     print("ERROR: should not have been able to assign second customer to occupied table")
# except ValueError as e:
#     print("Expected error when assigning second customer to occupied table:", e)
#
# t1.clear_table()
#
# # check state after clearing
# assert t1.occupied is False
# assert t1.current_customer is None
# print("Clear table OK")
#
# # placing an order
# order2 = r.place_order(table_number=13, items=[(1, 1)])
# assert order2.total_price() == 9.99 * 1, "Wrong total price for order2"
# assert order2.status == OrderStatus.PENDING, "Order2 is not pending"
#
# # tests payment processing
# customer = Customer("Tyler", 5)
# order = customer.place_order(r, [(1, 2)])
#
# payment = r.process_payment(order.order_id)
#
# assert payment.status == PaymentStatus.PAID
# assert order.payment.status == PaymentStatus.PAID
# assert order.is_paid() is True
#
#
# print("All tests passed!")
