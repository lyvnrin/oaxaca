from restaurant import Restaurant, menuItem, Role

r = Restaurant("Oaxaca", "London")

# seed menu - add category field to your items
r.menu.add_item(menuItem(1, "Guacamole", "Fresh avocado dip", 6.99, 300, [], True, True, category="starters"))
r.menu.add_item(menuItem(2, "Tacos al Pastor", "Pork tacos", 12.99, 600, ["gluten"], False, False, category="mains"))
r.menu.add_item(menuItem(3, "Veggie Burrito", "Bean burrito", 10.99, 550, ["gluten"], True, False, category="mains"))
r.menu.add_item(menuItem(4, "Churros", "Fried dough", 5.99, 400, ["gluten", "dairy"], True, False, category="desserts"))
r.menu.add_item(menuItem(5, "Horchata", "Rice drink", 3.99, 150, [], True, True, category="drinks"))

kitchen = r.create_staff("Alice", "pass", Role.KITCHEN_STAFF)
waiter = r.create_staff("Bob", "pass", Role.WAITER)

def apply_role_view(items, role):
    if role == "staff":
        return [{"name": i["name"], "allergens": i["allergens"], "available": i["available"]} for i in items]
    else:  # customer default
        return [{"name": i["name"], "description": i["description"], "price": i["price"],
                 "vegetarian": i["vegetarian"], "gluten_free": i["gluten_free"]} for i in items]

def get_filtered_menu(category=None, vegetarian=None, gluten_free=None, role="customer"):
    items = r.menu.get_available_items()

    if category:
        items = [i for i in items if i.category == category]
    if vegetarian is not None:
        items = [i for i in items if i.vegetarian]
    if gluten_free is not None:
        items = [i for i in items if i.gluten_free]

    serialised = [
        {
            "item_id": i.item_id,
            "name": i.name,
            "description": i.description,
            "price": i.price,
            "vegetarian": i.vegetarian,
            "gluten_free": i.gluten_free,
            "allergens": i.allergens,
            "available": i.available
        }
        for i in items
    ]


    return apply_role_view(serialised, role)