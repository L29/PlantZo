import time

from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token)
app = Flask(__name__)


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'linz'
app.config['MYSQL_PASSWORD'] = 'Password'
app.config['MYSQL_DB'] = 'plantzo'

mysql = MySQL(app)
bcrypt = Bcrypt(app)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()['user']
    email = data['email']
    first_name = data['firstName']
    last_name = data['lastName']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    cur = mysql.connection.cursor()

    cur.execute("SELECT 1 FROM users WHERE email=%s", (email,))
    if cur.rowcount == 1:
        return "User Already Exist!"

    cur.execute("INSERT INTO users (first_name, last_name, email, password) VALUES (%s, %s, %s, %s)", (first_name, last_name, email, password))

    mysql.connection.commit()
    cur.close()
    print("success")

    result = {
        'first_name' : first_name,
        'last_name' : last_name,
        'email' : email,
        'password' : password,
    }
    return jsonify({'result' : result})

@app.route('/api/login', methods=['POST'])
def login():
    cur = mysql.connection.cursor()
    data = request.get_json()['user']
    email = data['email']
    password = data['password']
    result = ""
    
    cur.execute("SELECT * FROM users where email =%s", (email,))
    rv = cur.fetchone()
    
    if bcrypt.check_password_hash(rv['password'], password):
        access_token = create_access_token(identity = {'first_name': rv['first_name'],'last_name': rv['last_name'],'email': rv['email']})
        result = access_token
    else:
        result = jsonify({"error":"Invalid username and password"})
    
    return result

if __name__ == '__main__':
    app.run(debug=True)