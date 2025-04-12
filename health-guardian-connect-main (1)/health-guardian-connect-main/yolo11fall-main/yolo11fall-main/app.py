from flask import Flask, render_template, request, redirect, url_for, session, send_file
from flask_bcrypt import Bcrypt
from datetime import datetime
import mysql.connector
import pandas as pd

app = Flask(__name__)
app.secret_key = "your_secret_key"
bcrypt = Bcrypt(app)

def get_db_connection():
    db = mysql.connector.connect(host="localhost", user="root", password="Sanju@2004")
    cursor = db.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS fall_detection")
    cursor.close()
    db.close()

    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Sanju@2004",
        database="fall_detection"
    )

def create_tables():
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS fall_records (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fall_count INT,
            normal_count INT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    db.commit()
    cursor.close()
    db.close()

create_tables()

@app.route('/')
def home():
    return redirect(url_for('signup'))

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        try:
            db = get_db_connection()
            cursor = db.cursor()
            cursor.execute("INSERT INTO users (email, password) VALUES (%s, %s)", 
                           (email, hashed_password))
            db.commit()
            cursor.close()
            db.close()
            return redirect(url_for('login'))
        except mysql.connector.IntegrityError:
            return "Email already exists!"
    return render_template("signup.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT id, password FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()
        cursor.close()
        db.close()
        if user and bcrypt.check_password_hash(user[1], password):
            session['user_id'] = user[0]
            return redirect(url_for('dashboard'))
        else:
            return "Invalid email or password!"
    return render_template("login.html")

@app.route('/dashboard')
def dashboard():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM fall_records ORDER BY timestamp DESC LIMIT 10")
    data = cursor.fetchall()
    cursor.close()
    db.close()
    return render_template('dashboard.html', data=data)

@app.route('/download_report')
def download_report():
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM fall_records")
    data = cursor.fetchall()
    cursor.close()
    db.close()
    df = pd.DataFrame(data, columns=["ID", "Fall Count", "Normal Count", "Timestamp"])
    file_path = "fall_report.xlsx"
    df.to_excel(file_path, index=False)
    return send_file(file_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
