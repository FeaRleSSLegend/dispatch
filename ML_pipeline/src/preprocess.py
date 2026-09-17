import re
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

def clean_text(text: str) -> str:
    """Light cleaning: lowercase, collapse whitespace, strip stray punctuation noise."""
    text = text.lower()
    text = re.sub(r"http\S+", " URL ", text)  # normalize URLs before they pollute vocab
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def build_vectorizer(max_features: int = 3000) -> TfidfVectorizer:
    return TfidfVectorizer(
        max_features=max_features,
        ngram_range=(1, 2),   # unigrams + bigrams catch phrases like "did not click"
        min_df=2,
        stop_words="english",
    )

def save_vectorizer(vectorizer: TfidfVectorizer, path: str):
    joblib.dump(vectorizer, path)

def load_vectorizer(path: str) -> TfidfVectorizer:
    return joblib.load(path)