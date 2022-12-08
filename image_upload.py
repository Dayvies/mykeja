#!/usr/bin/python3
import base64
from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions

imagekit = ImageKit(

    private_key='private_p6Y0CqbKdDeoYky/nnZKzSMCj50=',

    public_key='public_4vbj3t6ruv2p7z5SxBc0pyvC9Dg=',

    url_endpoint='https://ik.imagekit.io/oymhz21uh'

)
converted_string = ""
with open("logo.jpg", "rb") as image2string:
    converted_string = base64.b64encode(image2string.read())

options = UploadFileRequestOptions(
    use_unique_file_name=False,
    tags=['abc', 'def'],
    folder='/mykeja/',
    is_private_file=False,
    response_fields=['tags', 'is_private_file'],
    overwrite_file=True,
    overwrite_ai_tags=False,
    overwrite_tags=False,
    overwrite_custom_metadata=True
)

result = imagekit.upload_file(file=converted_string, # required
                              file_name='lr', # required
                              options=options)
print(result)
print(result.response_metadata.raw)