#!/usr/bin/python
"""storage engine"""
from models.base import BaseModel, Base
from models.owner import Owner
from models.house import House
from models.image import Image
from models.number import Numbers
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

user = os.getenv("user")
host = os.getenv("host")
passw = os.getenv("passw")
db = os.getenv("db")

classes = {'Owner': Owner, 'House': House, 'Image': Image}


class dbstorage():
    """mysql storage"""
    __engine = None
    __session = None

    def __init__(self):
        """initialising engine"""
        self.__engine = create_engine(
            'mysql+mysqldb://{}:{}@{}/{}'.format(user, passw, host, db))

    def all(self, cls=None):
        """query objects"""
        dict1 = {}
        oblist = []
        if cls is None:
            for obj in self.__session.query(Numbers).all():
                oblist.append(obj)
            for obj in self.__session.query(Owner).all():
                oblist.append(obj)
            for obj in self.__session.query(House).all():
                oblist.append(obj)
            for obj in self.__session.query(Image).all():
                oblist.append(obj)
        else:
            for obj in self.__session.query(cls).all():
                oblist.append(obj)
        for obj in oblist:
            id = ("{}.{}".format(type(obj).__name__, obj.id))
            dict1.update({id: obj})
        return dict1

    def new(self, obj):
        """add the object to the current database session (self.__session)"""
        self.__session.add(obj)

    def save(self):
        """commit all changes of the current  session (self.__session)"""
        self.__session.commit()

    def delete(self, obj=None):
        """delete from the current database session obj if not None"""
        if obj is None:
            return
        self.__session.delete(obj)

    def reload(self):
        """reloading or initiating"""
        Base.metadata.create_all(self.__engine)
        Session = sessionmaker(bind=self.__engine, expire_on_commit=False)
        self.__session = scoped_session(Session)

    def end(self):
        """end session"""
        self.__session.remove()

    def get(self, cls, id):
        """get class and id"""
        if cls in classes.values():
            objs = self.__session.query(cls).all()
            for obj in objs:
                if obj.id == id:
                    return obj
            return None
        else:
            return None
