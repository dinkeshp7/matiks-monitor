import logging

logger = logging.getLogger("matiks")
logger.setLevel(logging.INFO)

formatter = logging.Formatter(
    "%(asctime)s | %(levelname)s | %(message)s"
)

# file log
file_handler = logging.FileHandler("pipeline.log")
file_handler.setFormatter(formatter)

# console log
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)

logger.addHandler(file_handler)
logger.addHandler(console_handler)