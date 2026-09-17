import pandas as pd
from pathlib import Path
from preprocess import load_vectorizer
from dedup import find_duplicates

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR.parent / "data" / "incident_reports_dataset.csv"
MODELS_DIR = BASE_DIR.parent / "models"

def validate_at_threshold(df, vectorizer, threshold):
    reports = df[["report_id", "text"]].to_dict("records")
    predicted = find_duplicates(reports, vectorizer, threshold=threshold)

    ground_truth = dict(zip(df["report_id"], df["duplicate_of"]))
    known_dup_ids = {rid for rid, dup_of in ground_truth.items() if pd.notna(dup_of)}

    true_positives = 0   # correctly flagged as a duplicate (of anything, not necessarily the exact match)
    false_negatives = 0  # a real duplicate that dedup missed entirely
    false_positives = 0  # flagged as duplicate but wasn't one in ground truth
    exact_match = 0      # flagged, AND matched to the correct original report

    for report_id in df["report_id"]:
        is_known_dup = report_id in known_dup_ids
        predicted_dup_of = predicted.get(report_id)

        if is_known_dup and predicted_dup_of is not None:
            true_positives += 1
            if predicted_dup_of == ground_truth[report_id]:
                exact_match += 1
        elif is_known_dup and predicted_dup_of is None:
            false_negatives += 1
        elif not is_known_dup and predicted_dup_of is not None:
            false_positives += 1

    print(f"--- threshold = {threshold} ---")
    print(f"Known duplicates in dataset: {len(known_dup_ids)}")
    print(f"Correctly flagged as duplicate: {true_positives} (of which matched to the exact original: {exact_match})")
    print(f"Missed (false negatives): {false_negatives}")
    print(f"Wrongly flagged non-duplicates (false positives): {false_positives}")
    print()

def validate():
    df = pd.read_csv(DATA_PATH)
    vectorizer = load_vectorizer(MODELS_DIR / "tfidf_vectorizer.joblib")

    for threshold in [0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40]:
        validate_at_threshold(df, vectorizer, threshold)

if __name__ == "__main__":
    validate()