#!/usr/bin/python
"""initialises storage engine"""
from models.engine.storage import dbstorage

storage = dbstorage()
storage.reload()
