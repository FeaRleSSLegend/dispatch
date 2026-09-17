import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
from pathlib import Path
from pipeline import process_report

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR.parent / "data" / "held_out_test_set.csv"
MISCLASSIFIED_PATH = BASE_DIR.parent / "data" / "misclassified_reports.csv"

def evaluate():
    df = pd.read_csv(DATA_PATH)

    predicted_categories = []
    predicted_severities = []

    for text in df["text"]:
        result = process_report(text)
        predicted_categories.append(result["category"])
        predicted_severities.append(result["severity"])

    df["predicted_category"] = predicted_categories
    df["predicted_severity"] = predicted_severities

    print(f"Evaluated on {len(df)} held-out reports (never seen during training)\n")

    print("=== Category accuracy ===")
    print(accuracy_score(df["category"], df["predicted_category"]))
    print(classification_report(df["category"], df["predicted_category"]))

    print("=== Severity accuracy ===")
    print(accuracy_score(df["severity"], df["predicted_severity"]))
    print(classification_report(df["severity"], df["predicted_severity"]))

    failures = df[df["category"] != df["predicted_category"]]
    print(f"\n{len(failures)} misclassified reports:")
    print(failures[["report_id", "text", "category", "predicted_category"]])

    failures.to_csv(MISCLASSIFIED_PATH, index=False)

if __name__ == "__main__":
    evaluate()