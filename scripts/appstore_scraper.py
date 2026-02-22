import sys
import os

# IMPORTANT: must be first
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app_store_web_scraper import AppStoreEntry
from db import SessionLocal
from models import Review
from sentiment import analyze
from logger import logger

APP_ID = int(os.getenv("APPSTORE_APP_ID"))  # numeric ID
COUNTRY = "us"


def run():
    logger.info("Starting App Store scrape")

    db = SessionLocal()

    app = AppStoreEntry(APP_ID, country=COUNTRY)
    reviews = list(app.reviews())

    print("Fetched AppStore reviews:", len(reviews))

    for r in reviews:
        text = r.content

        existing = db.query(Review).filter(
            Review.content == text
        ).first()

        if existing:
            continue

        label, score = analyze(text)

        review = Review(
            source="appstore",
            rating=r.rating,
            content=text,
            date=r.date,
            sentiment=label,
            score=score
        )

        db.add(review)

    db.commit()
    db.close()

    logger.info("App Store scrape done")


if __name__ == "__main__":
    run()