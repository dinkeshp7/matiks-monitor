# Matiks Brand Monitor

AI-powered reputation and sentiment monitoring system for the Matiks app.

This project tracks public perception of the product across platforms (Play Store, App Store, and optionally Reddit), analyzes sentiment using NLP, stores structured data in PostgreSQL, and visualizes insights through a FastAPI backend and modern dashboard.

Built to demonstrate full-stack + AI system ownership:  
data collection → processing → analytics → dashboard.

---

## Overview

The system continuously collects user reviews and mentions, processes them with a sentiment model, stores results in a database, and exposes analytics via API endpoints and a frontend dashboard.

It helps answer:

- What are users saying about the product?
- Is sentiment improving or declining?
- Which keywords appear most often?
- Where are mentions coming from?

---

## Tech Stack

### Backend
- FastAPI
- PostgreSQL (Supabase)
- SQLAlchemy ORM
- HuggingFace Transformers (RoBERTa sentiment model)
- Tenacity (retry logic)
- Python scraping scripts

### Frontend
- Next.js 14 (App Router)
- Tailwind CSS
- React Query
- Framer Motion
- Axios

### Data Sources
- Google Play Store reviews
- Apple App Store reviews
- Reddit mentions (optional)

---

## Architecture
Scrapers → Sentiment Model → PostgreSQL → FastAPI → Next.js Dashboard


**Flow:**
1. Scrapers fetch reviews/mentions
2. Text sent to sentiment model
3. Stored in database
4. FastAPI exposes analytics
5. Dashboard visualizes metrics

---

## Project Structure
matiks-monitor/
│
├── backend/
│ ├── app.py
│ ├── db.py
│ ├── models.py
│ ├── sentiment.py
│ ├── insert_mentions.py
│ ├── init_db.py
│ ├── logger.py
│ └── test_insert.py
│
├── scripts/
│ ├── playstore_scraper.py
│ ├── appstore_scraper.py
│ ├── reddit_brand_scraper.py
│ └── run_all.py
│
├── frontend/
│ └── Next.js dashboard
│
├── requirements.txt
└── README.md


---

## Setup

### 1. Clone repository


git clone <repo>
cd matiks-monitor


---

### 2. Backend Setup

Create virtual environment:


python -m venv venv
venv\Scripts\activate


Install dependencies:


pip install -r requirements.txt


Create `.env` in root:


DATABASE_URL=postgresql://YOUR_DB_URL
PLAYSTORE_APP_ID=com.matiks.app
APPSTORE_APP_ID=6738620563
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=


Initialize database tables:


python -m backend.init_db


Run backend:


uvicorn backend.app:app --reload


Backend runs at:

http://127.0.0.1:8000


---

### 3. Run Scrapers

Fetch reviews and store in DB:


python -m scripts.run_all


This will:
- fetch reviews
- run sentiment model
- insert into database
- log pipeline output

---

### 4. Frontend Setup


cd frontend
npm install
npm run dev


Create `.env.local` inside frontend:


NEXT_PUBLIC_API_URL=http://127.0.0.1:8000


Open:

http://localhost:3000


---

## API Endpoints

| Endpoint | Purpose |
|---------|--------|
| `/login` | Auth |
| `/mentions` | List mentions |
| `/stats` | Overall stats |
| `/keyword_stats` | Keyword counts |
| `/timeline` | Time trend |

All dashboard routes require JWT login.

---

## Features

- Automated review scraping
- NLP sentiment classification
- Keyword tracking
- Time-series analysis
- Dashboard analytics
- JWT authentication
- Retry + logging system
- Deduplication logic

---

## Current Status

Working:
- Play Store scraper
- App Store scraper
- Sentiment pipeline
- PostgreSQL storage
- FastAPI analytics
- Dashboard UI

Optional:
- Reddit scraper
- Deployment
- Alert system
- AI insights layer

---

## Run Order (quick start)

Start backend:

uvicorn backend.app:app --reload


Run pipeline:

python -m scripts.run_all


Start frontend:

cd frontend
npm run dev


---

## Future Improvements

- AI-generated insights summary
- Daily report system
- Slack/email alerts
- Deployment (Vercel + Railway)
- Founder/brand tracking
- Semantic clustering
- Real-time cron jobs

---

## Author

Dinkesh Pal  
IIT Guwahati — Mathematics & Computing  

Focused on full-stack systems, AI pipelines, and Web3 infrastructure.