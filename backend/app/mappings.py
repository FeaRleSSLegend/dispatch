"""Mirrors frontend/src/lib/incidents.ts so the API and UI render the same labels."""


def format_category(category: str) -> str:
    return " ".join(word.capitalize() for word in category.split("_"))