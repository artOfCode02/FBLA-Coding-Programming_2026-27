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


def get_owned_organizations(username):
    """Return owned organizations in the same dictionary layout as orgs.json."""
    if not username:
        return {}

    username = username.strip()
    organizations = read_json_file(ORGS_FILE)
    owned_organizations = {}

    for org_id, organization in organizations.items():
        owners = organization.get("owner", [])

        if isinstance(owners, str):
            owners = [owners]

        if username in owners:
            owned_organizations[org_id] = organization
            break

    return owned_organizations


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


@app.route("/edit-org", methods=["POST"])
def edit_org():
    if not request.is_json:
        return jsonify({"success": False, "message": "JSON required"}), 400

    data = request.get_json()
    title = data.get("edit_title", "").strip()
    desc = data.get("edit_desc", "").strip()
    email = data.get("edit_contact", "").strip()
    location = data.get("edit_location", "").strip()

    if not all([title, desc, email, location]):
        return jsonify(
            {
                "success": False,
                "message": "Missing required fields (title, description, email, location)",
            }
        ), 400

    organizations = read_json_file(ORGS_FILE)
    if not organizations:
        return jsonify({"success": False, "message": "Organization not found"}), 404

    org_id = next(iter(organizations))
    organizations[org_id]["title"] = title
    organizations[org_id]["desc"] = desc
    organizations[org_id]["email"] = email
    organizations[org_id]["location"] = location

    with open(ORGS_FILE, "w", encoding="utf-8") as file:
        json.dump(organizations, file, indent=2)

    return jsonify({"success": True, "message": "Organization updated successfully"}), 200


@app.route("/get-orgs", methods=["POST"])
def get_orgs():
    if request.is_json:
        data = request.get_json()

        username = data.get("username")

        if not username:
            return jsonify(
                {
                    "success": False,
                    "message": "Missing required fields (username)",
                }
            ), 400

        owned_organizations = get_owned_organizations(username)

        return jsonify({"success": True, "owned_organizations": owned_organizations}), 200


@app.route("/get-volunteers", methods=["GET"])
def get_volunteers():
    credentials = read_json_file(CREDENTIALS_FILE)
    volunteers = {
        username: {
            "role": account.get("role", ""),
            "status": account.get("status", "active"),
        }
        for username, account in credentials.items()
        if account.get("role") == "volunteer"
    }
    return jsonify({"success": True, "volunteers": volunteers}), 200


@app.route("/update-volunteer", methods=["POST"])
def update_volunteer():
    if not request.is_json:
        return jsonify({"success": False, "message": "JSON required"}), 400

    data = request.get_json()
    username = data.get("username", "").strip()
    status = data.get("status")

    if not username or status not in ("active", "inactive"):
        return jsonify({"success": False, "message": "Invalid username or status"}), 400

    credentials = read_json_file(CREDENTIALS_FILE)
    if username not in credentials or credentials[username].get("role") != "volunteer":
        return jsonify({"success": False, "message": "Volunteer not found"}), 404

    credentials[username]["status"] = status

    with open(CREDENTIALS_FILE, "w", encoding="utf-8") as file:
        json.dump(credentials, file, indent=2)

    return jsonify({"success": True, "message": "Volunteer status updated"}), 200
