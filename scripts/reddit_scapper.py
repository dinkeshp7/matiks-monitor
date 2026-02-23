import os
from datetime import datetime
from tenacity import retry, stop_after_attempt, wait_exponential
import praw

from backend.db import SessionLocal
from backend.models import Mention
from backend.sentiment import analyze
from backend.logger import logger


KEYWORDS = ["matiks", "brain games", "memory app"]


@retry(stop=stop_after_attempt(5), wait=wait_exponential())
def run():
    logger.info("Starting Reddit scrape")

    reddit = praw.Reddit(
        client_id=os.getenv("REDDIT_CLIENT_ID"),
        client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
        user_agent=os.getenv("REDDIT_USER_AGENT", "matiks-monitor"),
    )

    db = SessionLocal()

    for keyword in KEYWORDS:
        for post in reddit.subreddit("all").search(keyword, limit=10):
            text = post.title

            existing = db.query(Mention).filter(Mention.content == text).first()
            if existing:
                continue

            label, score = analyze(text)

            mention = Mention(
                platform="reddit",
                keyword=keyword,
                author=str(post.author),
                content=text,
                timestamp=datetime.utcfromtimestamp(post.created_utc),
                sentiment=label,
                score=score,
            )

            db.add(mention)

    db.commit()
    db.close()

    logger.info("Reddit scrape completed")


if __name__ == "__main__":
    run()
