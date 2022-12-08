#!/usr/bin/python3
"""get , put , post or delete houses"""
from ast import Eq
import base64
from os import getenv
from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions
from models import storage
from models.image import Image
from server.web.v1 import web_v1
from flask import request, abort, jsonify, render_template, session
import os

priv_key = os.getenv("privkey")
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
imagekit = ImageKit(

    private_key = priv_key,

    public_key='public_4vbj3t6ruv2p7z5SxBc0pyvC9Dg=',

    url_endpoint='https://ik.imagekit.io/oymhz21uh'

)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@web_v1.route('/upload', strict_slashes=False, methods=['POST', 'GET'])
def upload():
    """access houses """
    # check if the post request has the file part
    if request.method == 'POST':

        try:
            files = request.files.getlist('files[]')
        except Exception as e:
            print(e)
            files = []
        
        try:
            house_id = request.form.get('house')
        except Exception as e:
            print(e)
            house_id = "notag"

        try:
            delids = request.form.get('deleteids')
            delids = delids.split(',')
        except Exception as e:
            print(e)
            delids = []
        print(delids)
        
        errors = {}
        success = False
        error_files = []
        for id in delids:
                obj = storage.get(Image,id);
                if obj is None :
                        error_files.append(f"Image del failed: {id}")
                else:
                       file_id = obj.file_id
                       result = imagekit.delete_file(file_id=file_id)
                       storage.delete(obj)
                       storage.save()
                       data = result.response_metadata.raw
                       print(data)
        for file in files:

            print(file.filename)
            str1 = file.read()
            str2 = base64.b64encode(str1)
            options = UploadFileRequestOptions(
                use_unique_file_name=False,
                tags=[house_id],
                folder='/mykeja/',
                is_private_file=False,
                response_fields=['tags', 'is_private_file'],
                overwrite_file=True,
                overwrite_ai_tags=False,
                overwrite_tags=False,
                overwrite_custom_metadata=True
            )
            try:
                result = imagekit.upload_file(file=str2,  # required
                                              file_name=file.filename,  # required
                                              options=options)
                data = result.response_metadata.raw
                print(data)
                if house_id != 'notag' and data.get('fileType') == 'image':
                    dict1 = {'file_id': data.get('fileId'), 'image_url': data.get(
                        'url'), 'thumbnail_url': data.get('thumbnailUrl'), 'house_id': house_id}
                    new_image = Image(**dict1)
                    print(new_image)

                    storage.new(new_image)
                    try:
                        storage.save()
                    except Exception as e:
                        storage.end()
                        storage.reload()
                        result = imagekit.delete_file(
                            file_id=data.get('fileId'))
                        error_files.append(file.filename)
            except Exception as e:
                error_files.append(file.filename)
        if len(error_files) > 0:
            return jsonify({'status': 'OK', 'message': f'could not upload these {len(error_files)} files {error_files}'})
        return jsonify({'status': 'OK', 'message': 'upload successful'})
    elif request.method == 'GET':
        return render_template('upload.html')
