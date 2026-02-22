import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from google_play_scraper import reviews, Sort
from db import SessionLocal
from models import Review
from sentiment import analyze
from logger import logger

APP_ID = os.getenv("PLAYSTORE_APP_ID")


def run():
    logger.info("Starting Play Store scrape")

    db = SessionLocal()

    result, _ = reviews(
        APP_ID,
        lang="en",
        country="us",
        sort=Sort.NEWEST,
        count=50
    )

    print("Fetched PlayStore reviews:", len(result))

    for r in result:
        text = r["content"]

        existing = db.query(Review).filter(
            Review.content == text
        ).first()

        if existing:
            continue

        label, score = analyze(text)

        review = Review(
            source="playstore",
            rating=r["score"],
            content=text,
            date=r["at"],
            sentiment=label,
            score=score
        )

        db.add(review)

    db.commit()
    db.close()

    logger.info("Play Store scrape done")


if __name__ == "__main__":
    run()