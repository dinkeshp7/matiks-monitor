import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from playstore_scraper import run as run_play
from appstore_scraper import run as run_app
from logger import logger


def run():
    logger.info("Pipeline started")

    try:
        run_play()
    except Exception as e:
        logger.error(f"Play store error: {e}")

    try:
        run_app()
    except Exception as e:
        logger.error(f"App store error: {e}")

    logger.info("Pipeline finished")


if __name__ == "__main__":
    run()