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
                 available: bool = True,
                 category: str = "mains"):
        self.item_id = item_id
        self.name = name
        self.description = description
        self.price = price
        self.calories = calories
        self.allergens = allergens
        self.vegetarian = vegetarian
        self.gluten_free = gluten_free
        self.available = available
        self.category = category

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
            "available": self.available,
            "category": self.category
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

    def get_item_by_id(self, item_id: int):  # returns a menu item based on its ID, if not found returns None
        for item in self.items:
            if item.item_id == item_id:
                return item
        return None

    def set_availability(self, item_id: int,
                         available: bool):  # sets the availability of a menu item based on its name, returns True if successful, False if item not found
        item = self.get_item_by_id(item_id)
        if item is None:
            return False
        item.available = available
        return True

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


class Restaurant:
    def __init__(self, name: str, location: str):
        self.name = name
        self.location = location
        self.menu = menu()
        self.orders: list['Order'] = []  # list to store orders need to implement order system
        self.staff: list['Staff'] = []  # list to store staff members
        self._next_order_id = 1  # assigns a unique ID to each order, starts at 1 and increments for each new order

    def place_order(self, table_number, items):
        order_items = []
        for item_id, qty in items:  # search the menu for item id and quantity. if id doesn't match or not available return error
            mi = self.menu.get_item_by_id(item_id)
            if mi is None:
                raise ValueError(f"Menu item with ID {item_id} not found.")
            if not mi.available:
                raise ValueError(f"Menu item '{mi.name}' is currently unavailable.")
            if qty <= 0:
                raise ValueError(f"Quantity for item '{mi.name}' must be greater than zero.")

            order_items.append(OrderItem(mi, qty))

        order = Order(
            order_id=self._next_order_id,
            table_number=table_number,
            items=order_items
        )
        self._next_order_id += 1
        self.orders.append(order)
        return order

    def get_order(self, order_id):  # returns an order based on its ID, if not found returns None
        for o in self.orders:
            if o.order_id == order_id:
                return o
        return None

        # ADD STAFF MEMBERS

    def add_staff(self, staff_member: 'Staff'):
        self.staff.append(staff_member)  # adds a staff member to the restaurant's staff list

    def create_staff(self, username, password, role):
        staff_id = Staff._next_id
        Staff._next_id += 1

        if role == Role.WAITER:
            staff_member = Waiter(username, password, staff_id)
        elif role == Role.KITCHEN_STAFF:
            staff_member = KitchenStaff(username, password, staff_id)
        else:
            staff_member = Staff(username, password, staff_id, role)

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


class Waiter(Staff):
    def __init__(self, username: str, password: str, staff_id: int):
        super().__init__(username, password, staff_id, Role.WAITER)

    def update_menu_price(self, r, name, new_price):  # waiter can update the price of a menu item
        return r.menu.update_item(name, new_price)

    def set_item_availability(self, r, item_id, available):  # waiter can set the availability of a menu item
        return r.menu.set_availability(item_id, available)

    def confirm_order(self, r, order_id):
        order = r.get_order(order_id)
        if order is None:
            raise ValueError(f"Order {order_id} was not found")

        if order.status != OrderStatus.PENDING:
            raise ValueError(f"Order {order_id} cannot be confirmed yet")

        order.status = OrderStatus.IN_PROGRESS
        order.started_at = datetime.now()

        return order  # implemented order confirmation

    def cancel_order(self, r, order_id):
        order = r.get_order(order_id)
        if order is None:
            raise ValueError(f"Order {order_id} was not found")

        if order.status in (OrderStatus.COMPLETED, OrderStatus.CANCELLED):
            raise ValueError(f"Order {order_id} cannot be cancelled")

        order.status = OrderStatus.CANCELLED
        order.cancelled_at = datetime.now()

        return order  # implemented order cancellation

    def mark_completed(self, r, order_id):
        order = r.get_order(order_id)
        if order is None:
            raise ValueError(f"Order {order_id} was not found")

        if order.status != OrderStatus.READY:
            raise ValueError(f"Order {order_id} cannot be completed yet")

        order.status = OrderStatus.COMPLETED
        order.completed_at = datetime.now()

        return order  # implemented marking order as completed

    def get_order_time_info(self, r, order_id):
        order = r.get_order(order_id)
        if order is None:
            raise ValueError(f"Order {order_id} was not found")

        time_info = {
            "Order was created at ": order.created_at
        }

        if order.started_at is not None:
            time_info["Order was started at "] = order.started_at

        if order.ready_at is not None:
            time_info["Order ready at "] = order.ready_at

        if order.completed_at is not None:
            time_info["Order completed at "] = order.completed_at

        if order.cancelled_at is not None:
            time_info["Order cancelled at "] = order.cancelled_at

        return time_info  # implemented retrieving order time info


