import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))
import os
from tenacity import retry, stop_after_attempt, wait_exponential
from logger import logger
from datetime import datetime
from dotenv import load_dotenv
import praw

from db import SessionLocal
from models import Mention
from sentiment import analyze

load_dotenv()

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT"),
)

KEYWORDS = ["matiks", "brain games", "memory app"]

@retry(stop=stop_after_attempt(5), wait=wait_exponential())
def run():
    logger.info("Starting Reddit scrape")

    db = SessionLocal()

    for keyword in KEYWORDS:
        for post in reddit.subreddit("all").search(keyword, limit=10):
            text = post.title

            existing = db.query(Mention).filter(
                Mention.content == text
            ).first()

            if existing:
                continue

            label, score = analyze(text)

            mention = Mention(
                platform="reddit",
                author=str(post.author),
                content=text,
                timestamp=datetime.utcfromtimestamp(post.created_utc),
                sentiment=label,
                score=score
            )

            db.add(mention)

    db.commit()
    db.close()

    logger.info("Reddit scrape completed")

if __name__ == "__main__":
    run()