import os
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

def run():
    db = SessionLocal()

    for keyword in KEYWORDS:
        for post in reddit.subreddit("all").search(keyword, limit=10):
            text = post.title

            label, score = analyze(text)

            mention = Mention(
                platform="reddit",
                author=str(post.author),
                content=text,
                timestamp=datetime.utcfromtimestamp(post.created_utc),
                sentiment=label,
                score=score,
            )

            db.add(mention)

    db.commit()
    db.close()

    print("Reddit scrape complete")

if __name__ == "__main__":
    run()