#!/usr/bin/python3
"""Owner/Agent Module"""
from models.base import BaseModel, Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Owner(BaseModel,Base):
        """Owner class"""
        __tablename__ = "owners"
        name = Column(String(128), nullable=False)
        email = Column(String(128), nullable=True)
        contact = Column(String(128), nullable=True)
        company = Column(String(128), nullable=True)
        password = Column(String(128), nullable=True)
        houses = relationship('House', backref ="owner", cascade ="all, delete", passive_deletes=True)