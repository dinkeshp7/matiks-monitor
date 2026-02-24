import os
from tenacity import retry, stop_after_attempt, wait_exponential
from app_store_web_scraper import AppStoreEntry
from sqlalchemy.exc import IntegrityError

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

    try:
        app = AppStoreEntry(app_id, country=country)
        reviews_list = list(app.reviews())
    except Exception as e:
        logger.error(f"App Store fetch failed: {e}")
        db.close()
        raise

    logger.info(f"Fetched AppStore reviews: {len(reviews_list)}")

    for r in reviews_list:
        text = r.content
        existing = db.query(Review).filter(
            Review.source == "appstore",
            Review.content == text
        ).first()
        if existing:
            continue
        try:
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
        except IntegrityError:
            db.rollback()
            continue
    db.close()

    logger.info("App Store scrape complete")


if __name__ == "__main__":
    run()