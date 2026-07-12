# Mathematics Geek — Merit Score Expert Platform

> Expert math coaching platform for Classes 6-12 (CBSE, ICSE, IB, GCSE, Oxford) by **Aarti Agarwal**. Features Vedic Math mastery, speed calculation games, AI question generation, and WhatsApp bot integration.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **MongoDB** 6.0+ (or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)
- **Docker** (optional, for containerized setup)

### Option 1: Docker (Recommended)

```bash
# Clone and start all services
docker compose up -d

# Seed the database
docker exec math_geek_api python -m database.seed

# Open http://localhost:3000
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Edit with your values
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.local.example .env.local  # Edit with your API URL
npm run dev
```

**Database:**
```bash
# Seed initial data
cd database
python seed.py

# Create indexes
mongosh < indexes.js
```

## 📂 Project Structure

```
Mathematics Geek/
├── frontend/         # Next.js 16 (App Router) — UI & SEO pages
├── backend/          # FastAPI (Python) — API & business logic
├── database/         # Schema docs, seed scripts, index definitions
├── docs/             # API docs, deployment guide, architecture
├── docker-compose.yml
└── .env.example
```

## ✨ Features

| Feature | Status | Description |
|---------|--------|-------------|
| 🏠 **Homepage** | ✅ | Hero, About, Courses, Testimonials, Contact, FAQ |
| 📝 **Blog** | ✅ | SSG blog with categories, tags, search, related posts |
| 🎮 **Games Hub** | ✅ | Speed math games with timer, XP, streaks, leaderboard |
| 🤖 **AI Questions** | ✅ | Algorithmic math question generator (12 topics, 5 levels) |
| 📱 **WhatsApp Bot** | ✅ | Webhook integration for lead capture & math challenges |
| 🔐 **Admin Panel** | ✅ | JWT-protected dashboard for managing content |
| 🔍 **SEO Pages** | ✅ | 22+ programmatic pages (Vedic Math, Tricks, Topics) |
| 📊 **Sitemap** | ✅ | Dynamic XML sitemap + robots.txt |
| 🐳 **Docker** | ✅ | Full docker-compose stack |

## 🌐 Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Lucide Icons
- **Backend**: Python FastAPI, Motor (async MongoDB), Pydantic
- **Database**: MongoDB 6.0
- **Auth**: JWT (HS256) with bcrypt password hashing
- **Deployment**: Vercel (frontend) + Railway/Render (backend) + MongoDB Atlas

## 📖 Documentation

- [API Reference](docs/API.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Database Schema](database/schema.md)

## 🤝 Contact

**Aarti Agarwal** — Mathematics Geek  
📞 +91 9639351708  
📧 aarti0301@gmail.com  
🌐 [mathematicsgeek.com](https://mathematicsgeek.com)
# mail-website
