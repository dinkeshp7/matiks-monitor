"""Analytics endpoints for growth, insights, and enriched metrics."""
from datetime import datetime, timedelta
from sqlalchemy import func, and_
from fastapi import APIRouter, Depends

from backend.db import SessionLocal
from backend.models import Mention, Review
from backend.deps import verify_token_dep

router = APIRouter(prefix="/analytics", tags=["analytics"])


def _is_positive(s: str | None) -> bool:
    return s and (str(s).upper() in ("POSITIVE", "LABEL_2"))


def _is_negative(s: str | None) -> bool:
    return s and (str(s).upper() in ("NEGATIVE", "LABEL_0"))


def _is_neutral(s: str | None) -> bool:
    return not _is_positive(s) and not _is_negative(s)


@router.get("/growth", dependencies=[Depends(verify_token_dep)])
def get_growth():
    """Growth metrics: today vs yesterday, sentiment trend deltas."""
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday_start = today_start - timedelta(days=1)

        def count_mentions(start, end):
            return (
                db.query(func.count(Mention.id))
                .filter(and_(Mention.timestamp >= start, Mention.timestamp < end))
                .scalar()
                or 0
            )

        def count_reviews(start, end):
            return (
                db.query(func.count(Review.id))
                .filter(and_(Review.date >= start, Review.date < end))
                .scalar()
                or 0
            )

        m_today = count_mentions(today_start, now)
        m_yesterday = count_mentions(yesterday_start, today_start)
        r_today = count_reviews(today_start, now)
        r_yesterday = count_reviews(yesterday_start, today_start)
        total_today = m_today + r_today
        total_yesterday = m_yesterday + r_yesterday

        if total_yesterday == 0:
            growth_percentage = 100.0 if total_today > 0 else 0.0
        else:
            growth_percentage = round(
                ((total_today - total_yesterday) / total_yesterday) * 100, 1
            )

        def sentiment_counts(start, end):
            pos = neg = neu = 0
            for m in db.query(Mention).filter(
                and_(Mention.timestamp >= start, Mention.timestamp < end)
            ).all():
                if _is_positive(m.sentiment):
                    pos += 1
                elif _is_negative(m.sentiment):
                    neg += 1
                else:
                    neu += 1
            for r in db.query(Review).filter(
                and_(Review.date >= start, Review.date < end)
            ).all():
                if _is_positive(r.sentiment):
                    pos += 1
                elif _is_negative(r.sentiment):
                    neg += 1
                else:
                    neu += 1
            return pos, neg, neu

        pt, nt, nut = sentiment_counts(today_start, now)
        py, ny, nuy = sentiment_counts(yesterday_start, today_start)
        sentiment_trend = {
            "positive": pt - py,
            "negative": nt - ny,
            "neutral": nut - nuy,
        }
        return {
            "total_today": total_today,
            "total_yesterday": total_yesterday,
            "growth_percentage": growth_percentage,
            "sentiment_trend": sentiment_trend,
        }
    finally:
        db.close()


@router.get("/insights", dependencies=[Depends(verify_token_dep)])
def get_insights():
    """Rule-based insights: summary, anomalies, recommendations."""
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        last_24h = now - timedelta(hours=24)
        prev_24h = last_24h - timedelta(hours=24)

        def count_records(model, date_col, start, end):
            return (
                db.query(func.count(model.id))
                .filter(and_(date_col >= start, date_col < end))
                .scalar()
                or 0
            )

        m_now = count_records(Mention, Mention.timestamp, last_24h, now)
        m_prev = count_records(Mention, Mention.timestamp, prev_24h, last_24h)
        r_now = count_records(Review, Review.date, last_24h, now)
        r_prev = count_records(Review, Review.date, prev_24h, last_24h)
        total_now = m_now + r_now
        total_prev = m_prev + r_prev

        growth_pct = (
            round(((total_now - total_prev) / total_prev) * 100, 0)
            if total_prev else (100 if total_now else 0)
        )

        platform_counts_now = {}
        for m in db.query(Mention).filter(
            and_(Mention.timestamp >= last_24h, Mention.timestamp < now)
        ).all():
            p = m.platform or "unknown"
            platform_counts_now[p] = platform_counts_now.get(p, 0) + 1
        for r in db.query(Review).filter(
            and_(Review.date >= last_24h, Review.date < now)
        ).all():
            p = (r.source or "unknown").lower()
            platform_counts_now[p] = platform_counts_now.get(p, 0) + 1

        platform_counts_prev = {}
        for m in db.query(Mention).filter(
            and_(Mention.timestamp >= prev_24h, Mention.timestamp < last_24h)
        ).all():
            p = m.platform or "unknown"
            platform_counts_prev[p] = platform_counts_prev.get(p, 0) + 1
        for r in db.query(Review).filter(
            and_(Review.date >= prev_24h, Review.date < last_24h)
        ).all():
            p = (r.source or "unknown").lower()
            platform_counts_prev[p] = platform_counts_prev.get(p, 0) + 1

        anomalies = []
        for p, c in platform_counts_now.items():
            prev_c = platform_counts_prev.get(p, 0)
            if prev_c > 0 and c >= prev_c * 2:
                anomalies.append(f"Spike on {p} (2x increase)")
            elif prev_c == 0 and c >= 5:
                anomalies.append(f"Spike on {p} (new activity)")

        neg_now = sum(
            1 for m in db.query(Mention).filter(
                and_(Mention.timestamp >= last_24h, Mention.timestamp < now)
            ).all()
            if _is_negative(m.sentiment)
        ) + sum(
            1 for r in db.query(Review).filter(
                and_(Review.date >= last_24h, Review.date < now)
            ).all()
            if _is_negative(r.sentiment)
        )
        neg_prev = sum(
            1 for m in db.query(Mention).filter(
                and_(Mention.timestamp >= prev_24h, Mention.timestamp < last_24h)
            ).all()
            if _is_negative(m.sentiment)
        ) + sum(
            1 for r in db.query(Review).filter(
                and_(Review.date >= prev_24h, Review.date < last_24h)
            ).all()
            if _is_negative(r.sentiment)
        )
        neg_pct_prev = (neg_prev / total_prev * 100) if total_prev else 0
        neg_pct_now = (neg_now / total_now * 100) if total_now else 0
        if neg_pct_prev > 0 and neg_pct_now > neg_pct_prev + 20:
            anomalies.append("Negative sentiment rising significantly")

        driver = "PlayStore and AppStore reviews" if r_now > m_now else "Reddit and social mentions"
        summary = (
            f"Mentions {'increased' if growth_pct >= 0 else 'decreased'} "
            f"{abs(growth_pct)}% in last 24h driven by {driver}."
        )
        if total_prev == 0 and total_now > 0:
            summary = "New mentions detected in the last 24 hours."

        recommendations = []
        if neg_now > 0 and neg_pct_now > 30:
            recommendations.append("Respond to negative feedback promptly")
        if any("playstore" in p.lower() or "appstore" in p.lower() for p in platform_counts_now):
            pos_reviews = sum(
                1 for r in db.query(Review).filter(
                    and_(Review.date >= last_24h, Review.date < now)
                ).all()
                if _is_positive(r.sentiment)
            )
            if pos_reviews > 2:
                recommendations.append("Highlight positive PlayStore/AppStore reviews in marketing")
        if not recommendations:
            recommendations.append("Continue monitoring brand sentiment")

        return {
            "summary": summary,
            "anomalies": anomalies[:5],
            "recommendations": recommendations[:5],
        }
    finally:
        db.close()