class KitchenStaff(Staff):
    def __init__(self, username: str, password: str, staff_id: int):
        super().__init__(username, password, staff_id, Role.KITCHEN_STAFF)

    def mark_in_progress(self, r, order_id):
        order = r.get_order(order_id)
        if order is None:
            raise ValueError(f"Order {order_id} was not found")
        
        if order.status != OrderStatus.PENDING:
            raise ValueError(f"Order {order_id} cannot be accepted yet")
        
        order.status = OrderStatus.IN_PROGRESS
        order.started_at = datetime.now()
        
        return order # implemented marking order as in progress

    def mark_ready(self, r, order_id):
        order = r.get_order(order_id)
        if order is None:
            raise ValueError(f"Order {order_id} was not found")
        
        if order.status != OrderStatus.IN_PROGRESS:
            raise ValueError(f"Order {order_id} cannot be marked as ready yet")
        
        order.status = OrderStatus.READY
        order.ready_at = datetime.now()

        return order # implemented marking order as ready

    def get_kitchen_queue(self, r):
        order_queue = []

        for i in r.orders:
            if i.status == OrderStatus.PENDING or i.status == OrderStatus.IN_PROGRESS:
                
                waiting_time = datetime.now() - i.created_at

                order_info = {
                    "order id: " : i.order_id,
                    "order status: " : i.status,
                    "order created at: " : i.created_at,
                    "time waiting for order: " : waiting_time
                }

                order_queue.append(order_info)

        return order_queue # implemented retrieving kitchen queue


class Table:
    def __init__(self, table_number: int, capacity: int):
        self.table_number = table_number
        self.capacity = capacity
        self.occupied = False
        self.current_customer = None

    def assign_customer(self, customer):
        if self.occupied:
            raise ValueError(f"Table {self.table_number} is already occupied.")
        self.current_customer = customer  # assigns a customer to a table
        self.occupied = True  # sets table as occupied

    def clear_table(self):
        self.current_customer = None  # clears the current customer from the table
        self.occupied = False  # sets table as available

    def __str__(self):
        return f"Table {self.table_number} - Capacity: {self.capacity} - {'Occupied' if self.occupied else 'Available'}"

    def __repr__(self):
        return self.__str__()


class Customer:
    def __init__(self, name: str, table_number: int):
        self.name = name
        self.table_number = table_number
        self.current_order = None

    # customer can place orders and assigns it to a customer
    def place_order(self, r, items):
        order = r.place_order(self.table_number, items)
        self.current_order = order
        return order

    # customer calling the waiter for help changes the status
    def call_Waiter(self):
        return {
            "table": self.table_number,
            "type": AlertType.HELP_NEEDED
        }

    # customer can request payment which will trigger a payment request
    # will be used for payment implementation
    def request_payment(self):
        if self.current_order is None:
            raise ValueError("Customer has not placed an order yet.")
        return {
            "table": self.table_number,
            "type": AlertType.PAYMENT_REQUEST,
            "order_id": self.current_order.order_id
        }

    def __str__(self):
        return f"Customer {self.name} at Table {self.table_number}"

    def __repr__(self):
        return self.__str__()
