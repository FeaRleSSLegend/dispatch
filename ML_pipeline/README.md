# Dispatch — ML Pipeline

The classification engine behind Dispatch. Given a free-text incident report, it predicts a category and severity, extracts technical entities, and redacts personal information.

## What it produces

`process_report(text)` returns a dict with `category`, `severity`, `score`, `entities`, `cleaned_text`, and `routed_to`. Categories: phishing, account_takeover, malware, data_leak, suspicious_activity. Severities: low, medium, high.

## Models

Three `.joblib` files in `models/`: `tfidf_vectorizer.joblib`, `type_classifier.joblib`, `severity_classifier.joblib`.

## Layout

- `src/pipeline.py` — `process_report()` entry point
- `src/preprocess.py` — text cleaning + vectorizer
- `src/extract_entities.py` — regex + spaCy NER
- `src/redact_pii.py` — PII redaction
- `src/dedup.py` — duplicate detection
- `src/train.py` — training
- `src/evaluate.py` — evaluation
- `data/` — datasets
- `models/` — trained artifacts

## Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install scikit-learn spacy pandas numpy joblib
python -m spacy download en_core_web_sm
```

## Train

```bash
cd src
python train.py
```

## Evaluate

```bash
cd src
python evaluate.py
```

## Notes

- `pipeline.py` resolves `MODELS_DIR` relative to its own file, not the CWD.
- Dedup is batch-only. The API does not currently use it.
- Category accuracy ~74