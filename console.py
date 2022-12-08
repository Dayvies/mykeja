#!/usr/bin/python3
"""Command line interface for easier debugging"""
from models.__init__ import storage
from models.house import House
from models.owner import Owner
from models.number import Numbers
from models.image import Image
import shlex
import json
import cmd
import sys

classes = {'Owner': Owner, 'House': House, 'Numbers': Numbers, 'Image' :Image}


def convert(value):
    """using json.loads to change str into float or int"""
    try:
        return json.loads(value)
    except Exception:
        return value


class Console(cmd.Cmd):
    """console code"""
    prompt = '(keja) '

    file = None

    def do_create(self, args):
        """create an instance"""
        x = shlex.split(args)
        val = x.pop(0)
        if val not in classes.keys():
            print("Enter a valid Item [House, Owner]")
            return
        dict1 = {}
        for att in x:
            if "=" in att:
                ats = att.split("=")
                if len(ats) != 2:
                    continue
                ats[1] = convert(ats[1])
                dict1.update({ats[0]: ats[1]})
            else:
                print(f'{att} does not assign anything, Ignored')
        objClass = classes.get(val)
        newObj = objClass(**dict1)
        storage.new(newObj)
        print(newObj)
        try:
            storage.save()
        except Exception as e:
            print(e)
            storage.end()
            storage.reload()

    def do_all(self, args):
        """get specific or all stored items"""
        x = shlex.split(args)
        dict1 = {}
        if len(x) == 0:
            dict1 = storage.all()
        else:
            for item in x:
                if item not in classes.keys():
                    print(f"Item not valid type: {item}")
                else:
                    dict1.update(storage.all(classes.get(item)))
        for k, v in dict1.items():
            print(str(v))

    def do_update(self, args):
        """update or change values in """
        x = shlex.split(args)
        dict1 = {}
        if len(x) == 0:
            dict1 = storage.all()
        else:
            for item in x:
                if item not in classes.keys():
                    print(f"Item not valid type: {item}")
                else:
                    dict1.update(storage.all(classes.get(item)))
        val = input(
            "Enter type and search conditions\nUsage <search term1> <search term2> ...\n")
        arg = shlex.split(val)
        delKeys = []
        for k, v in dict1.items():
            str1 = str(v).lower() + k.replace('.', ' ').lower()
            for item in arg:
                if item.lower() not in str1:
                    delKeys.append(k)
        for item in delKeys:
            del dict1[item]
        if len(dict1.keys()) == 0:
                print("Item matching all options not found")
                return      
        list1 = []
        count = 0
        for k, v in dict1.items():
            print(f"{count}:\n {v}")
            list1.append(k)
            count += 1
        val = input("Select Number to edit\n")
        number = convert(val)
        if type(number) != int or len(list1) <= number:
            print("wrong input")
            return
        val = input(
            "Enter type and search conditions\nUsage <params=term1> <params=term2> ...\n")
        x = shlex.split(val)
        dict2 = {}
        for att in x:
            if "=" in att:
                ats = att.split("=")
                if len(ats) != 2:
                    continue
                ats[1] = convert(ats[1])
                dict2.update({ats[0]: ats[1]})
            else:
                print(f'{att} does not assign anything, Ignored')
        obj = dict1.get(list1[number])
        notlist = ['id', 'created_at', 'updated_at']
        for k, v in dict2.items():
            if k not in notlist:
                print(k,v)
                setattr(obj, k, v)
        print(obj)
        val = input("Do you want to save(y/n)?\n")
        if val.lower() == 'y':
                storage.save()
                print("saved")
        else: 
                print("not saved")
        return
    def do_EOF(self, args):
        """exits"""
        print("")
        return True


if __name__ == '__main__':
    Console().cmdloop()
