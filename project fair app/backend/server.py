import json
import os
from pathlib import Path

import pymysql
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash

import os
from dotenv import load_dotenv

# Load variables from a local .env file if it exists
load_dotenv()

# This is how your code will fetch the database settings securely:
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / 'frontend'

app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path='')
allowed_origins = os.getenv('ALLOWED_ORIGINS', '*')
origin_list = [origin.strip() for origin in allowed_origins.split(',') if origin.strip()]
if origin_list and origin_list != ['*']:
    CORS(app, resources={r'/api/*': {'origins': origin_list}}, supports_credentials=True)
else:
    CORS(app)

DB_CONFIG = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'port': int(os.getenv('MYSQL_PORT', '3306')),
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', ''),
    'database': os.getenv('MYSQL_DATABASE', 'projectexpert'),
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor,
    'autocommit': True,
}

USER_DB_NAME = os.getenv('MYSQL_USER_DATABASE', DB_CONFIG['database'])
ENGINEER_SIGNUP_DB_NAME = os.getenv('MYSQL_ENGINEER_SIGNUP_DATABASE', DB_CONFIG['database'])

DEFAULT_ENGINEERS = [
    {
        'name': 'Amina Okafor',
        'specialty': 'Electronics design specialist',
        'school': 'University of Lagos',
        'bio': 'Electronics design specialist',
        'skills': ['PCB', 'Testing', 'Circuit design'],
        'whatsapp': '+2348030001111',
        'skype': 'live:aminaokafor',
        'phone': '+2348030001111',
        'image': 'https://unsplash.com',
    },
    {
        'name': 'Chinedu Adebayo',
        'specialty': 'Embedded systems engineer',
        'school': 'Federal University of Technology, Akure',
        'bio': 'Embedded systems engineer',
        'skills': ['Firmware', 'IoT', 'Microcontrollers'],
        'whatsapp': '+2348100102222',
        'skype': 'live:chineduadebayo',
        'phone': '+2348100102222',
        'image': 'https://unsplash.com',
    },
    {
        'name': 'Tosin Adeyemi',
        'specialty': 'Research and prototyping lead',
        'school': 'Obafemi Awolowo University',
        'bio': 'Research and prototyping lead',
        'skills': ['Research', 'Prototyping', 'Testing'],
        'whatsapp': '+2348120203333',
        'skype': 'live:tosinadeyemi',
        'phone': '+2348120203333',
        'image': 'https://unsplash.com',
    },
    {
        'name': 'Zainab Musa',
        'specialty': 'Hardware product engineer',
        'school': 'Ahmadu Bello University',
        'bio': 'Hardware product engineer',
        'skills': ['Design', 'Automation', 'Product validation'],
        'whatsapp': '+2348140304444',
        'skype': 'live:zainabmusa',
        'phone': '+2348140304444',
        'image': 'https://unsplash.com',
    },
    {
        'name': 'Kehinde Bello',
        'specialty': 'Mechatronics engineer',
        'school': 'University of Ibadan',
        'bio': 'Mechatronics engineer',
        'skills': ['Robotics', 'Sensors', 'Automation'],
        'whatsapp': '+2348160405555',
        'skype': 'live:kehindebello',
        'phone': '+2348160405555',
        'image': 'https://unsplash.com',
    },
    {
        'name': 'Ifeoma Nwosu',
        'specialty': 'AI and automation specialist',
        'school': 'University of Benin',
        'bio': 'AI and automation specialist',
        'skills': ['Machine learning', 'Data analysis', 'Automation'],
        'whatsapp': '+2348180506666',
        'skype': 'live:ifeomanwosu',
        'phone': '+2348180506666',
        'image': 'https://unsplash.com',
    },
]


def get_connection(database_name: str | None = None):
    config = dict(DB_CONFIG)
    if database_name:
        config['database'] = database_name
    return pymysql.connect(**config)


def database_available() -> bool:
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute('SELECT 1')
        conn.close()
        return True
    except Exception:
        return False


def ensure_database():
    try:
        try:
            root_conn = pymysql.connect(
                host=DB_CONFIG['host'],
                port=DB_CONFIG['port'],
                user=DB_CONFIG['user'],
                password=DB_CONFIG['password'],
                charset='utf8mb4',
                autocommit=True,
            )
            with root_conn.cursor() as cursor:
                for db_name in set([DB_CONFIG['database'], USER_DB_NAME, ENGINEER_SIGNUP_DB_NAME]):
                    cursor.execute(
                        f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
                    )
            root_conn.close()
        except Exception:
            pass

        conn = get_connection(DB_CONFIG['database'])
        with conn.cursor() as cursor:
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS engineers (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    specialty VARCHAR(255) NOT NULL,
                    school VARCHAR(255) NOT NULL,
                    bio TEXT NOT NULL,
                    skills JSON NOT NULL,
                    whatsapp VARCHAR(255) NOT NULL,
                    skype VARCHAR(255) NOT NULL,
                    phone VARCHAR(255) NOT NULL,
                    image VARCHAR(500) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            )
            cursor.execute('SELECT COUNT(*) AS count FROM engineers')
            row = cursor.fetchone()
            if row and row['count'] == 0:
                for engineer in DEFAULT_ENGINEERS:
                    cursor.execute(
                        """
                        INSERT INTO engineers (name, specialty, school, bio, skills, whatsapp, skype, phone, image)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """,
                        (
                            engineer['name'],
                            engineer['specialty'],
                            engineer['school'],
                            engineer['bio'],
                            json.dumps(engineer['skills']),
                            engineer['whatsapp'],
                            engineer['skype'],
                            engineer['phone'],
                            engineer['image'],
                        ),
                    )
        conn.close()

        conn = get_connection(USER_DB_NAME)
        with conn.cursor() as cursor:
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS user_logins (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    full_name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            )
        conn.close()

        conn = get_connection(ENGINEER_SIGNUP_DB_NAME)
        with conn.cursor() as cursor:
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS engineer_signups (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    specialty VARCHAR(255) NOT NULL,
                    school VARCHAR(255) NOT NULL,
                    bio TEXT NOT NULL,
                    skills JSON NOT NULL,
                    whatsapp VARCHAR(255) NOT NULL,
                    skype VARCHAR(255) NOT NULL,
                    phone VARCHAR(255) NOT NULL,
                    image VARCHAR(500) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            )
        conn.close()
    except Exception as exc:
        print(f'MySQL setup warning: {exc}')


