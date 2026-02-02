class menu:
    def __init__(self):
        self.items = []

    def add_item(self, name, price):
        self.items.append({'name': name, 'price': price})

    def remove_item(self, name):
        self.items = [item for item in self.items if item['name'] != name]

    def update_items(self, name, price):
        for item in self.items:
            if item['name'] == name:
                item['price'] = price
                break

    def get_items(self):
        return self.items

    def filter_items(self):
        return [item for item in self.items if
                item['price'] > 10]  # filters by price for now, need to filter by allergens


class menuItem:
    def __init__(self, item_id: int,
                 name: str,
                 description: str,
                 price: float,
                 calories: int,
                 allergens: list[str],
                 vegetarian: bool,
                 gluten_free: bool,
                 available: bool = True):

        self.item_id = item_id
        self.name = name
        self.description = description
        self.price = price
        self.calories = calories
        self.allergens = allergens
        self.vegetarian = vegetarian
        self.gluten_free = gluten_free
        self.available = available

    def to_dict(self):
        return {
            "id": self.item_id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "calories": self.calories,
            "allergens": self.allergens,
            "vegetarian": self.vegetarian,
            "glutenFree": self.gluten_free,
            "available": self.available
        }

    menu = menu()

    menu.add_item("Burger", 8)
    menu.add_item("Steak", 15)
    print(menu.get_items())
    print(menu.filter_items())
