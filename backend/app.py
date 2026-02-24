from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.db import get_db
from sqlalchemy import func
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from jose import jwt

from backend.db import SessionLocal
from backend.models import Mention, Review
from backend.auth import verify, create_token, SECRET_KEY
from backend.routers.analytics import router as analytics_router

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

app.include_router(analytics_router)

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
    except Exception:
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
@app.get("/mentions/", dependencies=[Depends(verify_token)])
def get_mentions(
    platform: str | None = None,
    sentiment: str | None = None,
    search: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None
):
    db = SessionLocal()
    try:
        query = db.query(Mention)

        if platform:
            query = query.filter(Mention.platform == platform)

        if sentiment:
            query = query.filter(Mention.sentiment == sentiment)

        if search:
            query = query.filter(Mention.content.ilike(f"%{search}%"))

        if start_date:
            try:
                start = datetime.fromisoformat(start_date)
                query = query.filter(Mention.timestamp >= start)
            except:
                pass

        if end_date:
            try:
                end = datetime.fromisoformat(end_date)
                query = query.filter(Mention.timestamp <= end)
            except:
                pass

        data = query.order_by(Mention.timestamp.desc()).limit(200).all()

        return [
            {
                "id": m.id,
                "platform": m.platform,
                "keyword": m.keyword,
                "author": m.author,
                "content": m.content,
                "timestamp": m.timestamp,
                "sentiment": m.sentiment,
                "score": m.score
            }
            for m in data
        ]

    finally:
        db.close()
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
    try:
        sentiment_counts = db.query(
            Mention.sentiment,
            func.count(Mention.id)
        ).group_by(Mention.sentiment).all()
        platform_counts = db.query(
            Mention.platform,
            func.count(Mention.id)
        ).group_by(Mention.platform).all()

        total_mentions = sum(c for _, c in platform_counts)
        total_reviews = db.query(func.count(Review.id)).scalar() or 0
        total_all = total_mentions + total_reviews

        now = datetime.utcnow()
        last_24h = now - timedelta(hours=24)
        mentions_24h = db.query(func.count(Mention.id)).filter(
            Mention.timestamp >= last_24h
        ).scalar() or 0
        reviews_24h = db.query(func.count(Review.id)).filter(
            Review.date >= last_24h
        ).scalar() or 0
        total_24h = mentions_24h + reviews_24h

        pos = neg = neu = 0
        for s, c in sentiment_counts:
            if s and ("positive" in str(s).lower() or str(s) == "LABEL_2"):
                pos += c
            elif s and ("negative" in str(s).lower() or str(s) == "LABEL_0"):
                neg += c
            else:
                neu += c
        for r in db.query(Review.sentiment, func.count(Review.id)).group_by(Review.sentiment).all():
            s, c = r
            if s and ("positive" in str(s).lower() or str(s) == "LABEL_2"):
                pos += c
            elif s and ("negative" in str(s).lower() or str(s) == "LABEL_0"):
                neg += c
            else:
                neu += c

        total_sent = pos + neg + neu
        return {
            "sentiment_distribution": dict(sentiment_counts),
            "platform_distribution": dict(platform_counts),
            "total_mentions": total_all,
            "positive_pct": round(100 * pos / total_sent, 1) if total_sent else 0,
            "negative_pct": round(100 * neg / total_sent, 1) if total_sent else 0,
            "neutral_pct": round(100 * neu / total_sent, 1) if total_sent else 0,
            "mentions_last_24h": total_24h,
        }
    finally:
        db.close()


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
    """Timeline of review counts by date."""
    db = SessionLocal()
    try:
        data = db.query(
            func.date(Review.date),
            func.count(Review.id)
        ).group_by(func.date(Review.date)).all()
        return [{"date": str(d), "count": c} for d, c in data]
    finally:
        db.close()


def _norm_sent(s):
    if not s:
        return "neutral"
    s = str(s)
    if s in ("positive", "LABEL_2"):
        return "positive"
    if s in ("negative", "LABEL_0"):
        return "negative"
    return "neutral"


@app.get("/timeline/enriched", dependencies=[Depends(verify_token)])
def timeline_enriched():
    """Timeline with sentiment breakdown. Merges Mention + Review."""
    db = SessionLocal()
    try:
        from collections import defaultdict
        merged = defaultdict(lambda: {"count": 0, "positive": 0, "negative": 0, "neutral": 0})
        for r in db.query(Review).all():
            if r.date:
                k = r.date.strftime("%Y-%m-%d") if hasattr(r.date, "strftime") else str(r.date)[:10]
                merged[k]["count"] += 1
                merged[k][_norm_sent(r.sentiment)] += 1
        for m in db.query(Mention).all():
            if m.timestamp:
                k = m.timestamp.strftime("%Y-%m-%d") if hasattr(m.timestamp, "strftime") else str(m.timestamp)[:10]
                merged[k]["count"] += 1
                merged[k][_norm_sent(m.sentiment)] += 1
        return [{"date": k, "count": v["count"], "positive": v["positive"], "negative": v["negative"], "neutral": v["neutral"]}
                 for k, v in sorted(merged.items())]
    finally:
        db.close()


