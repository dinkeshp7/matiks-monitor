from backend.db import SessionLocal
from backend.models import Mention
from datetime import datetime, timezone

db = SessionLocal()

sample = [
    Mention(
        platform="playstore",
        keyword="matiks",
        author="user1",
        content="Great brain game!",
        timestamp=datetime.now(timezone.utc),
        sentiment="positive",
        score=0.9,
    ),
    Mention(
        platform="appstore",
        keyword="matiks",
        author="user2",
        content="Very addictive",
        timestamp=datetime.now(timezone.utc),
        sentiment="positive",
        score=0.8,
    ),
    Mention(
        platform="twitter",
        keyword="matiks",
        author="user3",
        content="Not bad",
        timestamp=datetime.now(timezone.utc),
        sentiment="neutral",
        score=0.1,
    ),
]

for s in sample:
    db.add(s)

db.commit()
db.close()

print("Inserted test mentions")