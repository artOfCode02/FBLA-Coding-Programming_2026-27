from flask import Flask, request, jsonify, render_template  # Python web framework
import os
import json

# Top level domain for app (Flask)
app = Flask(__name__)

CREDENTIALS_FILE = "credentials.json"


def load_credentials():
    if os.path.exists(CREDENTIALS_FILE):
        with open(CREDENTIALS_FILE, "r") as f:
            return json.load(f)
    return {}


def check_credentials(username, password):
    credentials_data = load_credentials()
    print("Loaded credentials_data:", repr(credentials_data))
    print("Typed inputs", repr(username), repr(password))

    clean_username = username.strip()

    if (
        clean_username in credentials_data
        and credentials_data[clean_username] == password
    ):
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

        if not all([username, password]):
            return jsonify(
                {
                    "success": False,
                    "message": "Missing required fields (username, businessID, or businessName).",
                }
            ), 400

    return jsonify({"success": True, "verified": check_credentials(username, password)})


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


#########################################################################
