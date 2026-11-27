import json
import os
from pathlib import Path

import pymysql
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

# Load variables from a local .env file if it exists
load_dotenv()

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
    'host': os.getenv('DB_HOST') or os.getenv('MYSQL_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT') or os.getenv('MYSQL_PORT', '15878')),
    'user': os.getenv('DB_USER') or os.getenv('MYSQL_USER', 'avnadmin'),
    'password': os.getenv('DB_PASSWORD') or os.getenv('MYSQL_PASSWORD', ''),
    'database': os.getenv('DB_NAME') or os.getenv('MYSQL_DATABASE', 'defaultdb'),
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor,
    'autocommit': True,
    'ssl': {'ssl': {}},
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
        'image': 'images/fewfwefwefwefe.jpg',
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
        'image': 'images/fwefwefefwefewf.jpg',
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
        'image': 'images/imagesgrehhtrhthtrhrt.jpg',
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
        'image': 'images/invent7.jpg',
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
        'image': 'images/wefwefwefwefewfe.jpg',
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
        'image': 'images/invent 1.jpg',
    },
]

DEFAULT_FINISHED_PROJECTS = [
    {
        'name': 'Solar irrigation controller',
        'description': 'A smart water-saving control system built for remote farmland with automated pump timing and sensor-based alerts.',
        'timeline': 'Completed in 6 weeks',
        'type': 'Product design',
        'engineer': 'Amina Okafor',
        'image': 'https://unsplash.com',
        'likes': 0,
    },
    {
        'name': 'Portable lab analyzer',
        'description': 'A compact diagnostic device for field testing and rapid measurements in science and engineering labs.',
        'timeline': 'Completed in 8 weeks',
        'type': 'Prototype',
        'engineer': 'Chinedu Adebayo',
        'image': 'https://unsplash.com',
        'likes': 0,
    },
    {
        'name': 'Battery health monitor',
        'description': 'A lightweight monitoring system for industrial battery packs used in research and prototype validation.',
        'timeline': 'Completed in 4 weeks',
        'type': 'Tech build',
        'engineer': 'Tosin Adeyemi',
        'image': 'https://unsplash.com',
        'likes': 0,
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
                for db_name in {DB_CONFIG['database'], USER_DB_NAME, ENGINEER_SIGNUP_DB_NAME}:
                    cursor.execute(
                        f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
                    )
            root_conn.close()
        except Exception:
            pass

        conn = get_connection(DB_CONFIG['database'])
        with conn.cursor() as cursor:
            # Engineers table
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
                    image LONGTEXT NOT NULL,
                    owner_id VARCHAR(255) DEFAULT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            )
            # Upgrade existing image column if previously VARCHAR(500)
            try:
                cursor.execute("ALTER TABLE engineers MODIFY image LONGTEXT NOT NULL")
            except Exception:
                pass

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

            # Open Project Requests table
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS projects (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT NOT NULL,
                    timeline VARCHAR(100) NOT NULL,
                    budget VARCHAR(100) NOT NULL,
                    type VARCHAR(100) NOT NULL,
                    engineer_count INT DEFAULT 0,
                    whatsapp VARCHAR(255) DEFAULT '',
                    skype VARCHAR(255) DEFAULT '',
                    owner_id VARCHAR(255) DEFAULT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            )

            # Finished Projects table
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS finished_projects (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    engineer VARCHAR(255) NOT NULL,
                    description TEXT NOT NULL,
                    timeline VARCHAR(100) NOT NULL,
                    type VARCHAR(100) NOT NULL,
                    image LONGTEXT NOT NULL,
                    likes INT DEFAULT 0,
                    owner_id VARCHAR(255) DEFAULT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            )
            cursor.execute('SELECT COUNT(*) AS count FROM finished_projects')
            fp_row = cursor.fetchone()
            if fp_row and fp_row['count'] == 0:
                for fp in DEFAULT_FINISHED_PROJECTS:
                    cursor.execute(
                        """
                        INSERT INTO finished_projects (name, engineer, description, timeline, type, image, likes)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                        """,
                        (
                            fp['name'],
                            fp['engineer'],
                            fp['description'],
                            fp['timeline'],
                            fp['type'],
                            fp['image'],
                            fp['likes'],
                        ),
                    )
        conn.close()

        # Users table
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

        # Engineer Signups archive table
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
                    image LONGTEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            )
            try:
                cursor.execute("ALTER TABLE engineer_signups MODIFY image LONGTEXT NOT NULL")
            except Exception:
                pass
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


