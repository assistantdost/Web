from flask import Flask, render_template, request, session, url_for, redirect, send_file
from datetime import datetime, timedelta, timezone
import os
import json
import requests

from routes.auth import authBluePrint, getUser
from routes.api import apiBluePrint

app = Flask(__name__, template_folder='templates', static_folder='static')
app.register_blueprint(authBluePrint)
app.register_blueprint(apiBluePrint)
flaskKEY = os.environ.get("FLASKKEY")
app.config["SECRET_KEY"] = flaskKEY
app.config["SESSION_TYPE"] = "filesystem"
webhook = os.environ.get("WEBHOOK_URL")


def send_to_discord(data):
    discord_message = {
        "content": f"## New Suggestion Received:\n**Name** : {data['user']['name']}\n**Username** : {data['user']['username']}\n**Email** : {data['user']['email']}\n**Suggestion** :\n {data['data']}"
    }

    response = requests.post(webhook, json=discord_message)

    if response.status_code == 204:
        return "success"
    else:
        return "error"


@app.context_processor
def utility_processor():

    with open("static/assets/data/app_data.json") as file:
        appData = json.load(file)

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


@app.route("/")
def home(goto=""):
    if request.args.get('goto') == "home" or goto == "home":
        return render_template("index.html", landing=False)
    else:
        return render_template("index.html", landing=True)


@app.route("/commands")
def commands():

    return render_template("commands.html")


@app.route("/privacy-policy")
def privacy_policy():
    return render_template("privacy policy.html")


@app.route("/terms-and-condition")
def terms_and_condition():
    return render_template("terms and condition.html")


@app.route("/changelog")
def changelog():
    return render_template("changelog.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/download")
def download():
    return send_file("static/installer/DOST Installer v2.exe", as_attachment=True)


@app.route("/forgot-password")
def forgot_password():
    return render_template("forgot_password.html")


@app.route("/account")
def account():

    if "username" in session:
        return render_template("account.html", login=True)

    return redirect(url_for("loginC"))


@app.route("/status")
def status():

    return redirect("https://statuspage.freshping.io/66639-DOST")


@app.route("/suggestion-data", methods=["POST"])
async def suggestion():
    try:
        data = request.get_json()
        data["user"] = await getUser()

        stat = send_to_discord(data)

        return stat

    except Exception:
        return render_template('404.html'), 404


@app.route("/otp_page")
def otp_page():
    return render_template("otp.html")


@app.route("/hello")
def hello():
    return "Hello, World!"


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


def run():
    app.run(host='0.0.0.0', port=8080, debug=True)


if __name__ == "__main__":
    run()
