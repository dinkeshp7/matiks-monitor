import os
from tenacity import retry, stop_after_attempt, wait_exponential
from app_store_web_scraper import AppStoreEntry

from backend.db import SessionLocal
from backend.models import Review
from backend.sentiment import analyze
from backend.logger import logger


@retry(stop=stop_after_attempt(5), wait=wait_exponential())
def run():
    logger.info("Starting App Store scrape")

    app_id = int(os.getenv("APPSTORE_APP_ID", "0"))
    country = "us"
    db = SessionLocal()

    app = AppStoreEntry(app_id, country=country)
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