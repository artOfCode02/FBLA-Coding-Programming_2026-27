from flask import Flask, request, jsonify, render_template  # Python web framework
import pip._vendor.requests as requests  # requests
import os, json, certifi, ssl
from geopy.geocoders import Nominatim, options  # Geopy for geocoding

# Top level domain for app (Flask)
app = Flask(__name__)


##########################--- INDEX ---##################################
# Render index.html
@app.route("/")
def index():
    return render_template("index.html")