@app.get("/analytics/platform-sentiment", dependencies=[Depends(verify_token)])
def platform_sentiment():
    """Stacked sentiment by platform."""
    db = SessionLocal()
    try:
        platforms = {}
        for m in db.query(Mention.platform, Mention.sentiment).all():
            p = m[0] or "unknown"
            s = m[1] or "neutral"
            if p not in platforms:
                platforms[p] = {"positive": 0, "negative": 0, "neutral": 0}
            if s in ("positive", "LABEL_2"):
                platforms[p]["positive"] += 1
            elif s in ("negative", "LABEL_0"):
                platforms[p]["negative"] += 1
            else:
                platforms[p]["neutral"] += 1
        for r in db.query(Review.source, Review.sentiment).all():
            p = (r[0] or "unknown").lower()
            s = r[1] or "neutral"
            if p not in platforms:
                platforms[p] = {"positive": 0, "negative": 0, "neutral": 0}
            if s in ("positive", "LABEL_2"):
                platforms[p]["positive"] += 1
            elif s in ("negative", "LABEL_0"):
                platforms[p]["negative"] += 1
            else:
                platforms[p]["neutral"] += 1
        return [{"platform": p, **v} for p, v in platforms.items()]
    finally:
        db.close()

@app.get("/export/mentions", dependencies=[Depends(verify_token)])
def export_mentions(
    platform: str | None = None,
    sentiment: str | None = None,
    search: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    """Export mentions as CSV."""
    from fastapi.responses import StreamingResponse
    import csv
    import io

    db = SessionLocal()
    try:
        query = db.query(Mention)
        if platform:
            query = query.filter(Mention.platform == platform)
        if sentiment:
            query = query.filter(Mention.sentiment == sentiment)
        if search:
            query = query.filter(Mention.content.ilike(f"%{search}%"))
        if start_date:
            try:
                start = datetime.fromisoformat(start_date)
                query = query.filter(Mention.timestamp >= start)
            except Exception:
                pass
        if end_date:
            try:
                end = datetime.fromisoformat(end_date)
                query = query.filter(Mention.timestamp <= end)
            except Exception:
                pass
        data = query.order_by(Mention.timestamp.desc()).limit(1000).all()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["id", "platform", "keyword", "author", "content", "timestamp", "sentiment", "score"])
        for m in data:
            writer.writerow([
                m.id, m.platform, m.keyword, m.author,
                (m.content or "").replace("\n", " "),
                m.timestamp.isoformat() if m.timestamp else "",
                m.sentiment, m.score
            ])
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=mentions.csv"}
        )
    finally:
        db.close()


@app.get("/keyword_stats", dependencies=[Depends(verify_token)])
def keyword_stats():
    db = SessionLocal()
    try:
        rows = db.query(
            Mention.keyword,
            func.count(Mention.id)
        ).group_by(Mention.keyword).all()

        return {k: v for k, v in rows}
    finally:
        db.close()




@app.get("/analytics/growth")
def get_growth(db: Session = Depends(get_db)):

    now = datetime.utcnow()
    last_24h = now - timedelta(hours=24)
    prev_24h = last_24h - timedelta(hours=24)

    current_mentions = db.query(func.count(Mention.id)).filter(
        Mention.timestamp >= last_24h
    ).scalar()

    previous_mentions = db.query(func.count(Mention.id)).filter(
        Mention.timestamp >= prev_24h,
        Mention.timestamp < last_24h
    ).scalar()

    growth_percent = 0.0

    if previous_mentions and previous_mentions > 0:
        growth_percent = (
            (current_mentions - previous_mentions) 
            / previous_mentions
        ) * 100

    return {
        "current": current_mentions or 0,
        "previous": previous_mentions or 0,
        "growth_percent": round(growth_percent, 2)
    }



@app.get("/analytics/sentiment-momentum")
def sentiment_momentum(db: Session = Depends(get_db)):

    now = datetime.utcnow()
    last_24h = now - timedelta(hours=24)

    results = db.query(
        Mention.sentiment,
        func.count(Mention.id)
    ).filter(
        Mention.timestamp >= last_24h
    ).group_by(Mention.sentiment).all()

    data = {
        "positive": 0,
        "neutral": 0,
        "negative": 0
    }

    for sentiment, count in results:
        data[sentiment] = count

    return data

@app.get("/analytics/spikes")
def detect_spikes(db: Session = Depends(get_db)):

    now = datetime.utcnow()
    last_hour = now - timedelta(hours=1)
    prev_hour = last_hour - timedelta(hours=1)

    current = db.query(func.count(Mention.id)).filter(
        Mention.timestamp >= last_hour
    ).scalar()

    previous = db.query(func.count(Mention.id)).filter(
        Mention.timestamp >= prev_hour,
        Mention.timestamp < last_hour
    ).scalar()

    spike_detected = False

    if previous and previous > 0:
        if current > previous * 2:
            spike_detected = True

    return {
        "current_hour": current or 0,
        "previous_hour": previous or 0,
        "spike_detected": spike_detected
    }