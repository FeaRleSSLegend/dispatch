from datetime import datetime, timedelta
from sklearn.metrics.pairwise import cosine_similarity
from preprocess import clean_text

def find_duplicates(reports: list[dict], vectorizer, threshold: float = 0.2, window_hours: int = 12) -> dict:
    """
    reports: list of {"report_id": str, "text": str, "timestamp": str} sorted or unsorted,
             timestamp format "%Y-%m-%d %H:%M:%S"
    Returns: {report_id: duplicate_of_report_id or None}
    Only compares a report against earlier reports that arrived within `window_hours`,
    which sharply cuts false positives from unrelated reports that just happen to
    share vocabulary but occurred weeks apart.
    """
    texts = [clean_text(r["text"]) for r in reports]
    vectors = vectorizer.transform(texts)
    timestamps = [datetime.strptime(r["timestamp"], "%Y-%m-%d %H:%M:%S") for r in reports]

    # Process in chronological order so "earlier reports" is well-defined
    order = sorted(range(len(reports)), key=lambda i: timestamps[i])
    result = {r["report_id"]: None for r in reports}

    for pos, i in enumerate(order):
        best_sim, best_j = 0, None
        for j in order[:pos]:
            if timestamps[i] - timestamps[j] > timedelta(hours=window_hours):
                continue  # too far apart in time, don't even compare
            sim = cosine_similarity(vectors[i], vectors[j])[0][0]
            if sim > best_sim:
                best_sim, best_j = sim, j
        if best_sim >= threshold and best_j is not None:
            result[reports[i]["report_id"]] = reports[best_j]["report_id"]

    return result