#!/usr/bin/python3
"""get , put , post or delete houses"""
import decimal
from models import storage
from models.owner import Owner
from models.house import House
from models.image import Image
from server.web.v1 import web_v1
import os
from flask import request, abort, jsonify, render_template, session

if os.getenv("gapi"):
        gapi = os.getenv("gapi")
else:
        gapi = None
@web_v1.route('/signup', strict_slashes=False, methods=['POST', 'GET'])
def signup():
    """access houses """
    if request.method == 'GET':

        print(request)
        return render_template('signup.html')
    if request.method == 'POST':
        response = {}
        regdata = request.json
        data = storage.all(Owner)
        regCheck = True
        for object in data.values():
            if regdata.get('email') in object.to_dict().values():
                regCheck = False
        if regCheck == True:
            new_owner = Owner(**regdata)
            print(new_owner)
            storage.new(new_owner)
            try:
                storage.save()
                response = {'status': 'OK', 'email': new_owner.email,
                            'message': 'successfully registered proceed to login'}
            except Exception as e:
                storage.end()
                storage.reload()
                response = {'status': 'fail', 'message': e}
        else:
            response = {'status': 'OK',
                        'message': 'email already registered, proceed to login'}
        return jsonify(response)


@web_v1.route('/login', strict_slashes=False, methods=['POST', 'GET'])
def login():
    """login route"""
    if request.method == 'GET':
        return render_template('login.html')
    if request.method == 'POST':
        logdata = request.json
        logcheck = False
        data = storage.all(Owner)
        object1 = None
        for object in data.values():
            if logdata.get('email') in object.to_dict().values():
                if logdata.get('password') == object.password:
                    logcheck = True
                    object1 = object
                    break
        if logcheck is False:
            response = {'status': 'fail',
                        'message': 'Email or password is wrong'}
            return jsonify(response)
        else:
            session["id"] = object.id
            session["name"] = object.name
            response = {'status': 'OK', 'message': 'Logged in'}
            return jsonify(response)


@web_v1.route('/home', strict_slashes=False, methods=['POST', 'GET'])
@web_v1.route('/home/<house_id>', strict_slashes=False, methods=['POST', 'GET'])
def home(house_id=None):
    """homepage"""
    if house_id == None:
        if request.method == 'GET':
            homes = storage.all(House).values()
            images = storage.all(Image).values()
            for home in homes:
                urls = []
                for image in images:
                    if image.house_id == home.id:
                        url = f"{image.image_url}?tr=w-1080,h-720"
                        urls.append(url)
                home.urls = urls
            return render_template('home.html', houses=homes)
    else :
        if request.method == 'GET':
                house = storage.get(House, house_id)
        if house is None:
            return ("no such house")
        urls = []
        images = storage.all(Image).values()
        for image in images:
                    if image.house_id == house.id:
                        url = f"{image.image_url}?tr=w-1080,h-720"
                        urls.append(url)
        house.urls = urls
        try:
            house.latitude = float(house.latitude)
            house.longitude = float(house.longitude)
        except Exception as e:
            pass
        return (render_template("fullhouse.html", house=house, gapi=gapi))



@web_v1.route('/reghouse', strict_slashes=False, methods=['POST', 'GET'])
def reghouse():
    """register house"""
    if 'id' not in session.keys():
        return render_template('login.html')
    if request.method == 'GET':
        name = session.get('name')
        return render_template('reghouse.html', name=name, gapi=gapi)
    if request.method == 'POST':
        new_hdata = request.json
        owner = storage.get(Owner, session.get('id'))
        for house in owner.houses:
            if house.name == new_hdata.get('name'):
                response = {
                    'status': 'OK', 'message': f"Sorry.You already have a house with name {house.name}. Go to edit or change name"}
                return jsonify(response)
        new_house = House(**new_hdata)
        new_house.owner_id = owner.id
        print(new_house)
        storage.new(new_house)
        try:
            storage.save()
            response = {'status': 'OK', 'house_id': new_house.id,
                        'message': 'successfully registered proceed to upload pics'}
        except Exception as e:
            storage.end()
            storage.reload()
            print(e)
            response = {'status': 'fail', 'message': "failed to save"}
        return jsonify(response)


@web_v1.route('/edit/<house_id>', strict_slashes=False, methods=['POST', 'GET'])
def edit(house_id=None):
    """update house details"""
    if house_id is None:
        return ('will deal with this later')
    if request.method == 'GET':
        house = storage.get(House, house_id)
        if house is None:
            return ("no such house")
        if house.owner_id != session["id"]:
            return ("Sorry You are not authorised to edit this house")
        urls = []
        images = storage.all(Image).values()
        try:
            house.latitude = float(house.latitude)
            house.longitude = float(house.longitude)
        except Exception as e:
            pass
        for image in images:
            if image.house_id == house.id:
                url = f"{image.thumbnail_url}"
                urls.append([url, image.id])
                house.urls = urls
        return render_template('edit_house.html', house=house, gapi=gapi)
    if request.method == 'POST':
        house = storage.get(House, house_id)
        if house is None:
            return ("no such house")
        if house.owner_id != session["id"]:
            return ("Sorry You are not authorised to edit this house")
        regdata = request.json
        for k, v in regdata.items():
            setattr(house, k, v)
        try:
            storage.save()
            print('saved')

            response = {'status': 'OK', 'house_id': house.id,
                        'message': 'successfully registered proceed to upload pics'}
            house = storage.get(House, house_id)
            print(house.to_dict())
        except Exception as e:
            storage.end()
            storage.reload()
            print(e)
            response = {'status': 'fail', 'message': "failed to save"}
        return jsonify(response)


@web_v1.route('/maps', strict_slashes=False, methods=['POST', 'GET'])
def maps():
    """testing maps"""
    if request.method == 'GET':
        return render_template('map.html', gapi=gapi)
