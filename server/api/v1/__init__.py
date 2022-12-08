#!/usr/bin/python3
"""Initialise api_routes"""


from flask import Blueprint

app_v1 = Blueprint('app_v1', __name__, url_prefix="/api/v1")
from server.api.v1.houses import *