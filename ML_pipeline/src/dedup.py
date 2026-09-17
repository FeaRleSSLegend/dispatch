from sklearn.metrics.pairwise import cosine_similarity
from preprocess import clean_text

def find_duplicates(reports: list[dict], vectorizer, threshold: float = 0.75) -> dict:
    """
    reports: list of {"report_id": str, "text": str}
    Returns: {report_id: duplicate_of_report_id or None}
    Compares every report against every earlier report in the list (assumes
    reports are roughly time-ordered as given).
    """
    texts = [clean_text(r["text"]) for r in reports]
    vectors = vectorizer.transform(texts)

    result = {r["report_id"]: None for r in reports}

    for i in range(len(reports)):
        for j in range(i):
            sim = cosine_similarity(vectors[i], vectors[j])[0][0]
            if sim >= threshold:
                result[reports[i]["report_id"]] = reports[j]["report_id"]
                break  # matched to the earliest similar report, stop looking

    return result