
from enum import Enum

class OrderStatus(Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    READY = "Ready"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class Role(Enum):
    WAITER = "Waiter"
    KITCHEN_STAFF = "Kitchen_Staff"

class AlertType(Enum):
    HELP_NEEDED = "Help_Needed"
    ORDER_READY = "Order_Ready"
    PAYMENT_REQUEST = "Payment_Request"


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

    def to_dict(self): # converts the menu item to a dictionary
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

    def __str__(self):
        return (
            f"{self.name} | £{self.price:.2f} | "
            f"{self.calories} kcal | "
            f"{'Veg' if self.vegetarian else 'Non-veg'} | "
            f"{'Available' if self.available else 'Unavailable'}"
        )

    def __repr__(self):
        return self.__str__()


class menu:
    def __init__(self):
        self.items: list[menuItem] = []  # list to store menu items

    def add_item(self, item: menuItem):
        self.items.append(item)

    def remove_item(self, name: str):
        self.items = [item for item in self.items if item.name != name]

    def get_available_items(self):
        return [item for item in self.items if item.available]  # returns a list of available items

    def filter_items(self, vegetarian=False, gluten_free=None):
        filtered = self.get_available_items()

        if vegetarian is not None:
            filtered = [i for i in filtered if i.vegetarian == vegetarian]  # filters by vegetarian
        if gluten_free is not None:
            filtered = [i for i in filtered if i.gluten_free == gluten_free]  # filters by gluten-free

        return filtered

    def update_item(self, name: str, price: float):
        for item in self.items:
            if item.name == name:
                item.price = price
                return item
        return None


class Staff:
    _next_id = 1
    def __init__(self, name: str, role: Role ):
        self.staff_id = Staff.next_id
        Staff._next_id += 1

        self.name = name
        self.role = role


    def __str__(self):
        return f"{self.name} - {self.role.value} - ID: {self.staff_id}"

    def __repr__(self):
        return self.__str__()