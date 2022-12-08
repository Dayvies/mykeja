#!/usr/bin/python3
"""get , put , post or delete houses"""
from models import storage
from models.house import House
from server.api.v1 import app_v1
from flask import request, abort, jsonify


@app_v1.route('/houses', strict_slashes=False, methods=['POST', 'GET'])
@app_v1.route('/houses/<house_id>', strict_slashes=False, methods=['GET', 'DELETE', 'PUT'])
def house(house_id=None):
    """access houses """
    if request.method == 'GET':
        if house_id is None:
            dict1 = storage.all(House)
            list1 = []
            for k, v in dict1.items():
                list1.append(v.to_dict())
            return jsonify(list1)
