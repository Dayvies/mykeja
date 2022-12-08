#!/usr/bin/python3
"""Contains the basemodel that all other classes will inheri from"""
from datetime import datetime
import uuid
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()


class BaseModel:
    """BaseModel class"""
    id = Column(String(60), primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    def __init__(self, *args, **kwargs):
        """initialises new model"""
        if kwargs:
            for k, v in kwargs.items():
                if k == 'updated_at' or k == 'created_at':
                    v = datetime.strptime(v,
                                          '%Y-%m-%dT%H:%M:%S.%f')
                if k != '__class__':
                        setattr(self, k, v)
            if 'id' not in kwargs.keys():
                self.id = str(uuid.uuid4())
            if 'created_at' not in kwargs.keys():
                self.created_at = datetime.utcnow()
            if 'updated_at' not in kwargs.keys():
                self.updated_at = datetime.utcnow()
        else:
                self.id = str(uuid.uuid4())
                self.created_at = datetime.utcnow()
                self.updated_at = self.created_at
    def __str__(self):
        """string representation"""
        clsname = type(self).__name__
        dict2 = dict(self.__dict__)
        if '_sa_instance_state' in dict2:
            del dict2['_sa_instance_state']
        return '[{}] ({}) {}'.format(clsname, self.id, dict2)
    def to_dict(self):
        """returns dict representation"""
        dictionary = {}
        dictionary.update(self.__dict__)
        dictionary.update({'__class__': type(self).__name__})
        dictionary['created_at'] = self.created_at.isoformat()
        dictionary['updated_at'] = self.updated_at.isoformat()
        if '_sa_instance_state' in dictionary:
            del dictionary['_sa_instance_state']
        return dictionary   
   