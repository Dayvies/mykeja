#!/usr/bin/python3
"""Owner/Agent Module"""
from models.base import BaseModel, Base
from sqlalchemy import Column, Integer, String, ForeignKey, Float, Numeric
from sqlalchemy.orm import relationship

class Numbers(BaseModel,Base):
        """Owner class"""
        __tablename__ = "numbers"
       
      
        numeric = Column(Numeric(precision=10, scale = 7), nullable=True)
        latitude = Column(Float(10,7), nullable=True)
        location = Column(Float(10,6), nullable=True)