#!/usr/bin/python3
"""Initialise api_routes"""


from flask import Blueprint

web_v1 = Blueprint('web_v1', __name__, url_prefix="/web/v1",
                   template_folder='templates', static_folder='static', static_url_path='assets')

from server.web.v1.process import *
from server.web.v1.uploads import *