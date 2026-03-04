from datetime import datetime

class Order:
    def __init__(self, order_id, customer_id, table_number, item_ids):
        self.order_id = order_id
        self.customer_id = customer_id
        self.table_number = table_number
        self.item_ids = item_ids
        
	# Status and timestamp used for logic of Kitchen Staff and Payment
        self.status = "pending"  # pending, cooking, ready, delivered, cancelled
        self.timestamp = datetime.now()

    def to_dict(self):
        return {
            "orderID": self.order_id,
            "customerID": self.customer_id,
            "tableNumber": self.table_number,
            "items": self.item_ids,
            "status": self.status,
            "timestamp": self.timestamp.isoformat()
        }

class OrderManager:
    def __init__(self):
        self.orders = []
        self.counter = 1

    def place_order(self, customer_id, table_number, item_ids):
        new_order = Order(self.counter, customer_id, table_number, item_ids)
        self.orders.append(new_order)
        self.counter += 1
        return new_order

    def get_all_orders(self):
        return self.orders

    def get_order_by_id(self, order_id: int):
        for order in self.orders:
            if order.order_id == order_id:
                return order
        return None

    def update_order_status(self, order_id: int, new_status: str):
        order = self.get_order_by_id(order_id)
        if order:
            order.status = new_status
            return order
        return None

# Create a single instance for the app to use
order_manager = OrderManager()