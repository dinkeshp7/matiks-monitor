from sqlalchemy import func
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from jose import jwt

from db import SessionLocal
from models import Mention, Review
from auth import verify, create_token, SECRET_KEY

security = HTTPBearer()

app = FastAPI()

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def map_sentiment(label):
    if label == "LABEL_2":
        return "positive"
    if label == "LABEL_1":
        return "neutral"
    return "negative"

# -------------------- AUTH VERIFY --------------------
def verify_token(credentials=Depends(security)):
    token = credentials.credentials
    try:
        jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# -------------------- LOGIN --------------------
@app.post("/login")
def login(data: dict):
    username = data.get("username")
    password = data.get("password")

    if not verify(username, password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token()
    return {"token": token}

# -------------------- ROOT --------------------
@app.get("/")
def root():
    return {"status": "running"}

# -------------------- MENTIONS --------------------
@app.get("/mentions", dependencies=[Depends(verify_token)])
def get_mentions(
    platform: str | None = None,
    sentiment: str | None = None,
    search: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None
):
    db = SessionLocal()
    query = db.query(Mention)

    if platform:
        query = query.filter(Mention.platform == platform)

    if sentiment:
        query = query.filter(Mention.sentiment == sentiment)

    if search:
        query = query.filter(Mention.content.ilike(f"%{search}%"))

    if start_date:
        query = query.filter(Mention.timestamp >= datetime.fromisoformat(start_date))

    if end_date:
        query = query.filter(Mention.timestamp <= datetime.fromisoformat(end_date))

    data = query.order_by(Mention.timestamp.desc()).limit(200).all()

    db.close()

    return [{
        "id": m.id,
        "platform": m.platform,
        "author": m.author,
        "content": m.content,
        "timestamp": m.timestamp,
        "sentiment": m.sentiment,
        "score": m.score
    } for m in data]

# -------------------- REVIEWS --------------------
@app.get("/reviews", dependencies=[Depends(verify_token)])
def get_reviews():
    db = SessionLocal()
    data = db.query(Review).limit(50).all()
    db.close()

    return [{
        "id": r.id,
        "source": r.source,
        "rating": r.rating,
        "content": r.content,
        "date": r.date,
        "sentiment": r.sentiment,
        "score": r.score
    } for r in data]

# -------------------- STATS --------------------
@app.get("/stats", dependencies=[Depends(verify_token)])
def get_stats():
    db = SessionLocal()

    sentiment_counts = db.query(
        Mention.sentiment,
        func.count(Mention.id)
    ).group_by(Mention.sentiment).all()

    platform_counts = db.query(
        Mention.platform,
        func.count(Mention.id)
    ).group_by(Mention.platform).all()

    db.close()

    return {
        "sentiment_distribution": dict(sentiment_counts),
        "platform_distribution": dict(platform_counts)
    }


@app.get("/all", dependencies=[Depends(verify_token)])
def get_all():
    db = SessionLocal()

    mentions = db.query(Mention).all()
    reviews = db.query(Review).all()

    db.close()

    return {
        "mentions": [
            {
                "platform": m.platform,
                "content": m.content,
                "sentiment": m.sentiment,
                "timestamp": m.timestamp
            } for m in mentions
        ],
        "reviews": [
            {
                "source": r.source,
                "content": r.content,
                "rating": r.rating,
                "sentiment": r.sentiment,
                "date": r.date
            } for r in reviews
        ]
    }


@app.get("/timeline", dependencies=[Depends(verify_token)])
def timeline():
    db = SessionLocal()

    data = db.query(
        func.date(Review.date),
        func.count(Review.id)
    ).group_by(func.date(Review.date)).all()

    db.close()

    return [{"date": str(d), "count": c} for d, c in data]