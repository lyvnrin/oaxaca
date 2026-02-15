from flask import Blueprint, request, jsonify
from ..orders import order_manager

order_bp = Blueprint('order_bp', __name__)

# Route to Place an Order
@order_bp.route('/api/orders', methods=['POST'])
def place_order():
    data = request.get_json()
    
    # Validates for specific fields
    if not data or 'table_number' not in data or 'items' not in data or 'customer_id' not in data:
        return jsonify({"error": "Missing customer_id, table_number or items"}), 400
    
    # Create the order
    new_order = order_manager.place_order(
        customer_id=data['customer_id'],
        table_number=data['table_number'],
        item_ids=data['items']
    )
    
    try:
        new_order = order_manager.place_order(
            customer_id=data['customer_id'],
            table_number=data['table_number'],
            item_ids=data['items']
        )
        return jsonify(new_order.to_dict()), 201
    except Exception as e:
    	return jsonify(new_order.to_dict()), 201