from enum import Enum
from datetime import datetime


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

    def to_dict(self):  # converts the menu item to a dictionary
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

    def filter_items(self, vegetarian=None, gluten_free=None):
        filtered = self.get_available_items()
        if vegetarian is not None:
            filtered = [i for i in filtered if i.vegetarian == vegetarian]
        if gluten_free is not None:
            filtered = [i for i in filtered if i.gluten_free == gluten_free]
        return filtered

    def update_item(self, name: str, price: float):
        for item in self.items:
            if item.name == name:
                item.price = price
                return item
        return None


class OrderItem:
    def __init__(self, item, qty=1):
        self.item = item
        self.qty = qty

    def line_total(self):
        return self.item.price * self.qty


class Order:
    def __init__(self, order_id, table_number, items):
        self.order_id = order_id
        self.table_number = table_number
        self.items = items

        self.status = OrderStatus.PENDING  # initial status of the order is pending when created

        self.created_at = datetime.now()
        self.started_at = None
        self.ready_at = None
        self.completed_at = None
        self.cancelled_at = None

        self.confirmed_by_waiter_id = None
        self.kitchen_staff_id = None

    def age_seconds(self):  # used to track how long the order has been active for, used for tracking order progress
        return (datetime.now() - self.created_at).total_seconds()

    def total_price(
            self):  # calculates the total price of a order by summing each item in the order and multiplying by the quantity of that item
        return sum(item.line_total() for item in self.items)


class restaurant:
    def __init__(self, name: str, location: str):
        self.name = name
        self.location = location
        self.menu = menu()
        self.orders: list['Order'] = []  # TODO list to store orders need to implement order system
        self.staff: list['Staff'] = []  # list to store staff members

        # ADD STAFF MEMBERS

    def add_staff(self, staff_member: 'Staff'):
        self.staff.append(staff_member)  # adds a staff member to the restaurant's staff list

    def create_staff(self, username: str, password: str, role: Role) -> 'Staff':
        staff_member = Staff(
            username=username,
            password=password,
            staff_id=Staff._next_id,
            role=role
        )
        Staff._next_id += 1
        self.add_staff(staff_member)
        return staff_member

    def get_staff_by_role(self, role: Role):
        return [s for s in self.staff if s.role == role]  # returns a list of staff members with the specified role

    def __str__(self):
        return f"{self.name} - {self.location}"


class Staff:
    _next_id = 1

    def __init__(self, username: str, password: str, staff_id: int, role: Role):
        self.staff_id = staff_id
        self.username = username
        self.password = password
        self.role = role

    def __str__(self):
        return f"{self.username} - {self.role.value} - ID: {self.staff_id}"

    def __repr__(self):
        return self.__str__()
