from restaurant import Restaurant, menuItem, Role

'''
Sets up a simple FastAPI-compatible backend for the frontend testing page. Included:
- Creates a restaurant instance for "Oaxaca" in London
- Seeds the restaurant menu with sample items - you can add more items here for testing
- Seeds sample staff members - you can add more staff using r.create_staff.
- Defines a helper function get_filtered_menu(...) that filters items by vegetarian or gluten-free
  - This collects data from the existing menuItem objects and returns dictionaries for the frontend

You can now:
    - Add more menu items to experiment with filtering
    - Add more staff if needed
    - Extend get_filtered_menu with other filters (price range, allergens, availability)
- Frontend HTML page (already created) pulls data from this function so you can test your own python features
'''

r = Restaurant("Oaxaca", "London")

# seed menu - change up the items
r.menu.add_item(menuItem(1, "Margherita Pizza", "Classic pizza...", 8.99, 800, ["gluten","dairy"], True, False))
r.menu.add_item(menuItem(1, "Margherita Pizza", "Classic pizza...", 8.99, 800, ["gluten","dairy"], True, False))
r.menu.add_item(menuItem(2, "Grilled Chicken Salad", "Fresh salad...", 11.50, 450, [], False, True))
r.menu.add_item(menuItem(2, "Grilled Chicken Salad", "Fresh salad...", 11.50, 450, [], False, True))

# seed staff - change up the staff
kitchen = r.create_staff("Alice", "pass", Role.KITCHEN_STAFF)
waiter = r.create_staff("Bob", "pass", Role.WAITER)

def get_filtered_menu(vegetarian=None, gluten_free=None):
    items = r.menu.get_available_items()

    if vegetarian is not None:
        items = [i for i in items if i.vegetarian]
    if gluten_free is not None:
        items = [i for i in items if i.gluten_free]
    return[
        {
            "item_id": i.item_id,
            "name": i.name,
            "description": i.description,
            "price": i.price,
            "vegetarian": i.vegetarian,
            "gluten_free": i.gluten_free,
            "available": i.available
        }

        for i in items
    ]