@app.route('/')
def index():
    return send_from_directory(str(FRONTEND_DIR), 'index.html')


@app.route('/api/health')
def health():
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute('SELECT 1')
        conn.close()
        return jsonify({
            'status': 'ok',
            'database': DB_CONFIG['database'],
            'user_database': USER_DB_NAME,
            'engineer_signup_database': ENGINEER_SIGNUP_DB_NAME,
        })
    except Exception as exc:
        return jsonify({
            'status': 'degraded',
            'message': str(exc),
            'database': DB_CONFIG['database'],
            'fallback': 'default_engineers',
        }), 200


@app.route('/api/users', methods=['POST'])
def create_user_login():
    payload = request.get_json(force=True) or {}
    required_fields = ['full_name', 'email', 'password']
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({'error': f'Missing required fields: {", ".join(missing)}'}), 400

    if not database_available():
        return jsonify({'error': 'MySQL is not available. Please start the database server to store user logins.', 'fallback': 'demo_mode'}), 503

    try:
        conn = get_connection(USER_DB_NAME)
        with conn.cursor() as cursor:
            cursor.execute('SELECT id FROM user_logins WHERE email = %s', (payload['email'].strip(),))
            if cursor.fetchone():
                conn.close()
                return jsonify({'error': 'A user with that email already exists.'}), 409

            cursor.execute(
                """
                INSERT INTO user_logins (full_name, email, password_hash)
                VALUES (%s, %s, %s)
                """,
                (
                    payload['full_name'].strip(),
                    payload['email'].strip(),
                    generate_password_hash(payload['password']),
                ),
            )
            conn.commit()
            user_id = cursor.lastrowid
        conn.close()
        return jsonify({'id': user_id, 'message': 'User login record created successfully'}), 201
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/api/engineer-signups', methods=['POST'])
def create_engineer_signup():
    payload = request.get_json(force=True) or {}
    required_fields = ['name', 'specialty', 'school', 'bio', 'skills', 'whatsapp', 'skype', 'phone', 'image']
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({'error': f'Missing required fields: {", ".join(missing)}'}), 400
    if not database_available():
        return jsonify({'error': 'MySQL is not available. Please start the database server to store engineer signups.', 'fallback': 'demo_mode'}), 503
    try:
        conn = get_connection(ENGINEER_SIGNUP_DB_NAME)
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO engineer_signups (name, specialty, school, bio, skills, whatsapp, skype, phone, image)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    payload['name'],
                    payload['specialty'],
                    payload['school'],
                    payload['bio'],
                    json.dumps(payload['skills']),
                    payload['whatsapp'],
                    payload['skype'],
                    payload['phone'],
                    payload['image'],
                ),
            )
            conn.commit()
            signup_id = cursor.lastrowid
        conn.close()
        return jsonify({'id': signup_id, 'message': 'Engineer signup saved successfully'}), 201
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/api/engineers', methods=['GET'])
def get_engineers():
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute('SELECT * FROM engineers ORDER BY id DESC')
            rows = cursor.fetchall()
        conn.close()
        engineers = []
        for row in rows:
            engineer = dict(row)
            engineer['skills'] = json.loads(engineer.get('skills') or '[]')
            engineers.append(engineer)
        return jsonify(engineers)
    except Exception as exc:
        print(f'MySQL unavailable for GET /api/engineers: {exc}')
        return jsonify(DEFAULT_ENGINEERS), 200


@app.route('/api/engineers', methods=['POST'])
def add_engineer():
    payload = request.get_json(force=True) or {}
    required_fields = ['name', 'specialty', 'school', 'bio', 'skills', 'whatsapp', 'skype', 'phone', 'image']
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({'error': f'Missing required fields: {", ".join(missing)}'}), 400
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO engineers (name, specialty, school, bio, skills, whatsapp, skype, phone, image)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    payload['name'],
                    payload['specialty'],
                    payload['school'],
                    payload['bio'],
                    json.dumps(payload['skills']),
                    payload['whatsapp'],
                    payload['skype'],
                    payload['phone'],
                    payload['image'],
                ),
            )
            conn.commit()
            engineer_id = cursor.lastrowid
        conn.close()
        return jsonify({'id': engineer_id, 'message': 'Engineer saved to MySQL'}), 201
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


ensure_database()
if __name__ == '__main__':
    port = int(os.getenv('PORT', '8000'))
    app.run(host='0.0.0.0', port=port, debug=False)
