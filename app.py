from flask import Flask, request, jsonify, render_template  # Python web framework
import os
import json

# Top level domain for app (Flask)
app = Flask(__name__)

CREDENTIALS_FILE = "credentials.json"
ORGS_FILE = "orgs.json"


def read_json_file(file):
    if not os.path.exists(file):
        return {}
    with open(file, "r", encoding="utf-8") as f:
        content = f.read().strip()
    if not content:
        return {}
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {}


def append_json_file(file, key, value):
    if os.path.exists(file):
        content = read_json_file(file)

        content[key] = value

        with open(file, "w") as f:
            json.dump(content, f, indent=2)


def check_credentials(username, password, role):
    credentials_data = read_json_file(CREDENTIALS_FILE)
    print("Typed inputs", repr(username), repr(password))

    clean_username = username.strip()

    verify_username = clean_username in credentials_data
    verify_password = credentials_data[clean_username]["password"] == password
    verify_role = credentials_data[clean_username]["role"] == role

    if verify_username and verify_password and verify_role:
        return True
    else:
        return False


##########################--- INDEX ---##################################
# Render index.html
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/verify-credentials", methods=["POST"])
def verify_credentials():
    if request.is_json:
        data = request.get_json()

        # Extract variables from arguments
        username = data.get("username")
        password = data.get("password")
        role = data.get("role")

        if not all([username, password]):
            return jsonify(
                {
                    "success": False,
                    "message": "Missing required fields (username, passowrd)",
                }
            ), 400

    return jsonify(
        {"success": True, "verified": check_credentials(username, password, role)}
    ), 200


#########################################################################


############################--- SIGN UP ---##############################
@app.route("/sign-up")
def sign_up():
    return render_template("sign_up.html")


@app.route("/add-credentials", methods=["POST"])
def add_credentials():
    if request.is_json:
        data = request.get_json()

        username = data.get("username")
        password = data.get("password")
        role = data.get("role")

        if not all([username, password, role]):
            return jsonify(
                {
                    "success": False,
                    "message": "Missing required fields (username, password)",
                }
            ), 400

        append_json_file(
            CREDENTIALS_FILE, username, {"password": password, "role": role}
        )

        return jsonify({"success": True, "message": "Add credentials successful"}), 200


#########################################################################


#####################--- VOLUNTEER DASHBOARD ---#########################
@app.route("/volunteer-dashboard")
def vounteer_dashboard():
    return render_template("volunteer_dashboard.html")


#########################################################################


#####################--- ORGANIZER DASHBOARD ---#########################
@app.route("/organizer-dashboard")
def organizer_dashboard():
    return render_template("organizer_dashboard.html")


@app.route("/add-org", methods=["POST"])
def add_org():
    if request.is_json:
        data = request.get_json()

        id = len(read_json_file(ORGS_FILE)) + 1
        title = data.get("create_title")
        desc = data.get("create_desc")

        if not all([title, desc]):
            return jsonify(
                {
                    "success": False,
                    "message": "Missing required fields (id, title, desc)",
                }
            ), 400

        append_json_file(ORGS_FILE, id, {"title": title, "desc": desc})

        return jsonify({"success": True, "message": "Add org successful"}), 200


#########################################################################
