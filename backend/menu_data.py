from menu import menu, menuItem

menu = menu()

menu.add_item(menuItem(
    item_id=1,
    name="Margherita Pizza",
    description="Classic pizza with tomato sauce, mozzarella, and basil.",
    price=8.99,
    calories=800,
    allergens=["gluten", "dairy"],
    vegetarian=True,
    gluten_free=False
))

menu.add_item(menuItem(
    2,
    "Grilled Chicken Salad",
    "Fresh salad with grilled chicken",
    11.50,
    450,
    [],
    vegetarian=False,
    gluten_free=True
))

print(menu.get_available_items())
print(menu.filter_items(vegetarian=True))

