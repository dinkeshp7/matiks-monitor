from backend.db import SessionLocal

from backend.models import Mention
from backend.sentiment import analyze
from datetime import datetime

def insert_mention(platform, keyword, author, text, timestamp):
    db = SessionLocal()

    existing = db.query(Mention).filter(
        Mention.content == text
    ).first()

    if existing:
        db.close()
        return

    label, score = analyze(text)

    m = Mention(
        platform=platform,
        keyword=keyword,
        author=author,
        content=text,
        timestamp=timestamp,
        sentiment=label,
        score=score
    )

    db.add(m)
    db.commit()
    db.close()