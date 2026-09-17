import re
import spacy

nlp = spacy.load("en_core_web_sm")

IP_PATTERN = re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")
URL_PATTERN = re.compile(r"https?://[^\s]+")
ACCOUNT_PATTERN = re.compile(r"\b(?:ACC|STAFFID|EMP|REF)-?\d{3,6}\b", re.IGNORECASE)

def extract_entities(text: str) -> dict:
    doc = nlp(text)

    ips = IP_PATTERN.findall(text)
    urls = URL_PATTERN.findall(text)
    account_refs = ACCOUNT_PATTERN.findall(text)

    orgs = [ent.text for ent in doc.ents if ent.label_ == "ORG"]

    # Filter out DATE/TIME entities that are actually IPs or phone numbers
    # spaCy misclassified, since those are already captured above or aren't real dates.
    phone_pattern = re.compile(r"\b0[789][01]\d{8}\b")
    dates_times = [
        ent.text for ent in doc.ents
        if ent.label_ in ("DATE", "TIME")
        and not IP_PATTERN.fullmatch(ent.text)
        and not phone_pattern.fullmatch(ent.text)
    ]

    return {
        "ips": ips,
        "urls": urls,
        "account_refs": account_refs,
        "organizations": orgs,
        "time_references": dates_times,
    }