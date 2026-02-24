from datetime import datetime
from sqlalchemy.exc import IntegrityError

from backend.db import SessionLocal
from backend.models import Mention
from backend.sentiment import analyze


def insert_mention(platform, keyword, author, text, timestamp):
    db = SessionLocal()
    try:
        existing = db.query(Mention).filter(
            Mention.platform == platform,
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
    except IntegrityError:
        db.rollback()
    finally:
        db.close()