from transformers import pipeline

_sentiment_pipeline = None


def _get_pipeline():
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        _sentiment_pipeline = pipeline(
            "text-classification",
            model="cardiffnlp/twitter-roberta-base-sentiment"
        )
    return _sentiment_pipeline


def analyze(text: str):
    if not text:
        return "neutral", 0.0

    pipeline = _get_pipeline()
    res = pipeline(text[:512])[0]
    return res["label"], float(res["score"])