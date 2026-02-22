from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Mention(Base):
    __tablename__ = "mentions"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String)
    author = Column(String)
    content = Column(Text)
    timestamp = Column(DateTime)
    sentiment = Column(String)
    score = Column(Float)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String)
    rating = Column(Integer)
    content = Column(Text)
    date = Column(DateTime)
    sentiment = Column(String)
    score = Column(Float)