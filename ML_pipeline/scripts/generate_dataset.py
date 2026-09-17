import random


CATEGORIES = [
    "phishing",
    "account_takeover",
    "malware",
    "data_leak",
    "suspicious_activity",
]

SEVERITY = ["low", "medium", "high"]

# Reusable entity pools for realism
NAMES = ["Chidi", "Amina", "Tunde", "Ngozi", "Ifeoma", "Bola"]
DEPARTMENTS = ["payroll", "HR", "finance", "registrar's office", "IT support"]
URLS = ["http://paypal-secure-login.tk", "http://nitda-portal-verify.com", "http://update-account-ng.info"]


def phishing_report():
    name = random.choice(NAMES)
    dept = random.choice(DEPARTMENTS)
    url = random.choice(URLS)
    clicked = random.random() < 0.4
    entered_creds = clicked and random.random() < 0.5

    if entered_creds:
        severity = "high"
        action = f"I click the link and I don enter my password before I realize say e no be correct site."
    elif clicked:
        severity = "medium"
        action = "I click the link but I no enter anything, I just close am."
    else:
        severity = "low"
        action = "I never click am o but I dey worried."

    templates = [
        f"Good day, I be {name} from {dept}. Somebody send me email say I go update my password for this link {url}. {action}",
        f"Received an email claiming to be from {dept} asking me to verify my login at {url}. {action}",
    ]
    return {"text": random.choice(templates), "category": "phishing", "severity": severity}