"""Build anonymized Facebook post message from a report (same logic as frontend FacebookShareModal)."""
from typing import Any

# Labels for report_type (keep in sync with frontend REPORT_TYPE_LABELS where possible)
REPORT_TYPE_LABELS: dict[str, str] = {
    "website": "Website",
    "phone": "Phone",
    "crypto": "Crypto",
    "iban": "IBAN",
    "social_media": "Social media",
    "whatsapp": "WhatsApp",
    "telegram": "Telegram",
    "discord": "Discord",
    "other": "Other",
}

REPORT_TYPE_ICONS: dict[str, str] = {
    "website": "🌐",
    "phone": "📞",
    "crypto": "₿",
    "iban": "🏦",
    "social_media": "📱",
    "whatsapp": "💬",
    "telegram": "✈️",
    "discord": "🎮",
    "other": "📋",
}

LOST_MONEY_RANGE_LABELS: dict[str, str] = {
    "none": "None",
    "under_100": "Under $100",
    "under_1000": "Under $1,000",
    "under_10000": "Under $10,000",
    "under_100000": "Under $100,000",
    "under_1000000": "Under $1,000,000",
    "over_1000000": "Over $1,000,000",
}


def build_post_message(record: dict[str, Any]) -> str:
    """Build anonymized post text for Facebook from a report record (id, report_type, country_origin, category, lost_money, lost_money_range)."""
    report_type = record.get("report_type") or "other"
    type_label = REPORT_TYPE_LABELS.get(report_type, report_type)
    type_icon = REPORT_TYPE_ICONS.get(report_type, "📋")
    category = record.get("category")
    country_origin = record.get("country_origin")
    lost_money = record.get("lost_money") is True
    lost_money_range = record.get("lost_money_range")
    report_id = record.get("id", "")

    lost_money_line: str | None = None
    if lost_money:
        lost_money_line = (
            f"Lost money: {LOST_MONEY_RANGE_LABELS.get(lost_money_range or '', lost_money_range or 'Yes')}"
            if lost_money_range and lost_money_range != "none"
            else "Lost money: Yes"
        )

    lines = [
        "We have received a new scam report.",
        f"Type: {type_icon} {type_label}.",
        f"Origin Country: {country_origin}." if country_origin else None,
        f"Category: {category}." if category else None,
        lost_money_line,
        f"Report ID: {report_id}",
        "Visit the Scamenger website and input the report ID to view the full report.",
    ]
    return "\n".join(l for l in lines if l is not None)
