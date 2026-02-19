# from flask import Blueprint, send_from_directory, jsonify
# import os

# main = Blueprint("main", __name__)

# @main.route("/")
# def index():
#     static_dir = os.path.join(os.path.dirname(__file__), "../static")
#     return send_from_directory(static_dir, "index.html")

# @main.route("/health")
# def health():
#     return jsonify({
#         "status": "ok",
#         "service": "restaurant-backend",
#     })