from sqlalchemy import Column, Integer, String, Text, DateTime, Float, UniqueConstraint
from sqlalchemy.orm import declarative_base
from datetime import datetime

timestamp = Column(DateTime, default=datetime.utcnow)
Base = declarative_base()


class Mention(Base):
    __tablename__ = "mentions"
    __table_args__ = (UniqueConstraint("platform", "content", name="uq_mention_platform_content"),)

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String)
    keyword = Column(String)
    author = Column(String)
    content = Column(Text)
    timestamp = Column(DateTime)
    sentiment = Column(String)
    score = Column(Float)


class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (UniqueConstraint("source", "content", name="uq_review_source_content"),)

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String)
    rating = Column(Integer)
    content = Column(Text)
    date = Column(DateTime)
    sentiment = Column(String)
    score = Column(Float)
