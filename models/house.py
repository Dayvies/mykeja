#!/usr/bin/python3
"""Owner/Agent Module"""
from models.base import BaseModel, Base
from sqlalchemy import Column, Integer, String, ForeignKey, Float, Numeric
from sqlalchemy.orm import relationship

class House(BaseModel,Base):
        """Owner class"""
        __tablename__ = "houses"
        owner_id = Column(String(60), ForeignKey("owners.id"), default="not_assigned",nullable=False)
        name = Column(String(128), nullable=False)
        description = Column(String(1024), nullable=True)
        number_rooms = Column(Integer, default=0, nullable=True)
        number_bathrooms = Column(Integer, default=0, nullable=True)
        price = Column(Integer, default = 0 , nullable=True)
        longitude = Column(Numeric(precision=10, scale = 7), nullable=True)
        latitude = Column(Numeric(precision=10, scale = 7), nullable=True)
        location = Column(String(128), nullable=True)