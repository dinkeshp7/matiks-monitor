from fastapi import FastAPI
from db import SessionLocal
from models import Mention, Review
from fastapi import Query

app = FastAPI()


@app.get("/")
def root():
    return {"status": "running"}



@app.get("/mentions")
def get_mentions(
    platform: str | None = None,
    sentiment: str | None = None,
    search: str | None = None
):
    db = SessionLocal()

    query = db.query(Mention)

    if platform:
        query = query.filter(Mention.platform == platform)

    if sentiment:
        query = query.filter(Mention.sentiment == sentiment)

    if search:
        query = query.filter(Mention.content.ilike(f"%{search}%"))

    data = query.order_by(Mention.timestamp.desc()).limit(100).all()

    results = []
    for m in data:
        results.append({
            "id": m.id,
            "platform": m.platform,
            "author": m.author,
            "content": m.content,
            "timestamp": m.timestamp,
            "sentiment": m.sentiment,
            "score": m.score
        })

    db.close()
    return results


@app.get("/reviews")
def get_reviews():
    db = SessionLocal()
    data = db.query(Review).limit(50).all()

    results = []
    for r in data:
        results.append({
            "id": r.id,
            "source": r.source,
            "rating": r.rating,
            "content": r.content,
            "date": r.date,
            "sentiment": r.sentiment,
            "score": r.score
        })

    db.close()
    return results