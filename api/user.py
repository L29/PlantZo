from app import app, bcrypt
from db import mysql
from flask import Flask, flash, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
from werkzeug.datastructures import ImmutableMultiDict
import bson.json_util
from bson import json_util
import datetime
import jwt
import json
import os


UPLOAD_FOLDER = 'upload/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
	return '.' in filename and \
			filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/settings/profile", methods=['POST'])
def edit_profile():
	if request.method == 'POST':
		cur = mysql.cursor(buffered=True)
		data = dict(request.form)
		if(request.files):
			#handle image
			profile = request.files['profile_image']
			bg = request.files['background_image']
			bg_temp = bg.filename.split(".")
			profile_temp = profile.filename.split(".")
			profile.filename = data['uid']+"_profile."+profile_temp[1]
			bg.filename = data['uid']+"_background."+bg_temp[1]
			print(bg.filename, profile.filename)
			if profile.filename == '' and bg.filename == '':
				return "No Selected File"
			if profile and allowed_file(profile.filename) and bg and allowed_file(bg.filename):
				profilename = secure_filename(profile.filename)
				bgname = secure_filename(bg.filename)
				profile.save(os.path.join(app.config['UPLOAD_FOLDER'], profilename))
				bg.save(os.path.join(app.config['UPLOAD_FOLDER'], bgname))

		cur.execute("SELECT password FROM users where uid = %s", (data['uid'],))
		rv = cur.fetchone()
		new_password = bcrypt.generate_password_hash(data['newPassword']).decode('utf-8')
		if bcrypt.check_password_hash(rv[0], data['oldPassword']):
			cur.execute("UPDATE users SET first_name = %s, last_name = %s, password = %s, address = %s where uid = %s", (data['firstName'],data['lastName'],new_password,data['address'],data['uid']))
			mysql.commit()
			print("Success")
		else:
			print("missmatch")
			return "Password missmatch!"

		return "Success"

#/user/api/user/address
@app.route("/user/api/user/address", methods=['POST'])
def edit_address():
	if request.method == 'POST':
		data = request.get_json()
		cur = mysql.cursor(buffered=True)
		cur.execute("UPDATE users SET address = %s where uid = %s", (data['address'], data['uid'],))
		mysql.commit()
		cur.close()
		return 'Success'

@app.route("/comments", methods=['POST'])
def comment():
	if request.method == 'POST':
		data = request.get_json()
		print(data)
		cur = mysql.cursor(buffered=True)
		cur.execute("INSERT INTO comment (uid, pid, rating, comment) VALUES (%s, %s, %s, %s)", (data['uid'], data['pid'], data['currentValue'], data['textArea'],))
		mysql.commit()
		cur.close()
		return "Success give comment"

	return "Success"


@app.route("/history", methods=['GET'])
def history_view():
	def myconverter(o):
		if isinstance(o, datetime.datetime):
			return o.isoformat()

	if request.method == 'GET':
		token = request.headers.get('Authorization').replace("Bearer ","")
		print(token)
		payload = jwt.decode(token, app.config.get('JWT_SECRET_KEY'), algorithms=['HS256'])
		auth = payload['sub']
		cur = mysql.cursor(buffered=True)
		cur.execute("SELECT * FROM history h, product p WHERE h.uid = %s and h.pid = p.pid", (auth['uid'],))
		row_headers= [x[0] for x in cur.description]
		rv = cur.fetchall()
		print("rv:",rv)
		json_data = []
		for result in rv:
			asd = list(result)
			asd[4] = result[4].isoformat()
			json_data.append(dict(zip(row_headers,asd)))
		res = json.loads(json.dumps(json_data,default=myconverter))
		print(res)
		return jsonify(res)