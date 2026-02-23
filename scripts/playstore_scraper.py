import os
from tenacity import retry, stop_after_attempt, wait_exponential
from google_play_scraper import reviews, Sort

from backend.db import SessionLocal
from backend.models import Review
from backend.sentiment import analyze
from backend.logger import logger


@retry(stop=stop_after_attempt(5), wait=wait_exponential())
def run():
    logger.info("Starting Play Store scrape")

    app_id = os.getenv("PLAYSTORE_APP_ID")
    db = SessionLocal()

    result, _ = reviews(
        app_id,
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