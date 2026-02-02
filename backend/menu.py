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

    def get_items_available_items(self):
        return [item for item in self.items if item.available] # returns a list of available items

    def filter_items(self, vegetarian=False, gluten_free=None):
        filtered = self.get_items_available_items()

        if vegetarian is not None:
            filtered = [i for i in filtered if i.vegetarian == vegetarian] # filters by vegetarian
        if gluten_free is not None:
            filtered = [i for i in filtered if i.gluten_free == gluten_free] # filters by gluten-free

        return filtered


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
