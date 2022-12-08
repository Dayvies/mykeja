#!/usr/bin/python3
from flask import Flask, jsonify
from models import storage
from server.api.v1 import app_v1
from server.web.v1 import web_v1
from flask_session import Session
from os import getenv

app = Flask(__name__)
app.register_blueprint(app_v1)
app.register_blueprint(web_v1)
app.config["SESSION_PERMANENT"] = False
#app.config['SESSION_COOKIE_SAMESITE'] = "None"
#app.config['SESSION_COOKIE_SECURE'] = 'True'
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

host = "0.0.0.0"
port = 5000


if __name__ == '__main__':
    app.run(host=host, port=port, threaded=True)
