# حرفي (Hirafi) - TaskRabbit-Style Platform for Jordan

A fully functional web application connecting customers with skilled tradespeople in Jordan. Built with Python Flask backend and React frontend.

## Features

- **Worker Listings**: Browse verified workers by category and location
- **User Authentication**: Customer and worker registration and login
- **Worker Profiles**: Detailed profiles with ratings, reviews, and experience
- **Review System**: Customers can leave ratings and reviews
- **Admin Panel**: Verify and manage worker applications
- **Bilingual**: Full Arabic/English support with RTL/LTR
- **Mobile-First**: Responsive design for all devices
- **WhatsApp Integration**: Direct contact with workers

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt --break-system-packages
python seed.py
python app.py
```

Backend runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` with API proxy to backend

## Project Structure

```
hirafi/
├── backend/
│   ├── app.py           # Flask REST API
│   ├── seed.py          # Sample data generation
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── App.jsx       # Main app component
    │   ├── i18n.js       # Translation system
    │   └── index.css     # Global styles
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Database

SQLite database with tables:
- `users` - Customer and worker accounts
- `workers` - Worker profiles and details
- `reviews` - Customer reviews
- `bookings` - Service bookings

## API Endpoints

### Authentication
- `POST /api/auth/register-customer`
- `POST /api/auth/register-worker`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Workers
- `GET /api/workers` - List workers with filters
- `GET /api/workers/:id` - Worker profile and reviews

### Reviews
- `POST /api/reviews` - Submit review (JWT protected)

### Bookings
- `POST /api/bookings` - Create booking (JWT protected)
- `GET /api/bookings` - Get user's bookings (JWT protected)

### Admin
- `GET /api/admin/workers/pending` - Pending verification (admin only)
- `PUT /api/admin/workers/:id/verify` - Approve/reject worker (admin only)

## Test Credentials

**Admin:**
- Email: admin@hirafi.jo
- Password: admin123

**Sample Customer:**
- Email: customer1@example.com
- Password: pass123

**Sample Worker:**
- Email: ali.plumber@hirafi.jo
- Password: pass123

## Design System

**Colors:**
- Green Primary: #1B4332
- Gold Accent: #C9A84C
- Cream Background: #FAF8F5

**Typography:**
- Font: Cairo (Google Fonts)
- Responsive sizing from 13px base

**Mobile First:**
- Optimized for 375px width
- Responsive breakpoints at 768px

## Languages

- Arabic (RTL) - Default
- English (LTR)

Language toggle in navbar to switch between Arabic and English.

## Jordanian Service Categories

1. سباكة (Plumbing) 🔧
2. كهرباء (Electrical) ⚡
3. تكييف (AC & HVAC) ❄️
4. نجارة (Carpentry) 🪵
5. دهانات (Painting) 🖌️
6. تنظيف (Cleaning) 🧹
7. صيانة مسابح (Pool Maintenance) 🏊
8. صيانة عامة (General Maintenance) 🔨

## Jordanian Locations

Amman areas plus Zarqa, Irbid, Aqaba, and Salt

## Notes

- All data is stored in SQLite (hirafi.db)
- JWT tokens stored in localStorage (30-day expiration)
- Passwords hashed with werkzeug.security
- CORS enabled for development
- All forms validate on both frontend and backend

## License

© 2024 Hirafi. All rights reserved.
