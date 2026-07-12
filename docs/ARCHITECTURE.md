# Architecture Overview — Mathematics Geek Platform

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│                                                              │
│  ┌─────────────────────────┐   ┌──────────────────────────┐ │
│  │   Next.js 16 Frontend   │   │    WhatsApp Business     │ │
│  │   (App Router / SSR)    │   │    (Webhook Integration) │ │
│  │                         │   │                          │ │
│  │  • Homepage + SEO pages │   │  • Automated responses   │ │
│  │  • Blog (SSG)           │   │  • Lead capture          │ │
│  │  • Games Hub            │   │  • Quick math challenges │ │
│  │  • Admin Dashboard      │   │                          │ │
│  └────────────┬────────────┘   └───────────┬──────────────┘ │
└───────────────┼────────────────────────────┼────────────────┘
                │  REST API (JSON)           │  Webhook
                ▼                            ▼
┌──────────────────────────────────────────────────────────────┐
│                        API LAYER                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              FastAPI Application (Python)              │   │
│  │                                                        │   │
│  │  Routes:                    Services:                  │   │
│  │  ├── /api/auth/*           ├── game_engine.py         │   │
│  │  ├── /api/demo-inquiry     ├── question_generator.py  │   │
│  │  ├── /api/testimonials     ├── whatsapp_bot.py        │   │
│  │  ├── /api/blog/*           └── lead_service (inline)  │   │
│  │  ├── /api/games/*                                      │   │
│  │  ├── /api/questions/*      Utils:                      │   │
│  │  ├── /api/seo/*            ├── security.py (JWT)      │   │
│  │  ├── /api/whatsapp/*       └── seo.py                 │   │
│  │  └── /api/admin/*                                      │   │
│  └──────────────────────┬───────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │  Motor (async)
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MongoDB (Atlas / Docker)                   │   │
│  │                                                        │   │
│  │  Collections:                                          │   │
│  │  ├── users              ├── game_sessions             │   │
│  │  ├── leads              ├── questions                 │   │
│  │  ├── blog_posts         ├── user_progress             │   │
│  │  ├── testimonials       ├── whatsapp_conversations    │   │
│  │  └── game_templates                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend (Next.js 16)

| Component | Type | Purpose |
|-----------|------|---------|
| `layout.tsx` | Server | Root layout with fonts, metadata, SEO defaults |
| `page.tsx` | Server | Homepage — assembles Hero, About, Courses, etc. |
| `blog/page.tsx` | Client | Blog listing with search, category filter |
| `blog/[slug]/page.tsx` | Client | Individual blog post with related posts |
| `games/page.tsx` | Client | Game hub with templates, nickname setup, leaderboard |
| `games/[id]/page.tsx` | Client | Game arena with timer, questions, scoring |
| `admin/page.tsx` | Client | Teacher dashboard (JWT-protected) |
| `vedic-math/[classId]` | Server (SSG) | Programmatic SEO — Vedic math by class |
| `math-tricks/[classId]` | Server (SSG) | Programmatic SEO — math tricks by class |
| `topics/[topic]` | Server (SSG) | Topic cluster pages for SEO |
| `sitemap.ts` | Server | Dynamic XML sitemap generation |
| `robots.ts` | Server | Dynamic robots.txt |

### Backend (FastAPI)

| Module | File | Responsibility |
|--------|------|---------------|
| **Entry** | `main.py` | App factory, CORS, router registration, lifespan |
| **Config** | `config.py` | Pydantic Settings for all env vars |
| **Database** | `database.py` | Async MongoDB connection with Motor |
| **Auth** | `routes/auth.py` | JWT login, token generation |
| **Inquiries** | `routes/inquiries.py` | Lead CRUD, status management |
| **Testimonials** | `routes/testimonials.py` | Submit, approve, delete reviews |
| **Blog** | `routes/blog.py` | CRUD for blog posts, categories |
| **Games** | `routes/games.py` | Templates, sessions, leaderboard |
| **Questions** | `routes/questions.py` | AI question generation endpoint |
| **WhatsApp** | `routes/whatsapp.py` | Webhook for WhatsApp Business API |
| **SEO** | `routes/seo.py` | Sitemap XML, JSON-LD schemas |
| **Security** | `utils/security.py` | Password hashing, JWT encode/decode |

### Services Layer

| Service | Purpose |
|---------|---------|
| `game_engine.py` | Game session management, scoring, XP, streaks |
| `question_generator.py` | Algorithmic math question generation (12 topics, 5 difficulty levels) |
| `whatsapp_bot.py` | Conversation state machine for WhatsApp interactions |

## Authentication Flow

```
User (Admin) → POST /api/auth/login { username, password }
                    │
                    ▼
              Verify credentials (bcrypt)
                    │
                    ▼
              Generate JWT token (HS256, 24h expiry)
                    │
                    ▼
              Return { access_token, token_type }
                    │
                    ▼
Frontend stores in localStorage → sends as Bearer token
```

## Game Session Flow

```
Player selects template → POST /api/games/start
         │
         ▼
   Server creates session + generates questions
         │
         ▼
   Player answers → POST /api/games/answer (per question)
         │                    │
         ▼                    ▼
   Track streak         Calculate score
         │                    │
         ▼                    ▼
   All answered → POST /api/games/complete/{session_id}
         │
         ▼
   Calculate XP, update progress, return results
         │
         ▼
   GET /api/games/leaderboard → global rankings
```

## SEO Strategy

- **Programmatic SEO**: 7 Vedic Math pages + 7 Math Tricks pages + 8 Topic pages = 22 unique landing pages
- **Blog**: Seed with 30+ posts covering exam tips, tricks, and study strategies
- **JSON-LD**: Course, HowTo, Organization, Article, FAQ, BreadcrumbList schemas
- **Dynamic sitemap**: Auto-generates from all routes and content
- **Core Web Vitals**: Server components, image optimization, code splitting

## Deployment Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Vercel CDN    │     │  Railway/Render  │     │  MongoDB Atlas   │
│   (Frontend)     │────▶│   (Backend API)  │────▶│   (Database)     │
│                  │     │                  │     │                  │
│  • Next.js SSR   │     │  • FastAPI       │     │  • Free Tier     │
│  • Edge caching  │     │  • Docker        │     │  • Auto-scaling  │
│  • Auto HTTPS    │     │  • Auto-deploy   │     │  • Backups       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Environment Variables

| Variable | Used By | Purpose |
|----------|---------|---------|
| `MONGODB_URL` | Backend | MongoDB connection string |
| `DB_NAME` | Backend | Database name |
| `JWT_SECRET` | Backend | Token signing key |
| `ADMIN_USERNAME` | Backend | Default admin username |
| `ADMIN_PASSWORD` | Backend | Default admin password (hashed) |
| `WHATSAPP_TOKEN` | Backend | WhatsApp Business API token |
| `WHATSAPP_VERIFY_TOKEN` | Backend | Webhook verification token |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API base URL |
