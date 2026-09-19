import re
import spacy

nlp = spacy.load("en_core_web_sm")

IP_PATTERN = re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")
URL_PATTERN = re.compile(r"https?://[^\s]+")
ACCOUNT_PATTERN = re.compile(r"\b(?:ACC|STAFFID|EMP|REF)-?\d{3,6}\b", re.IGNORECASE)

# Common finance/security acronyms spaCy's NER sometimes misreads as ORG names
NON_ORG_ACRONYMS = {"CVV", "PIN", "OTP", "BVN", "NIN", "ATM", "USSD", "SMS", "IT"}

def extract_entities(text: str) -> dict:
    doc = nlp(text)

    ips = IP_PATTERN.findall(text)
    urls = URL_PATTERN.findall(text)
    account_refs = ACCOUNT_PATTERN.findall(text)

    orgs = [
        ent.text for ent in doc.ents
        if ent.label_ == "ORG" and ent.text.upper() not in NON_ORG_ACRONYMS
    ]

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