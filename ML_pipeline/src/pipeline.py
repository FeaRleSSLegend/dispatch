import joblib
from preprocess import clean_text, load_vectorizer
from extract_entities import extract_entities
from redact_pii import redact_pii

MODELS_DIR = "../models"

ROUTING_TABLE = {
    "phishing": "IT Security",
    "account_takeover": "IT Security",
    "malware": "IT Security",
    "data_leak": "IT Security + Data Protection Officer",
    "suspicious_activity": "IT Support (triage)",
}

# Loaded once at import time so repeated calls don't reload from disk
_vectorizer = load_vectorizer(f"{MODELS_DIR}/tfidf_vectorizer.joblib")
_category_clf = joblib.load(f"{MODELS_DIR}/type_classifier.joblib")
_severity_clf = joblib.load(f"{MODELS_DIR}/severity_classifier.joblib")

def process_report(raw_text: str) -> dict:
    cleaned = clean_text(raw_text)
    vec = _vectorizer.transform([cleaned])

    category = _category_clf.predict(vec)[0]
    severity = _severity_clf.predict(vec)[0]
    entities = extract_entities(raw_text)
    safe_text = redact_pii(raw_text)
    routed_to = ROUTING_TABLE.get(category, "IT Support (triage)")

    return {
        "category": category,
        "severity": severity,
        "entities": entities,
        "cleaned_text": safe_text,
        "routed_to": routed_to,
    }

if __name__ == "__main__":
    test_cases = [
    "My name is Chidi Okafor, phone 08034567890, account REF-4021. Someone accessed my account from 197.210.54.12 and I clicked http://fake-bank-login.tk before realizing it was fake.",
    "Account STAFFID-3391 was used to log in from an unrecognized device this morning.",
    ]

    for t in test_cases:
        result = process_report(t)
        print(result)
        print()