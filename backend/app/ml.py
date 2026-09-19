"""Loads the ML pipeline once at import time and exposes a clean API.

We insert ML_pipeline/src on sys.path so we can import pipeline.py directly
instead of copying it into the backend.

Important: pipeline.py loads its .joblib models at module import time using a
relative path ("../models"). That path resolves from the CWD, not the file, so
we temporarily chdir to ML_pipeline/src during import.
"""

import os
import sys
from contextlib import contextmanager
from functools import lru_cache

import joblib  # noqa: E402

from app.config import ML_MODELS, ML_SRC

# Make ML_pipeline/src importable
if str(ML_SRC) not in sys.path:
    sys.path.insert(0, str(ML_SRC))


@contextmanager
def _cwd(path):
    prev = os.getcwd()
    os.chdir(path)
    try:
        yield
    finally:
        os.chdir(prev)


# pipeline.py uses MODELS_DIR = "../models" and loads .joblib files at import time.
# The path is relative to CWD, so we cd into ML_pipeline/src during import.
with _cwd(ML_SRC):
    import pipeline as _pipeline  # noqa: E402

# After import, patch MODELS_DIR to an absolute path so any later calls work
# even if CWD changes.
_pipeline.MODELS_DIR = str(ML_MODELS)


@lru_cache(maxsize=1)
def model_metadata() -> dict:
    return {
        "vectorizer_features": getattr(_pipeline._vectorizer, "max_features", None),
        "categories": list(getattr(_pipeline._category_clf, "classes_", [])),
        "severities": list(getattr(_pipeline._severity_clf, "classes_", [])),
        "models_dir": str(ML_MODELS),
    }


def analyze(text: str) -> dict:
    """Run the ML pipeline on raw incident text."""
    raw = _pipeline.process_report(text)
    return {
        "category": raw["category"],
        "severity": raw["severity"],
        "score": raw.get("score"),
        "entities": raw["entities"],
        "redacted": raw["cleaned_text"],
        "routed_to": raw["routed_to"],
    }