# --- Authentication Routes ---

@app.route('/api/users', methods=['POST'])
def create_user_login():
    payload = request.get_json(force=True) or {}
    required_fields = ['full_name', 'email', 'password']
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({'error': f'Missing required fields: {", ".join(missing)}'}), 400

    if not database_available():
        return jsonify({'error': 'Database is currently unavailable.'}), 503

    try:
        email = payload['email'].strip().lower()
        full_name = payload['full_name'].strip()
        conn = get_connection(USER_DB_NAME)
        with conn.cursor() as cursor:
            cursor.execute('SELECT id FROM user_logins WHERE email = %s', (email,))
            if cursor.fetchone():
                conn.close()
                return jsonify({'error': 'A user with that email already exists.'}), 409

            cursor.execute(
                """
                INSERT INTO user_logins (full_name, email, password_hash)
                VALUES (%s, %s, %s)
                """,
                (full_name, email, generate_password_hash(payload['password'])),
            )
            user_id = cursor.lastrowid
        conn.close()
        return jsonify({
            'id': user_id,
            'full_name': full_name,
            'email': email,
            'message': 'Account created successfully',
        }), 201
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500
@app.route('/api/login', methods=['POST'])
def login_user():
    payload = request.get_json(force=True) or {}
    email = (payload.get('email') or '').strip().lower()
    password = payload.get('password') or ''

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    if not database_available():
        return jsonify({'error': 'Database is currently unavailable.'}), 503

    try:
        conn = get_connection(USER_DB_NAME)
        with conn.cursor() as cursor:
            cursor.execute(
                'SELECT id, full_name, email, password_hash FROM user_logins WHERE email = %s',
                (email,),
            )
            user = cursor.fetchone()
        conn.close()

        if not user or not check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Invalid email or password.'}), 401

        return jsonify({
            'id': user['id'],
            'full_name': user['full_name'],
            'email': user['email'],
            'message': 'Signed in successfully',
        }), 200
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


# --- Engineers Routes ---

@app.route('/api/engineers', methods=['GET'])
def get_engineers():
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute('SELECT * FROM engineers ORDER BY id ASC')
            rows = cursor.fetchall()
        conn.close()
        engineers = []
        for row in rows:
            engineer = dict(row)
            engineer['skills'] = json.loads(engineer.get('skills') or '[]')
            engineer['ownerId'] = engineer.pop('owner_id', None)
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
                INSERT INTO engineers (name, specialty, school, bio, skills, whatsapp, skype, phone, image, owner_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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
                    payload.get('ownerId'),
                ),
            )
            engineer_id = cursor.lastrowid
        conn.close()
        return jsonify({'id': engineer_id, 'message': 'Engineer saved to MySQL'}), 201
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/api/engineers/<path:engineer_name>', methods=['DELETE'])
def delete_engineer(engineer_name):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute('DELETE FROM engineers WHERE name = %s', (engineer_name,))
            deleted = cursor.rowcount
        conn.close()
        if not deleted:
            return jsonify({'error': 'Engineer not found'}), 404
        return jsonify({'message': 'Engineer deleted successfully'}), 200
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
        return jsonify({'error': 'MySQL is not available.'}), 503
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
            signup_id = cursor.lastrowid
        conn.close()
        return jsonify({'id': signup_id, 'message': 'Engineer signup saved successfully'}), 201
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


