from pymongo import MongoClient
import bcrypt
import uuid
import os

uri = os.environ.get("mongoURL")
client = MongoClient(uri)
myDB = client["TryDB"]
myCol = myDB["Sample"]


def checkPW(password, data):
    bytes = password.encode("utf-8")
    result = bcrypt.checkpw(bytes, data["password"])

    return result


def login(user, password):

    if "@" in user:
        typ = "email"
    else:
        typ = "user"

    data = myCol.find_one({typ: user})

    if not data:
        return "invalid", "not found"

    ret = checkPW(password, data)

    if not ret:
        return "invalid", "bad password"

    return "logged", data


def register(name, user, email, password):

    newPass = hashPW(password)

    data = {
        "_id": uuid.uuid4().hex,
        "name": name,
        "user": user,
        "email": email,
        "password": newPass
    }

    myCol.insert_one(data)


def hashPW(password):
    bytes = password.encode("utf-8")
    hash = bcrypt.hashpw(bytes, bcrypt.gensalt())
    return hash


def check_user(user):

    data = myCol.find_one({"user": user})

    if data:
        return False
    else:
        return True


def check_email(email):
    data = myCol.find_one({"email": email})

    if data:
        return False
    else:
        return True


def getUserDetails(username):
    return myCol.find({'user': username})


def editUser(field: dict, update: dict):
    myCol.update_one(field, update)


def pruneDB(field="all", value="all"):
    if field == "all":
        result = myCol.delete_many({})
    else:
        result = myCol.delete_many({field: value})

    print(f"Deleted {result.deleted_count} documents")


def account(user):
    pass
