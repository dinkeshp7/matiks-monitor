import sys
from scripts.playstore_scraper import run as run_play
from scripts.appstore_scraper import run as run_app
from scripts.reddit_brand_scraper import run as run_reddit
from backend.logger import logger


def run():
    logger.info("Pipeline started")
    failed = []

    try:
        run_play()
    except Exception as e:
        logger.error(f"Playstore error: {e}")
        failed.append("playstore")

    try:
        run_app()
    except Exception as e:
        logger.error(f"Appstore error: {e}")
        failed.append("appstore")

    try:
        run_reddit()
    except Exception as e:
        logger.error(f"Reddit error: {e}")
        failed.append("reddit")

    logger.info("Pipeline finished")

    if failed:
        logger.error(f"Failed scrapers: {', '.join(failed)}")
        sys.exit(1)


if __name__ == "__main__":
    run()
