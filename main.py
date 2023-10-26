from flask import Flask, render_template, request, session, url_for, redirect, jsonify
import login
from datetime import datetime, timedelta, timezone
import os
import json
import otp

app = Flask(__name__, template_folder='templates', static_folder='static')
flaskKEY = os.environ.get("flaskKEY")
app.config["SECRET_KEY"] = flaskKEY
app.config["SESSION_TYPE"] = "filesystem"


@app.context_processor
def utility_processor():

	with open("data.json") as file:
		appData = json.load(file)["app_data"]

	version = appData["version"]

	if "loginTime" in session:
		loginTime = session["loginTime"]
		now = datetime.now(timezone.utc)
		if now - loginTime > timedelta(hours=12):
			session.clear()

	logged = "notLogged"

	if "username" in session:
		logged = "logged"

	ret = {"logged": logged, "version": version}

	return ret


@app.route("/", methods=["GET", "POST"])
def home():

	return render_template("index.html")


@app.route("/commands")
def cmds():

	return render_template("commands.html")


# @app.route("/try")
# def _try():
#     return render_template("try.html")


@app.route("/privacy-policy")
def privacy():
	return render_template("privacy policy.html")


@app.route("/terms-and-condition")
def terms():
	return render_template("terms and condition.html")


@app.route("/changelog")
def changelog():
	# return render_template("terms and condition.html")
	return "Hello"


@app.route("/about")
def about():
	return render_template("about.html")


@app.route("/download")
def download():
	return render_template("download.html")


@app.route("/forgot_password")
def forgot_password():
	return render_template("forgot_password.html")


@app.route("/login", methods=["GET", "POST"])
def loginC():

	if "username" in session:
		return redirect(url_for("account", login=True))

	invalid = False
	got = ""
	data = ""

	if request.method == "POST":
		got, data = login.login(
			request.form["email"], request.form["password"])

	if got == "invalid":
		invalid = True
	elif got == "logged":

		if "rememberMeCheck" in request.form:
			print("Remember Me")
		else:
			session["loginTime"] = datetime.now(timezone.utc)
			print("Dont remember me")

		session["username"] = data["user"]

		# return redirect(url_for("account", login=True))
		return redirect(url_for("home", login=True))

	return render_template("login.html", invalid=invalid)


@app.route("/register", methods=["GET", "POST"])
def register():

	if "username" in session:
		return redirect(url_for("account", login=True))

	if request.method == "POST":
		name = request.form["fname"].strip()
		user = request.form["uname"].strip()
		email = request.form["email"].strip()
		pass1 = request.form["password"].strip()

		if not login.check_email(email):
			return render_template("register.html", invalid="Email already in use")

		if not login.check_user(user):
			return render_template("register.html", invalid="Username is already taken")

		session["temp"] = {
			"fname": name,
			"uname": user,
			"email": email,
			"password": pass1
		}

		OTP = otp.send_otp(email, name, "register")
		session["otp"] = OTP
		return render_template("otp.html", otp=OTP)

	return render_template("register.html")


@app.route("/account")
def account():

	if "username" in session:
		return render_template("account.html", login=True)

	return redirect(url_for("loginC"))


@app.get("/theuser")
async def read_root():
	username = session['username']
	data = login.getUserDetails(username)
	for i in data:
		sendData = {'name': i['name'],
					'username': i['user'], 'email': i['email']}
		return jsonify(sendData)


@app.get("/userexist")
async def userexist():
	user = request.args.get("user")
	if login.check_user(user):
		return "usernotexists"
	else:
		return "userexists"


@app.get("/emailexist")
async def emailexist():
	email = request.args.get("email")
	if login.check_email(email):
		return "emailnotexists"
	else:
		return "emailexists"


@app.route("/logout")
def logout():

	if "username" in session:
		session.clear()

		return redirect(url_for("home"))


@app.route("/status")
def status():

	return redirect("https://statuspage.freshping.io/66639-DOST")


@app.route("/suggestion_data", methods=["POST"])
def process():
	try:
		data = request.get_json()
		print(data["data"])

		return "Hello"
	except Exception:
		return render_template('404.html'), 404


# Get Process Send
@app.route('/process_data')
def get_user():

	user = request.args.get("data")
	if not user:
		return render_template('404.html'), 404

	post = login.check_user(user)
	data = {'post': post}
	return jsonify(data)


@app.route('/check_oldPass')
def checkOldPass():

	user = request.args.get("user")
	oldPass = request.args.get("oldPass")
	if not user:
		return render_template('404.html'), 404

	got, info = login.login(user, oldPass)
	dataS = {'passOk': got}
	return jsonify(dataS)


# To edit credentials
@app.route('/edit_credentials')
def editCredentials():
	# user = request.args.get("user")
	check = request.args.get("check")
	checkValue = request.args.get("checkValue")
	field = request.args.get("field")
	value = request.args.get("value")

	if check:
		login.editUser({check: checkValue}, {"$set": {field: value}})
		if field == "user":
			session["username"] = value
		elif field == "register":
			pass
		return "Ok"


# get the email address and send the otp
@app.route("/send_otp", methods=["POST"])
def get_email():
	data = request.get_json()
	email = data.get("email")
	type = data.get("type")

	if email == "register":
		email = session["temp"]["email"]
		name = session["temp"]["fname"]
		sent_otp = otp.send_otp(email, name, "register")
	else:
		name = login.myCol.find_one({"email": email}).get("name")
		sent_otp = otp.send_otp(email, name, "forgot")
		
	session["otp"] = sent_otp

	if type == "resend":
		response_data = {"message": "OTP has been resent."}
	else:
		response_data = {
			"message": "A verification OTP has been sent to your registered email."
		}
	return jsonify(response_data)


@app.route("/check_otp", methods=["POST"])
def check_otp():
	data = request.get_json()
	otp_code = int(data.get("otp"))
	stored_otp = int(session.get("otp"))
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


@app.route("/change_password")
def change_password():
	data = request.get_json()
	newPassword = data.get("password")
	pass


@app.route("/complete_registration")
def completeRegistration():
	name = session["temp"]["fname"]
	user = session["temp"]["fname"]
	email = session["temp"]["email"]
	pass1 = session["temp"]["password"]
	login.register(name, user, email, pass1)

	session.clear()
	return render_template("login.html")

@app.route("/create_new_password")
def create_new_password():
	return render_template("create_new_password.html")


@app.route("/changed_password")
def passwordChange():
	session.clear()
	return render_template("login.html")


@app.errorhandler(404)
def page_not_found(e):
	return render_template('404.html'), 404


def run():
	app.run(host='0.0.0.0', port=8080, debug=True)


if __name__ == "__main__":
	run()
