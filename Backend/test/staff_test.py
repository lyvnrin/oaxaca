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

    # menu test
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

    # cancellation tests

    def test_cancel_completed_order_raises_error(self):
        order = self.restaurant.place_order(table_number=2, items=[(1, 1)])
        self.kitchen.mark_in_progress(self.restaurant, order.order_id)
        self.kitchen.mark_ready(self.restaurant, order.order_id)
        self.waiter.mark_completed(self.restaurant, order.order_id)

        with self.assertRaises(ValueError):
            self.waiter.cancel_order(self.restaurant, order.order_id)

    # kitchen queue tests
    def test_pending_order_appears_in_kitchen_queue(self):
        order = self.restaurant.place_order(table_number=3, items=[(1, 2)])
        queue = self.kitchen.get_kitchen_queue(self.restaurant)
        order_ids = [item["order id: "] for item in queue]
        self.assertIn(order.order_id, order_ids)

    def test_completed_order_not_in_kitchen_queue(self):
        order = self.restaurant.place_order(table_number=3, items=[(1, 2)])
        self.kitchen.mark_in_progress(self.restaurant, order.order_id)
        self.kitchen.mark_ready(self.restaurant, order.order_id)
        self.waiter.mark_completed(self.restaurant, order.order_id)

        queue = self.kitchen.get_kitchen_queue(self.restaurant)
        order_ids = [item["order id: "] for item in queue]
        self.assertNotIn(order.order_id, order_ids)

    # order time stamps tests
    def test_get_order_time_info_returns_all_timestamps(self):
        order = self.restaurant.place_order(table_number=1, items=[(1, 2)])
        self.waiter.confirm_order(self.restaurant, order.order_id)
        self.kitchen.mark_ready(self.restaurant, order.order_id)
        self.waiter.mark_completed(self.restaurant, order.order_id)

        time_info = self.waiter.get_order_time_info(self.restaurant, order.order_id)
        self.assertIsNotNone(time_info["created_at"])
        self.assertIsNotNone(time_info["started_at"])
        self.assertIsNotNone(time_info["ready_at"])
        self.assertIsNotNone(time_info["completed_at"])

    def test_get_order_time_info_invalid_id_raises_error(self):
        with self.assertRaises(ValueError):
            self.waiter.get_order_time_info(self.restaurant, 999)

if __name__ == "__main__":
    unittest.main()
