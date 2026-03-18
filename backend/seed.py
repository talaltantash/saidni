import sqlite3
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

DATABASE = 'hirafi.db'

def init_db(cursor, db):
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
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (worker_id) REFERENCES workers(id),
            FOREIGN KEY (customer_id) REFERENCES users(id)
        )
    ''')
    db.commit()

def seed_database():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    cursor = db.cursor()

    init_db(cursor, db)

    try:
        cursor.execute('DELETE FROM reviews')
        cursor.execute('DELETE FROM bookings')
        cursor.execute('DELETE FROM workers')
        cursor.execute('DELETE FROM users')
        db.commit()
    except:
        pass

    admin_user = {
        'email': 'admin@hirafi.jo',
        'password': generate_password_hash('admin123'),
        'name': 'مسؤول النظام',
        'phone': '+962791234567',
        'user_type': 'admin'
    }

    cursor.execute(
        'INSERT INTO users (email, password_hash, name, phone, user_type) VALUES (?, ?, ?, ?, ?)',
        (admin_user['email'], admin_user['password'], admin_user['name'], admin_user['phone'], admin_user['user_type'])
    )
    db.commit()

    customers = [
        {'email': 'customer1@example.com', 'password': 'pass123', 'name': 'محمد علي', 'phone': '+962791111111', 'user_type': 'customer'},
        {'email': 'customer2@example.com', 'password': 'pass123', 'name': 'فاطمة أحمد', 'phone': '+962792222222', 'user_type': 'customer'},
        {'email': 'customer3@example.com', 'password': 'pass123', 'name': 'عمر خليل', 'phone': '+962793333333', 'user_type': 'customer'},
    ]

    customer_ids = []
    for customer in customers:
        password_hash = generate_password_hash(customer['password'])
        cursor.execute(
            'INSERT INTO users (email, password_hash, name, phone, user_type) VALUES (?, ?, ?, ?, ?)',
            (customer['email'], password_hash, customer['name'], customer['phone'], customer['user_type'])
        )
        db.commit()
        customer_ids.append(cursor.lastrowid)

    workers_data = [
        {
            'name': 'علي محمود السباك',
            'email': 'ali.plumber@hirafi.jo',
            'password': 'pass123',
            'phone': '+962799988877',
            'category': 'سباكة',
            'bio': 'سباك محترف مع خبرة 15 سنة في إصلاح وتركيب الأنابيب والتجهيزات الصحية',
            'location': 'عمّان - الشميساني',
            'experience_years': 15,
            'whatsapp': '+962799988877',
            'vtc': 'VTC-SB-2024-001',
            'status': 'verified'
        },
        {
            'name': 'سارة كهربائي',
            'email': 'sarah.electric@hirafi.jo',
            'password': 'pass123',
            'phone': '+962798877766',
            'category': 'كهرباء',
            'bio': 'فنية كهربائية معتمدة متخصصة في التركيبات والصيانة والإصلاحات الكهربائية',
            'location': 'عمّان - دابوق',
            'experience_years': 10,
            'whatsapp': '+962798877766',
            'vtc': 'VTC-EL-2024-002',
            'status': 'verified'
        },
        {
            'name': 'يوسف النجار',
            'email': 'youssef.carpenter@hirafi.jo',
            'password': 'pass123',
            'phone': '+962797766655',
            'category': 'نجارة',
            'bio': 'نجار ماهر متخصص في الأثاث والديكورات والتركيبات الخشبية',
            'location': 'عمّان - الدوار السابع',
            'experience_years': 12,
            'whatsapp': '+962797766655',
            'vtc': 'VTC-CA-2024-003',
            'status': 'verified'
        },
        {
            'name': 'نور الدهان',
            'email': 'nour.painter@hirafi.jo',
            'password': 'pass123',
            'phone': '+962796655544',
            'category': 'دهانات',
            'bio': 'دهان متخصص في الدهانات الداخلية والخارجية مع خبرة في التشطيبات الحديثة',
            'location': 'عمّان - العبدلي',
            'experience_years': 8,
            'whatsapp': '+962796655544',
            'vtc': 'VTC-PA-2024-004',
            'status': 'verified'
        },
        {
            'name': 'عبدالرحمن كهرباء الهواء',
            'email': 'abdulrahman.ac@hirafi.jo',
            'password': 'pass123',
            'phone': '+962795544433',
            'category': 'تكييف',
            'bio': 'متخصص في تركيب وصيانة أنظمة التكييف والتهوية مع ضمان الجودة',
            'location': 'عمّان - الرابية',
            'experience_years': 14,
            'whatsapp': '+962795544433',
            'vtc': 'VTC-AC-2024-005',
            'status': 'verified'
        },
        {
            'name': 'ليلى النظافة',
            'email': 'layla.cleaning@hirafi.jo',
            'password': 'pass123',
            'phone': '+962794433322',
            'category': 'تنظيف',
            'bio': 'متخصصة في التنظيف الشامل والعميق للمنازل والمكاتب مع استخدام منتجات آمنة',
            'location': 'عمّان - خلدا',
            'experience_years': 9,
            'whatsapp': '+962794433322',
            'vtc': 'VTC-CL-2024-006',
            'status': 'verified'
        },
        {
            'name': 'محمود صيانة المسابح',
            'email': 'mahmoud.pool@hirafi.jo',
            'password': 'pass123',
            'phone': '+962793322211',
            'category': 'صيانة مسابح',
            'bio': 'متخصص في صيانة وتنظيف وإصلاح المسابح مع المعالجة الكيميائية الآمنة',
            'location': 'عمّان - الجاردنز',
            'experience_years': 11,
            'whatsapp': '+962793322211',
            'vtc': 'VTC-PL-2024-007',
            'status': 'verified'
        },
        {
            'name': 'خالد الصيانة العامة',
            'email': 'khaled.maintenance@hirafi.jo',
            'password': 'pass123',
            'phone': '+962792211000',
            'category': 'صيانة عامة',
            'bio': 'فني صيانة عام متعدد المهارات يقدم خدمات شاملة للصيانة والإصلاح',
            'location': 'الزرقاء',
            'experience_years': 13,
            'whatsapp': '+962792211000',
            'vtc': 'VTC-GM-2024-008',
            'status': 'pending'
        },
        {
            'name': 'رشا السباكة المتخصصة',
            'email': 'rasha.plumb@hirafi.jo',
            'password': 'pass123',
            'phone': '+962791009998',
            'category': 'سباكة',
            'bio': 'سباكة متخصصة في الأنظمة الحديثة والصيانة الدورية',
            'location': 'إربد',
            'experience_years': 7,
            'whatsapp': '+962791009998',
            'vtc': 'VTC-SB-2024-009',
            'status': 'pending'
        },
        {
            'name': 'إبراهيم الكهربائي المميز',
            'email': 'ibrahim.elec@hirafi.jo',
            'password': 'pass123',
            'phone': '+962790008887',
            'category': 'كهرباء',
            'bio': 'مهندس كهربائي معتمد مع خبرة عالية في المشاريع الكبيرة والصغيرة',
            'location': 'العقبة',
            'experience_years': 16,
            'whatsapp': '+962790008887',
            'vtc': 'VTC-EL-2024-010',
            'status': 'verified'
        }
    ]

    worker_ids = []
    for worker_data in workers_data:
        password_hash = generate_password_hash(worker_data['password'])
        cursor.execute(
            'INSERT INTO users (email, password_hash, name, phone, user_type) VALUES (?, ?, ?, ?, ?)',
            (worker_data['email'], password_hash, worker_data['name'], worker_data['phone'], 'worker')
        )
        db.commit()
        user_id = cursor.lastrowid

        cursor.execute(
            '''INSERT INTO workers (user_id, category, bio, location, experience_years, whatsapp_number, vtc_license_number, verification_status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
            (user_id, worker_data['category'], worker_data['bio'], worker_data['location'], worker_data['experience_years'], worker_data['whatsapp'], worker_data['vtc'], worker_data['status'])
        )
        db.commit()
        worker_ids.append(cursor.lastrowid)

    reviews_data = [
        {'worker_id': 1, 'customer_id': 1, 'rating': 5, 'comment': 'عمل ممتاز وسريع جداً! شكراً لك يا علي'},
        {'worker_id': 1, 'customer_id': 2, 'rating': 5, 'comment': 'سباك محترف وموثوق، أنصح به لكل من يحتاج خدمات سباكة'},
        {'worker_id': 1, 'customer_id': 3, 'rating': 4, 'comment': 'خدمة جيدة جداً، قام بالعمل بكفاءة عالية'},
        {'worker_id': 2, 'customer_id': 1, 'rating': 5, 'comment': 'فنية كهربائية ممتازة، تعرف عملها جيداً'},
        {'worker_id': 2, 'customer_id': 3, 'rating': 5, 'comment': 'عمل احترافي وآمن، شعرت بالثقة معها'},
        {'worker_id': 3, 'customer_id': 2, 'rating': 4, 'comment': 'نجار ماهر جداً، النتائج رائعة'},
        {'worker_id': 4, 'customer_id': 1, 'rating': 5, 'comment': 'الدهان رائع، جعل المنزل يبدو جميلاً'},
        {'worker_id': 4, 'customer_id': 3, 'rating': 4, 'comment': 'خدمة احترافية وتنظيف ممتاز بعد الانتهاء'},
        {'worker_id': 5, 'customer_id': 2, 'rating': 5, 'comment': 'تكييف مثبت بشكل احترافي وآمن جداً'},
        {'worker_id': 6, 'customer_id': 1, 'rating': 5, 'comment': 'نظافة احترافية جداً، المنزل صار براق'},
        {'worker_id': 10, 'customer_id': 3, 'rating': 5, 'comment': 'كهربائي ممتاز جداً، خبرة واسعة وعمل دقيق'},
    ]

    for review in reviews_data:
        cursor.execute(
            'INSERT INTO reviews (worker_id, customer_id, rating, comment) VALUES (?, ?, ?, ?)',
            (review['worker_id'], review['customer_id'], review['rating'], review['comment'])
        )
        db.commit()

    for worker_id in [1, 2, 3, 4, 5, 6, 10]:
        avg_rating = cursor.execute(
            'SELECT AVG(rating) as avg FROM reviews WHERE worker_id = ?',
            (worker_id,)
        ).fetchone()['avg']
        count = cursor.execute(
            'SELECT COUNT(*) as cnt FROM reviews WHERE worker_id = ?',
            (worker_id,)
        ).fetchone()['cnt']

        cursor.execute(
            'UPDATE workers SET avg_rating = ?, review_count = ? WHERE id = ?',
            (round(avg_rating, 2), count, worker_id)
        )
        db.commit()

    db.close()
    print("✓ Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
