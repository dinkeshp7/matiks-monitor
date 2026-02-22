from datetime import datetime
from db import SessionLocal
from models import Mention
from sentiment import analyze

db = SessionLocal()

text = "Matiks is an amazing brain game app"

label, score = analyze(text)

m = Mention(
    platform="test",
    author="system",
    content=text,
    timestamp=datetime.utcnow(),
    sentiment=label,
    score=score
)

db.add(m)
db.commit()
db.close()

print("Inserted test mention")