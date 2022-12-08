#!/usr/bin/python3
"""Image Module"""
from models.base import BaseModel, Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Image(BaseModel,Base):
        """Images class"""
        __tablename__ = "images"
        file_id= Column(String(128), nullable=False)
        image_url = Column(String(128), nullable=True)
        thumbnail_url= Column(String(128), nullable=True)
        house_id= Column(String(128), nullable=True)
        