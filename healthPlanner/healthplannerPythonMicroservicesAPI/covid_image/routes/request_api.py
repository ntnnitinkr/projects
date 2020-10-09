"""The Endpoints to manage the Covid record and image recognition requests"""

from flask import json, jsonify, abort, request, Blueprint
from bson import json_util
import requests
from watson_developer_cloud import VisualRecognitionV3

REQUEST_API = Blueprint('request_api', __name__)

# read property file for attributes
#propertydict = {}
#with open("static/properties.txt") as pfile:
#    for line in pfile:
#        key, value = line.partition("=")[::2]
#        propertydict[key] = value.strip()
#properties = type("Names", (object,), propertydict)
#print("Covid URL:", properties.covidurl)

def get_blueprint():
    """Return the blueprint for the main app module"""
    return REQUEST_API

@REQUEST_API.route('/covid/get', methods=['GET'])
def covid_record():
    response = requests.get("https://corona.lmao.ninja/v2/countries?sort=cases")
    data = response.json()
    COVID_LIST = []
    for covid in data:
        COVID_LIST.append(covid)
    return jsonify(COVID_LIST)
    
@REQUEST_API.route('/image/result', methods=['POST'])
def xray_image():
    images_file = request.files['file']
    print(images_file)
    # Instantiate service instance
    # Replace {version}, {apikey}, and {url} below
    visual_recognition = VisualRecognitionV3(
        version='2018-03-19',
        iam_apikey='************************************'
    )
    classes = visual_recognition.classify(
        images_file,
        threshold='0.6',
        classifier_ids='PneumoniaX-Ray_993851638').get_result()
    class_result = classes['images'][0]['classifiers'][0]['classes'][0]['class']
    if class_result:
        return class_result
    else :
        return 'Did not get result'
