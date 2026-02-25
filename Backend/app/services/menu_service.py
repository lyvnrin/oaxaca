from restaurant import Restaurant, menuItem, Role

<<<<<<< HEAD
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
=======
r = Restaurant("Oaxaca", "London")

# seed menu
r.menu.add_item(menuItem(1, "Guacamole", "Fresh avocado dip", 6.99, 300, [], True, True, category="starters"))
r.menu.add_item(menuItem(2, "Tacos al Pastor", "Pork tacos", 12.99, 600, ["gluten"], False, False, category="mains"))
r.menu.add_item(menuItem(3, "Veggie Burrito", "Bean burrito", 10.99, 550, ["gluten"], True, False, category="mains"))
r.menu.add_item(menuItem(4, "Churros", "Fried dough", 5.99, 400, ["gluten", "dairy"], True, False, category="desserts"))
r.menu.add_item(menuItem(5, "Horchata", "Rice drink", 3.99, 150, [], True, True, category="drinks"))
r.menu.add_item(menuItem(6, "Chicken Wings", "Crispy wings", 8.99, 500, ["gluten"], False, False, available=True, category="starters"))

# role view serialiser
def apply_role_view(items, role):
    if role == "staff":
        return [{"name": i["name"], "allergens": i["allergies"], "available": i["available"]} for i in items]
    else:
        # customer sees full menu
        return items

def get_filtered_menu(category=None, vegetarian=None, gluten_free=None, role="customer"):
    items = r.menu.get_available_items()

    if category:
        items = [i for i in items if i.category == category]
    if vegetarian is not None:
        items = [i for i in items if i.vegetarian == vegetarian]
    if gluten_free is not None:
        items = [i for i in items if i.gluten_free == gluten_free]

    serialised = [
        {
            "id": i.item_id,                  
            "name": i.name,
            "description": i.description,
            "price": i.price,
            "category": i.category,
            "diet": ["Vegetarian"] if i.vegetarian else [],  
            "allergies": i.allergens,          
            "calories": i.calories,
            "available": i.available
        }
        for i in items
    ]

    # for debugging
    print("Filtered menu:", serialised)

    return apply_role_view(serialised, role)


# example debug calls
if __name__ == "__main__":
    print(get_filtered_menu())                  # full menu
    print(get_filtered_menu(category="mains"))  # mains only
    print(get_filtered_menu(vegetarian=True))   # vegetarian only
    print(get_filtered_menu(gluten_free=True))  # gluten free only
>>>>>>> main
