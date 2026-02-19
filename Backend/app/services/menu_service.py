from restaurant import Restaurant, menuItem, Role

r = Restaurant("Oaxaca", "London")

# Seed menu
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

    # Debug print
    print("Filtered menu:", serialised)

    return apply_role_view(serialised, role)


# Example debug calls
if __name__ == "__main__":
    print(get_filtered_menu())                  # full menu
    print(get_filtered_menu(category="mains"))  # mains only
    print(get_filtered_menu(vegetarian=True))   # vegetarian only
    print(get_filtered_menu(gluten_free=True))  # gluten free only
