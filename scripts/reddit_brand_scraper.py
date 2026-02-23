import os
from datetime import datetime
from tenacity import retry, stop_after_attempt, wait_exponential
import praw

from backend.insert_mentions import insert_mention
from backend.keywords import KEYWORDS
from backend.logger import logger


@retry(stop=stop_after_attempt(5), wait=wait_exponential())
def run():
    logger.info("Starting Reddit brand scrape")

    reddit = praw.Reddit(
        client_id=os.getenv("REDDIT_CLIENT_ID"),
        client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
        user_agent="matiks-monitor"
    )

    for group in KEYWORDS:
        for keyword in KEYWORDS[group]:

            try:
                for post in reddit.subreddit("all").search(keyword, limit=10):
                    insert_mention(
                        platform="reddit",
                        keyword=keyword,
                        author=str(post.author),
                        text=post.title,
                        timestamp=datetime.utcfromtimestamp(post.created_utc)
                    )
                    print("FOUND:", post.title)

            except Exception as e:
                logger.error(f"Reddit error for {keyword}: {e}")

    logger.info("Reddit brand scrape done")


if __name__ == "__main__":
    run()