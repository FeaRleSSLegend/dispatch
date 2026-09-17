import re
import spacy

nlp = spacy.load("en_core_web_sm")

PHONE_PATTERN = re.compile(r"(\+?234|0)[789][01]\d{8}\b")
NIN_PATTERN = re.compile(r"\b\d{11}\b")
EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
ACCOUNT_PATTERN = re.compile(r"\b(?:ACC|STAFFID|EMP|REF)-?\d{3,6}\b", re.IGNORECASE)

def redact_pii(text: str) -> str:
    doc = nlp(text)

    # Find spans that are actually account references, technical details we
    # want to KEEP, so we can exclude them even if spaCy misclassifies them as PERSON/GPE.
    protected_spans = [(m.start(), m.end()) for m in ACCOUNT_PATTERN.finditer(text)]

    def overlaps_protected(start, end):
        return any(not (end <= p_start or start >= p_end) for p_start, p_end in protected_spans)

    spans_to_redact = [
        (ent.start_char, ent.end_char)
        for ent in doc.ents
        if ent.label_ in ("PERSON", "GPE", "FAC")
        and not overlaps_protected(ent.start_char, ent.end_char)
    ]

    redacted = text
    for start, end in sorted(spans_to_redact, key=lambda s: s[0], reverse=True):
        redacted = redacted[:start] + "[REDACTED]" + redacted[end:]

    redacted = PHONE_PATTERN.sub("[PHONE]", redacted)
    redacted = EMAIL_PATTERN.sub("[EMAIL]", redacted)
    redacted = NIN_PATTERN.sub("[ID_NUMBER]", redacted)

    return redacted