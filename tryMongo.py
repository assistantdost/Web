from pymongo import MongoClient
import bcrypt
import uuid
import os

uri = os.environ.get("mongoURL")
client = MongoClient(uri)
# hello
myDB = client["TryDB"]
myCol = myDB["Sample"]

data = myCol.find()
# print(data)
for i in data:
	print(i)
# for i in data:
#     print(i)
# for i in data:
# 	print(i)
