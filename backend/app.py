from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import json
from datetime import datetime, timedelta
import os
try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    pass

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

CORS(app)
jwt = JWTManager(app)

DATABASE = 'hirafi.db'
DATABASE_URL = os.environ.get('DATABASE_URL')

def get_db():
    if DATABASE_URL:
        db = psycopg2.connect(DATABASE_URL)
        db.autocommit = False
        return db
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def sql(query):
    if DATABASE_URL:
        return query.replace('%s', '%s')
    return query

def init_db():
    db = get_db()
    if DATABASE_URL:
        cursor = db.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                user_type TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS workers (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                category TEXT NOT NULL,
                bio TEXT,
                location TEXT NOT NULL,
                experience_years INTEGER NOT NULL,
                whatsapp_number TEXT NOT NULL,
                vtc_license_number TEXT NOT NULL,
                verification_status TEXT DEFAULT 'pending',
                avg_rating REAL DEFAULT 0,
                review_count INTEGER DEFAULT 0,
                is_available INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                worker_id INTEGER NOT NULL,
                customer_id INTEGER NOT NULL,
                rating INTEGER NOT NULL,
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (worker_id) REFERENCES workers(id),
                FOREIGN KEY (customer_id) REFERENCES users(id)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                worker_id INTEGER NOT NULL,
                customer_id INTEGER NOT NULL,
                service_description TEXT NOT NULL,
                payment_method TEXT NOT NULL DEFAULT 'cash',
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (worker_id) REFERENCES workers(id),
                FOREIGN KEY (customer_id) REFERENCES users(id)
            )
        ''')
        db.commit()
        db.close()
        return
    cursor = db.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            user_type TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS workers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            category TEXT NOT NULL,
            bio TEXT,
            location TEXT NOT NULL,
            experience_years INTEGER NOT NULL,
            whatsapp_number TEXT NOT NULL,
            vtc_license_number TEXT NOT NULL,
            verification_status TEXT DEFAULT 'pending',
            avg_rating REAL DEFAULT 0,
            review_count INTEGER DEFAULT 0,
            is_available INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            worker_id INTEGER NOT NULL,
            customer_id INTEGER NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (worker_id) REFERENCES workers(id),
            FOREIGN KEY (customer_id) REFERENCES users(id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            worker_id INTEGER NOT NULL,
            customer_id INTEGER NOT NULL,
            service_description TEXT NOT NULL,
            payment_method TEXT NOT NULL DEFAULT 'cash',
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (worker_id) REFERENCES workers(id),
            FOREIGN KEY (customer_id) REFERENCES users(id)
        )
    ''')

    db.commit()
    db.close()

@app.before_request
def before_request():
    if not os.path.exists(DATABASE):
        init_db()

@app.route('/api/auth/register-customer', methods=['POST'])
def register_customer():
    data = request.get_json()

    if not data or not all(k in data for k in ['email', 'password', 'name', 'phone']):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        db = get_db()
        cursor = db.cursor()

        password_hash = generate_password_hash(data['password'])
        cursor.execute(
            'INSERT INTO users (email, password_hash, name, phone, user_type) VALUES (%s, %s, %s, %s, %s)',
            (data['email'], password_hash, data['name'], data['phone'], 'customer')
        )
        db.commit()
        user_id = cursor.lastrowid

        user = cursor.execute(sql('SELECT * FROM users WHERE id = %s'), (user_id,)).fetchone()
        db.close()

        access_token = create_access_token(identity=user_id)

        return jsonify({
            'message': 'Customer registered successfully',
            'token': access_token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': user['name'],
                'user_type': user['user_type']
            }
        }), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/register-worker', methods=['POST'])