# --- Project Requests Routes ---

@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute('SELECT * FROM projects ORDER BY id ASC')
            rows = cursor.fetchall()
        conn.close()
        projects = []
        for row in rows:
            item = dict(row)
            item['engineerCount'] = item.pop('engineer_count', 0)
            item['ownerId'] = item.pop('owner_id', None)
            projects.append(item)
        return jsonify(projects), 200
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500
@app.route('/api/projects', methods=['POST'])
def add_project():
    payload = request.get_json(force=True) or {}
    required_fields = ['name', 'description', 'timeline', 'budget', 'type']
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({'error': f'Missing required fields: {", ".join(missing)}'}), 400
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO projects (name, description, timeline, budget, type, engineer_count, whatsapp, skype, owner_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    payload['name'],
                    payload['description'],
                    payload['timeline'],
                    payload['budget'],
                    payload['type'],
                    int(payload.get('engineerCount', 0)),
                    payload.get('whatsapp', ''),
                    payload.get('skype', ''),
                    payload.get('ownerId'),
                ),
            )
            project_id = cursor.lastrowid
        conn.close()
        return jsonify({'id': project_id, 'message': 'Project saved successfully'}), 201
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute('DELETE FROM projects WHERE id = %s', (project_id,))
            deleted = cursor.rowcount
        conn.close()
        if not deleted:
            return jsonify({'error': 'Project not found'}), 404
        return jsonify({'message': 'Project deleted successfully'}), 200
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


# --- Finished Projects Routes ---

@app.route('/api/finished-projects', methods=['GET'])
def get_finished_projects():
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute('SELECT * FROM finished_projects ORDER BY id ASC')
            rows = cursor.fetchall()
        conn.close()
        projects = []
        for row in rows:
            item = dict(row)
            item['ownerId'] = item.pop('owner_id', None)
            projects.append(item)
        return jsonify(projects), 200
    except Exception:
        return jsonify(DEFAULT_FINISHED_PROJECTS), 200


@app.route('/api/finished-projects', methods=['POST'])
def add_finished_project():
    payload = request.get_json(force=True) or {}
    required_fields = ['name', 'engineer', 'description', 'timeline', 'type', 'image']
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({'error': f'Missing required fields: {", ".join(missing)}'}), 400
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO finished_projects (name, engineer, description, timeline, type, image, likes, owner_id)
                VALUES (%s, %s, %s, %s, %s, %s, 0, %s)
                """,
                (
                    payload['name'],
                    payload['engineer'],
                    payload['description'],
                    payload['timeline'],
                    payload['type'],
                    payload['image'],
                    payload.get('ownerId'),
                ),
            )
            fp_id = cursor.lastrowid
        conn.close()
        return jsonify({'id': fp_id, 'message': 'Finished project saved successfully'}), 201
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/api/finished-projects/<int:project_id>/like', methods=['POST'])
def like_finished_project(project_id):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute('UPDATE finished_projects SET likes = likes + 1 WHERE id = %s', (project_id,))
            cursor.execute('SELECT likes FROM finished_projects WHERE id = %s', (project_id,))
            row = cursor.fetchone()
        conn.close()
        if not row:
            return jsonify({'error': 'Finished project not found'}), 404
        return jsonify({'likes': row['likes']}), 200
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/api/finished-projects/<int:project_id>', methods=['DELETE'])
def delete_finished_project(project_id):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute('DELETE FROM finished_projects WHERE id = %s', (project_id,))
            deleted = cursor.rowcount
        conn.close()
        if not deleted:
            return jsonify({'error': 'Finished project not found'}), 404
        return jsonify({'message': 'Finished project deleted successfully'}), 200
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


ensure_database()

if __name__ == '__main__':
    port = int(os.getenv('PORT', '8000'))
    app.run(host='0.0.0.0', port=port, debug=False)
