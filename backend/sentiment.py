from transformers import pipeline

print("Loading sentiment model...")

sentiment_pipeline = pipeline(
    "text-classification",
    model="cardiffnlp/twitter-roberta-base-sentiment"
)

print("Model loaded")

def analyze(text: str):
    if not text:
        return "neutral", 0.0

    res = sentiment_pipeline(text[:512])[0]
    return res["label"], float(res["score"])