def register_worker():
    data = request.get_json()

    required = ['email', 'password', 'name', 'phone', 'category', 'bio', 'location', 'experience_years', 'whatsapp_number', 'vtc_license_number']
    if not data or not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        db = get_db()
        cursor = db.cursor()

        password_hash = generate_password_hash(data['password'])
        cursor.execute(
            'INSERT INTO users (email, password_hash, name, phone, user_type) VALUES (%s, %s, %s, %s, %s)',
            (data['email'], password_hash, data['name'], data['phone'], 'worker')
        )
        db.commit()
        user_id = cursor.lastrowid

        cursor.execute(
            '''INSERT INTO workers (user_id, category, bio, location, experience_years, whatsapp_number, vtc_license_number)
               VALUES (%s, %s, %s, %s, %s, %s, %s)''',
            (user_id, data['category'], data['bio'], data['location'], int(data['experience_years']), data['whatsapp_number'], data['vtc_license_number'])
        )
        db.commit()

        user = cursor.execute(sql('SELECT * FROM users WHERE id = %s'), (user_id,)).fetchone()
        db.close()

        access_token = create_access_token(identity=user_id)

        return jsonify({
            'message': 'Worker registered successfully',
            'token': access_token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': user['name'],
                'user_type': user['user_type']
            }
        }), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Missing email or password'}), 400

    try:
        db = get_db()
        cursor = db.cursor()

        user = cursor.execute(sql('SELECT * FROM users WHERE email = %s'), (data['email'],)).fetchone()

        if not user or not check_password_hash(user['password_hash'], data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401

        access_token = create_access_token(identity=user['id'])

        db.close()

        return jsonify({
            'token': access_token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': user['name'],
                'user_type': user['user_type']
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    try:
        user_id = get_jwt_identity()
        db = get_db()
        cursor = db.cursor()

        user = cursor.execute(sql('SELECT * FROM users WHERE id = %s'), (user_id,)).fetchone()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        response = {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'phone': user['phone'],
            'user_type': user['user_type']
        }

        if user['user_type'] == 'worker':
            worker = cursor.execute(sql('SELECT * FROM workers WHERE user_id = %s'), (user_id,)).fetchone()
            if worker:
                response['worker'] = {
                    'id': worker['id'],
                    'category': worker['category'],
                    'bio': worker['bio'],
                    'location': worker['location'],
                    'experience_years': worker['experience_years'],
                    'whatsapp_number': worker['whatsapp_number'],
                    'vtc_license_number': worker['vtc_license_number'],
                    'verification_status': worker['verification_status'],
                    'avg_rating': worker['avg_rating'],
                    'review_count': worker['review_count'],
                    'is_available': worker['is_available']
                }

        db.close()
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workers', methods=['GET'])
def get_workers():
    try:
        db = get_db()
        cursor = db.cursor()

        category = request.args.get('category')
        location = request.args.get('location')
        min_rating = request.args.get('min_rating', type=float)
        search = request.args.get('search')

        query = 'SELECT w.*, u.name, u.email FROM workers w JOIN users u ON w.user_id = u.id WHERE w.verification_status = %s'
        params = ['verified']

        if category:
            query += ' AND w.category = %s'
            params.append(category)

        if location:
            query += ' AND w.location = %s'
            params.append(location)

        if min_rating is not None:
            query += ' AND w.avg_rating >= %s'
            params.append(min_rating)

        if search:
            query += ' AND (u.name LIKE %s OR w.bio LIKE %s)'
            search_term = f'%{search}%'
            params.extend([search_term, search_term])

        workers = cursor.execute(query, params).fetchall()

        result = []
        for worker in workers:
            result.append({
                'id': worker['id'],
                'name': worker['name'],
                'email': worker['email'],
                'category': worker['category'],
                'bio': worker['bio'],
                'location': worker['location'],
                'experience_years': worker['experience_years'],
                'whatsapp_number': worker['whatsapp_number'],
                'avg_rating': worker['avg_rating'],
                'review_count': worker['review_count'],
                'is_available': worker['is_available'],
                'verification_status': worker['verification_status'],
                'user_id': worker['user_id']
            })

        db.close()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workers/<int:worker_id>', methods=['GET'])
def get_worker(worker_id):
    try:
        db = get_db()
        cursor = db.cursor()

        worker = cursor.execute(
            'SELECT w.*, u.name, u.email, u.phone FROM workers w JOIN users u ON w.user_id = u.id WHERE w.id = %s',
            (worker_id,)
        ).fetchone()

        if not worker:
            return jsonify({'error': 'Worker not found'}), 404

        reviews = cursor.execute(
            'SELECT r.*, u.name FROM reviews r JOIN users u ON r.customer_id = u.id WHERE r.worker_id = %s ORDER BY r.created_at DESC',
            (worker_id,)
        ).fetchall()

        db.close()

        return jsonify({
            'id': worker['id'],
            'name': worker['name'],
            'email': worker['email'],
            'phone': worker['phone'],
            'category': worker['category'],
            'bio': worker['bio'],
            'location': worker['location'],
            'experience_years': worker['experience_years'],
            'whatsapp_number': worker['whatsapp_number'],
            'avg_rating': worker['avg_rating'],
            'review_count': worker['review_count'],
            'is_available': worker['is_available'],
            'verification_status': worker['verification_status'],
            'user_id': worker['user_id'],
            'reviews': [
                {
                    'id': r['id'],
                    'customer_name': r['name'],
                    'rating': r['rating'],
                    'comment': r['comment'],
                    'created_at': r['created_at']
                } for r in reviews
            ]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reviews', methods=['POST'])
@jwt_required()
def create_review():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or not all(k in data for k in ['worker_id', 'rating', 'comment']):
            return jsonify({'error': 'Missing required fields'}), 400

        rating = int(data['rating'])
        if rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400

        db = get_db()
        cursor = db.cursor()

        user = cursor.execute(sql('SELECT user_type FROM users WHERE id = %s'), (user_id,)).fetchone()
        if not user or user['user_type'] != 'customer':
            return jsonify({'error': 'Only customers can leave reviews'}), 403

        worker = cursor.execute(sql('SELECT * FROM workers WHERE id = %s'), (data['worker_id'],)).fetchone()
        if not worker:
            return jsonify({'error': 'Worker not found'}), 404

        cursor.execute(
            'INSERT INTO reviews (worker_id, customer_id, rating, comment) VALUES (%s, %s, %s, %s)',
            (data['worker_id'], user_id, rating, data['comment'])
        )
        db.commit()

        all_reviews = cursor.execute(
            'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE worker_id = %s',
            (data['worker_id'],)
        ).fetchone()

        new_avg = all_reviews['avg_rating']
        new_count = all_reviews['count']

        cursor.execute(
            'UPDATE workers SET avg_rating = %s, review_count = %s WHERE id = %s',
            (round(new_avg, 2), new_count, data['worker_id'])
        )
        db.commit()

        review_id = cursor.lastrowid
        db.close()

        return jsonify({
            'id': review_id,
            'message': 'Review created successfully'
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or not all(k in data for k in ['worker_id', 'service_description', 'payment_method']):
            return jsonify({'error': 'Missing required fields'}), 400

        db = get_db()
        cursor = db.cursor()

        user = cursor.execute(sql('SELECT user_type FROM users WHERE id = %s'), (user_id,)).fetchone()
        if not user or user['user_type'] != 'customer':
            return jsonify({'error': 'Only customers can create bookings'}), 403

        worker = cursor.execute(sql('SELECT * FROM workers WHERE id = %s'), (data['worker_id'],)).fetchone()
        if not worker:
            return jsonify({'error': 'Worker not found'}), 404

        cursor.execute(
            'INSERT INTO bookings (worker_id, customer_id, service_description, payment_method) VALUES (%s, %s, %s, %s)',
            (data['worker_id'], user_id, data['service_description'], data['payment_method'])
        )
        db.commit()
        booking_id = cursor.lastrowid
        db.close()

        return jsonify({
            'id': booking_id,
            'message': 'Booking created successfully'
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['GET'])
@jwt_required()
def get_bookings():
    try:
        user_id = get_jwt_identity()
        db = get_db()
        cursor = db.cursor()

        bookings = cursor.execute(
            '''SELECT b.*, u.name as worker_name, w.category, w.location
               FROM bookings b
               JOIN workers w ON b.worker_id = w.id
               JOIN users u ON w.user_id = u.id
               WHERE b.customer_id = %s OR b.worker_id IN (SELECT id FROM workers WHERE user_id = %s)
               ORDER BY b.created_at DESC''',
            (user_id, user_id)
        ).fetchall()

        db.close()

        return jsonify([
            {
                'id': b['id'],
                'worker_id': b['worker_id'],
                'customer_id': b['customer_id'],
                'worker_name': b['worker_name'],
                'category': b['category'],
                'location': b['location'],
                'service_description': b['service_description'],
                'payment_method': b['payment_method'],
                'status': b['status'],
                'created_at': b['created_at']
            } for b in bookings
        ]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/workers/pending', methods=['GET'])
@jwt_required()
def get_pending_workers():
    try:
        user_id = get_jwt_identity()
        db = get_db()
        cursor = db.cursor()

        admin_user = cursor.execute(sql('SELECT user_type FROM users WHERE id = %s'), (user_id,)).fetchone()
        if not admin_user or admin_user['user_type'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403

        workers = cursor.execute(
            'SELECT w.*, u.name, u.email FROM workers w JOIN users u ON w.user_id = u.id WHERE w.verification_status = %s ORDER BY w.created_at ASC',
            ('pending',)
        ).fetchall()

        db.close()

        return jsonify([
            {
                'id': w['id'],
                'user_id': w['user_id'],
                'name': w['name'],
                'email': w['email'],
                'category': w['category'],
                'location': w['location'],
                'vtc_license_number': w['vtc_license_number'],
                'created_at': w['created_at'],
                'bio': w['bio']
            } for w in workers
        ]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/workers/<int:worker_id>/verify', methods=['PUT'])
@jwt_required()
def verify_worker(worker_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or 'status' not in data:
            return jsonify({'error': 'Status field required'}), 400

        if data['status'] not in ['verified', 'rejected']:
            return jsonify({'error': 'Invalid status'}), 400

        db = get_db()
        cursor = db.cursor()

        admin_user = cursor.execute(sql('SELECT user_type FROM users WHERE id = %s'), (user_id,)).fetchone()
        if not admin_user or admin_user['user_type'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403

        worker = cursor.execute(sql('SELECT * FROM workers WHERE id = %s'), (worker_id,)).fetchone()
        if not worker:
            return jsonify({'error': 'Worker not found'}), 404

        cursor.execute(
            'UPDATE workers SET verification_status = %s WHERE id = %s',
            (data['status'], worker_id)
        )
        db.commit()
        db.close()

        return jsonify({
            'message': f'Worker verification status updated to {data["status"]}'
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)
