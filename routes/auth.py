from flask import render_template, request, session, url_for, redirect, jsonify, Blueprint
from datetime import datetime, timezone
import os
import middleware
import otp
import requests


authBluePrint = Blueprint('auth', __name__)


async def getUser():
    username = session['username']
    data = middleware.getUserDetails(username)
    for i in data:
        sendData = {
            'name': i['name'],
            'username': i['user'],
            'email': i['email']
        }
    return sendData


@authBluePrint.post("/theuser")
async def theuser():

    return jsonify(await getUser())


@authBluePrint.get("/userexist")
async def userexist():
    user = request.args.get("user")
    if middleware.check_user(user):
        return "usernotexists"
    else:
        return "userexists"


@authBluePrint.get("/emailexist")
async def emailexist():
    email = request.args.get("email")
    if middleware.check_email(email):
        return "emailnotexists"
    else:
        return "emailexists"


@authBluePrint.route("/logout")
def logout():

    if "username" in session:
        session.clear()

    return redirect("/?goto=home")


@authBluePrint.route("/status")
def status():

    return redirect("https://statuspage.freshping.io/66639-DOST")


# Get Process Send
# @authBluePrint.route('/process_data')
# def get_user():

#     user = request.args.get("data")
#     if not user:
#         return render_template('404.html'), 404

#     post = login.check_user(user)
#     data = {'post': post}
#     return jsonify(data)


@authBluePrint.route('/check-oldPass')
def checkOldPass():

    user = request.args.get("user")
    oldPass = request.args.get("oldPass")
    if not user:
        return render_template('404.html'), 404

    got, info = middleware.login(user, oldPass)
    dataS = {'passOk': got}
    return jsonify(dataS)


# To edit credentials
@authBluePrint.route('/edit-credentials', methods=["POST"])
def editCredentials():
    # user = request.args.get("user")
    data = request.get_json()
    check = data.get("check")
    checkValue = data.get("checkValue")
    field = data.get("field")
    value = data.get("value")

    if check:

        if field == "password":
            data = middleware.myCol.find_one({check: checkValue})
            if middleware.checkPW(value, data):
                pass
                return "passwordError"

            value = middleware.hashPW(value)

        if field == "user":
            session["username"] = value
        middleware.editUser({check: checkValue}, {"$set": {field: value}})

        return "Ok"

    return "Error"


# get the email address and send the otp
@authBluePrint.route("/send-otp", methods=["POST"])
def get_email():
    data = request.get_json()
    email = data.get("email")
    type = data.get("type")

    if email == "register":
        email = session["temp"]["email"]
        name = session["temp"]["fname"]
        sent_otp = otp.send_otp(email, name, "register")
    else:
        session["forgot"] = {"email": email}
        name = middleware.myCol.find_one({"email": email}).get("name")
        sent_otp = otp.send_otp(email, name, "forgot")

    session["otp"] = sent_otp

    if type == "resend":
        response_data = {"message": "OTP has been resent."}
    else:
        response_data = {
            "message":
            "A verification OTP has been sent to your registered email."
        }
    return jsonify(response_data)


@authBluePrint.route("/check-otp", methods=["POST"])
def check_otp():
    data = request.get_json()
    otp_code = int(data.get("otp"))
    stored_otp = int(session["otp"])
    type = data.get("type")

    if otp_code == stored_otp:
        response = {"message": "otpOk"}
        if type == "forgot":
            response["type"] = "forgot"
        elif type == "register":
            response["type"] = "register"
        return jsonify(response)

    else:
        return jsonify({"message": "otpNotOk"})


@authBluePrint.route("/change-password", methods=["POST"])
def change_password():

    email = session["forgot"]["email"]
    data = request.get_json()
    newPassword = data.get("password")
    data = middleware.myCol.find_one({"email": email})

    if middleware.checkPW(newPassword, data):
        return jsonify({
            "message": "New password cannot be same as old password",
            "type": "passwordError"
        })

    hashed = middleware.hashPW(newPassword)
    middleware.editUser({"email": email}, {"$set": {"password": hashed}})

    return jsonify({"message": "Password changed successfully.", "type": "Ok"})


@authBluePrint.route("/complete-registration")
def completeRegistration():
    name = session["temp"]["fname"]
    user = session["temp"]["uname"]
    email = session["temp"]["email"]
    pass1 = session["temp"]["password"]
    middleware.register(name, user, email, pass1)

    session.clear()
    return render_template("login.html")


@authBluePrint.route("/create-new-password")
def create_new_password():
    return render_template("create_new_password.html")


@authBluePrint.route("/changed-password")
def passwordChange():
    session.clear()
    return render_template("login.html")


@authBluePrint.route("/delete-account", methods=["POST"])
def deleteAccount():
    data = request.get_json()
    password = data.get('password')
    print(password)

    if "username" not in session:
        return jsonify({"Error": "Not Logged"})

    user = session["username"]
    oldPass = middleware.myCol.find_one({"user": user})

    if middleware.checkPW(password, oldPass):
        middleware.pruneDB('user', user)
        session.clear()
        return jsonify({"message": "account_deleted"})
    else:
        return jsonify({"message": "wrong_password"})

    return jsonify({"Error": "error"})


# Merged routes for login and login validate.
# @authBluePrint.route("/validate_login", methods=["POST"])
@authBluePrint.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.get_json()

        user = data.get("user")
        password = data.get("password")
        remember = bool(data.get("remember") == "yes")

        got, data = middleware.login(user, password)

        if got == "invalid":
            return jsonify({"type": "invalid"})

        elif got == "logged":

            if not remember:
                session["loginTime"] = datetime.now(timezone.utc)

            session["username"] = data["user"]
            return jsonify({"type": "logged"})
    else:
        if "username" in session:
            return redirect(url_for("account", login=True))

        return render_template("login.html")

# Merged routes for register and validate register
# @authBluePrint.route("/validate_register", methods=["POST"])


@authBluePrint.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        data = request.get_json()
        user = data.get("user")
        email = data.get("email")
        name = data.get("name")
        password = data.get("password")

        if not middleware.check_email(email):
            return jsonify({"type": "email_error"})

        if not middleware.check_user(user):
            return jsonify({"type": "user_error"})

        session["temp"] = {
            "fname": name,
            "uname": user,
            "email": email,
            "password": password
        }

        OTP = otp.send_otp(email, name, "register")
        session["otp"] = OTP

        return jsonify({"type": "success"})
    else:
        if "username" in session:
            return redirect(url_for("account", login=True))

        return render_template("register.html")
