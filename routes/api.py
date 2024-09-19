from flask import request, jsonify, Blueprint
from cryptography.fernet import Fernet
import os
import middleware
import json
import base64


apiBluePrint = Blueprint('api', __name__)

APP_KEY = os.environ.get("APP_KEY")
WEATHER_KEY = os.environ.get("WEATHER_KEY")
PICO_KEY = os.environ.get("PICO_KEY")
GEMINI_KEY = os.environ.get("GEMINI_KEY")


cipher_suite = Fernet(APP_KEY)

with open("static/assets/data/app_data.json") as file:
    appData = json.load(file)


with open("static/assets/data/master.json") as file:
    masterData = json.load(file)


masterData["keys"]["weather_key"] = WEATHER_KEY
masterData["keys"]["pico_key"] = PICO_KEY
masterData["keys"]["gemini_key"] = GEMINI_KEY


async def encryptData(data):
    data = json.dumps(data)
    encrypted_data = cipher_suite.encrypt(data.encode())
    encrypted_data_base64 = base64.b64encode(encrypted_data).decode('utf-8')
    return encrypted_data_base64


async def decryptData(data):
    encrypted_data = base64.b64decode(data)
    decrypted_data = cipher_suite.decrypt(encrypted_data)
    decrypted_data_json = json.loads(decrypted_data.decode('utf-8'))
    return decrypted_data_json


@apiBluePrint.route("/api/login", methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'status': 'invalid', 'data': 'missing data'}), 400
        username = data["username"]
        password = data["password"]
        if not username or not password:
            return jsonify({'status': 'invalid', 'data': 'missing data'}), 400
        print(username, password)
        status, data = middleware.login(username, password)
        print(status, data)
        if status == "logged":
            data = {'username': data['user'],
                    'name': data['name'], 'email': data['email']}

        res = {'status': status, 'data': data}
        return jsonify(res)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@apiBluePrint.route("/api/app_data", methods=['POST'])
async def app_data():
    try:
        return jsonify({'status': 'success', 'data': await encryptData(appData)}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@apiBluePrint.route("/api/master_data", methods=['POST'])
async def master_data():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'status': 'invalid', 'data': 'missing data'}), 400
        if not data['get']:
            return jsonify({'status': 'invalid', 'data': 'missing data'}), 400
        if data['get'] == 'keys':
            # print(masterData['keys'])
            return jsonify({'status': 'success', 'data': await encryptData(masterData['keys'])}), 200
        elif data['get'] == "theme":
            # print(masterData['theme'])
            return jsonify({'status': 'success', 'data': await encryptData(masterData['theme'])}), 200
        elif data['get'] == "settings":
            # print(masterData['settings'])
            return jsonify({'status': 'success', 'data': await encryptData(masterData['settings'])}), 200
        elif data['get'] == "all":
            # print(masterData)
            return jsonify({'status': 'success', 'data': await encryptData(masterData)}), 200
        else:
            return jsonify({'status': 'invalid', 'data': 'invalid data'}), 400

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
