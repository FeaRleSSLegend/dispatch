import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import os
from pathlib import Path

from preprocess import clean_text, build_vectorizer, save_vectorizer

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR.parent / "data" / "incident_reports_dataset.csv"
MODELS_DIR = BASE_DIR.parent / "models"
HELD_OUT_PATH = BASE_DIR.parent / "data" / "held_out_test_set.csv"

RANDOM_STATE = 99  # keep this fixed and documented, don't quietly change it between runs

def train():
    os.makedirs(MODELS_DIR, exist_ok=True)
    df = pd.read_csv(DATA_PATH).reset_index(drop=True)
    df["clean_text"] = df["text"].apply(clean_text)

    vectorizer = build_vectorizer()
    X = vectorizer.fit_transform(df["clean_text"])

    # Single split, stratified on category, reused for both classifiers.
    # This guarantees train.py's test rows and evaluate.py's held-out rows are the same set.
    train_idx, test_idx = train_test_split(
        df.index, test_size=0.2, random_state=RANDOM_STATE, stratify=df["category"]
    )

    X_train, X_test = X[train_idx], X[test_idx]

    # --- Category classifier ---
    y_train_cat = df.loc[train_idx, "category"]
    y_test_cat = df.loc[test_idx, "category"]
    category_clf = LogisticRegression(max_iter=1000, class_weight="balanced")
    category_clf.fit(X_train, y_train_cat)
    print("=== Category classifier (held-out test set) ===")
    print(classification_report(y_test_cat, category_clf.predict(X_test)))

    # --- Severity classifier ---
    y_train_sev = df.loc[train_idx, "severity"]
    y_test_sev = df.loc[test_idx, "severity"]
    severity_clf = LogisticRegression(max_iter=1000, class_weight="balanced")
    severity_clf.fit(X_train, y_train_sev)
    print("=== Severity classifier (held-out test set) ===")
    print(classification_report(y_test_sev, severity_clf.predict(X_test)))

    # Save models
    save_vectorizer(vectorizer, MODELS_DIR / "tfidf_vectorizer.joblib")
    joblib.dump(category_clf, MODELS_DIR / "type_classifier.joblib")
    joblib.dump(severity_clf, MODELS_DIR / "severity_classifier.joblib")
    print("Models saved to", MODELS_DIR)

    # Save the held-out rows so evaluate.py scores ONLY on data the model never trained on
    held_out_df = df.loc[test_idx, ["report_id", "text", "category", "severity"]]
    held_out_df.to_csv(HELD_OUT_PATH, index=False)
    print(f"Held-out test set ({len(held_out_df)} rows) saved to", HELD_OUT_PATH)

if __name__ == "__main__":
    train()