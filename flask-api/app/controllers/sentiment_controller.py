from textblob import TextBlob

def analyze_sentiment_controller(text):
    if not text:
        return {"error": "No text provided"}, 400

    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0:
        sentiment = "positive"
    elif polarity < 0:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return {
        "text": text,
        "sentiment": sentiment,
        "polarity": polarity
    }, 200