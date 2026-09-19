"""Smoke tests. Requires Supabase credentials in backend/.env."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_version():
    r = client.get("/api/version")
    assert r.status_code == 200
    body = r.json()
    assert "api_version" in body
    assert "models" in body


def test_analyze_phishing():
    text = (
        "I be Chidi from payroll. Somebody send me email say I go update my password "
        "for this link http://paypal-secure-login.tk. I click the link and I don enter "
        "my password before I realize say e no be correct site."
    )
    r = client.post("/api/reports/analyze", json={"text": text})
    assert r.status_code == 200
    body = r.json()
    assert body["category"] in {
        "phishing",
        "account_takeover",
        "malware",
        "data_leak",
        "suspicious_activity",
    }
    assert body["severity"] in {"low", "medium", "high"}
    assert isinstance(body["score"], float)
    assert "[REDACTED]" in body["redacted"] or "[EMAIL]" in body["redacted"]


def test_list_incidents():
    r = client.get("/api/incidents")
    assert r.status_code == 200
    body = r.json()
    assert "items" in body
    assert isinstance(body["items"], list)


def test_analytics():
    r = client.get("/api/analytics/summary")
    assert r.status_code == 200
    body = r.json()
    assert "volume_by_day" in body
    assert len(body["volume_by_day"]) == 7