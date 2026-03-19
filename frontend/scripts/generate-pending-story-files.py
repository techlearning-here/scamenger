#!/usr/bin/env python3
"""Generate scam-stories-content/*.ts for pending slugs (73–154). Run from repo root:
   python3 frontend/scripts/generate-pending-story-files.py
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "data" / "scam-stories-content"

# (slug, hook) — hook used in **bold** snippets; use \u2019 not apostrophe in strings
STORIES: list[tuple[str, str]] = [
    ("paid-deposit-flat-wasnt-for-rent", "rental deposit for a flat that was not for rent"),
    ("landlord-in-another-country", "landlord always abroad—never met"),
    ("fake-listing-keys-never-arrived", "fake listing—keys never came"),
    ("lost-deposit-rental-scam", "deposit and landlord vanished"),
    ("owner-asked-wire-transfer-only", "wire only, no viewings"),
    ("vacation-rental-property-didnt-exist", "vacation rental did not exist"),
    ("roommate-scam-paid-upfront-room-taken", "roommate scam—paid upfront"),
    ("fake-real-estate-agent", "fake agent took deposit"),
    ("listing-used-someone-elses-photos", "stolen listing photos"),
    ("rent-to-own-paid-never-got-deed", "rent-to-own—no deed"),
    ("irs-hmrc-call-threatened-arrest", "fake tax office threatened arrest"),
    ("i-paid-back-taxes-to-scammer", "paid back taxes to impersonator"),
    ("fake-benefit-grant-pay-fee-unlock", "fake government grant unlock fee"),
    ("visa-cancelled-unless-you-pay", "visa cancelled unless you pay scam"),
    ("scammers-pretended-social-security", "fake Social Security callers"),
    ("fake-jury-duty-court-fine", "fake jury duty fine"),
    ("refund-from-tax-office-took-more", "fake tax refund took more money"),
    ("immigration-scam-forms-that-are-free", "paid for free immigration forms"),
    ("official-letter-that-wasnt", "official-looking letter was fake"),
    ("someone-opened-accounts-in-my-name", "accounts opened in my name"),
    ("identity-stolen-after-data-breach", "identity theft after breach"),
    ("fake-credit-fix-made-things-worse", "fake credit repair"),
    ("medical-identity-theft", "medical identity theft"),
    ("someone-filed-tax-return-in-my-name", "fraudulent tax return"),
    ("fake-benefits-advisor-wanted-ni-number", "fake benefits advisor"),
    ("found-out-ssn-was-being-misused", "SSN misused by someone else"),
    ("verify-identity-site-stole-it", "fake verify-identity site"),
    ("ordered-phone-got-empty-box", "empty box phone scam"),
    ("website-looked-like-real-brand", "clone brand website"),
    ("lost-money-fake-concert-ticket-site", "fake concert tickets"),
    ("puppy-pet-scam-animal-never-came", "pet scam—no puppy"),
    ("fake-designer-goods-cautionary-tale", "fake designer goods"),
    ("facebook-marketplace-deal-went-wrong", "Marketplace deal scam"),
    ("seller-asked-payment-outside-app", "pay outside app"),
    ("thought-buying-car-it-was-scam", "fake car sale"),
    ("subscription-trap-couldnt-cancel", "subscription trap"),
    ("free-trial-charged-me-for-year", "free trial full-year charge"),
    ("fake-antivirus-software-was-malware", "fake antivirus"),
    ("counterfeit-goods-my-story", "counterfeit goods online"),
    ("whatsapp-message-from-my-boss", "WhatsApp boss impersonation"),
    ("telegram-crypto-group-drained-wallet", "Telegram crypto drain"),
    ("fake-friend-request-real-loss", "fake friend request"),
    ("dm-promised-easy-money", "DM easy money scam"),
    ("friend-asked-receive-and-send-money", "money mule friend message"),
    ("instagram-brand-deal-wanted-bank-details", "Instagram brand deal scam"),
    ("discord-giveaway-was-scam", "Discord giveaway scam"),
    ("scammed-via-linkedin", "LinkedIn scam"),
    ("facebook-friend-hard-luck-story", "Facebook sob story"),
    ("whatsapp-wrong-number-investment-fraud", "WhatsApp wrong number investment"),
    ("how-my-parent-was-targeted", "family learned from parent targeted"),
    ("elderly-relative-sent-gift-cards-stranger", "relative sent gift cards"),
    ("grandchild-in-trouble-call-almost-believed", "almost believed grandchild scam"),
    ("romance-scam-older-adults-what-we-learned", "older adults romance lessons"),
    ("helped-parent-after-tech-support-scam", "family after tech support scam"),
    ("inheritance-scam-targeting-seniors", "inheritance scam seniors"),
    ("medication-health-scam-targeted-family", "health scam family"),
    ("financial-advisor-wasnt-who-they-said", "fake financial advisor"),
    ("scammed-twice-recovery-scam", "second scam recovery offer"),
    ("how-i-reported-it-what-happened-next", "after reporting"),
    ("what-i-wish-id-known-before-lost-money", "wish I had known"),
    ("signs-i-missed-looking-back-at-scam", "red flags in hindsight"),
    ("how-i-got-part-of-money-back", "partial recovery"),
    ("why-i-report-scams-now", "why I report now"),
    ("what-family-did-after-we-realised-scammed", "family after scam"),
    ("lawyer-recovery-agent-wanted-more-money", "recovery agent wanted more"),
    ("how-i-rebuilt-after-major-loss", "rebuilt after loss"),
    ("what-i-tell-others-about-this-scam", "what I tell others"),
    ("deepfake-ai-voice-scam", "AI deepfake voice"),
    ("qr-code-fake-payment-page", "malicious QR payment"),
    ("ai-bot-convinced-me-to-pay", "AI chatbot payment"),
    ("fake-app-in-store-looked-legitimate", "fake app in store"),
    ("crypto-support-took-my-keys", "crypto support seed phrase"),
    ("romance-scam-used-video-calls", "romance with video still fake"),
    ("job-scam-used-real-company-name", "job scam real company name"),
    ("scammer-used-my-social-media-against-me", "OSINT social scam"),
    ("verification-loop-never-ended", "endless verification phishing"),
    ("rental-scam-real-property-address", "real address fake landlord"),
    ("fake-government-grant-via-text", "text government grant fake"),
    ("refund-asked-for-screen-share", "refund screen share scam"),
    ("customer-support-was-the-scammer", "fake support number"),
    ("qr-code-parking-meter-paid-wrong-place", "parking QR scam"),
    ("update-payment-text-not-from-bank", "fake bank payment text"),
]


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def file_body(slug: str, hook: str) -> str:
    h = esc(hook)
    return f"""import type {{ StoryContent }} from './types';

const content: StoryContent = {{
  characterIntro:
    'This is my **first-person** story about **{h}**—anonymized so others can relate without shame.\u2029I was not careless; I was **human**.',
  initialPlot:
    'It started in a way that felt **normal**: messages, a site, or a call that matched what I expected.\u2029Pressure, urgency, or trust made me **act** before I verified.',
  scamExperience:
    'The pattern: **fake identity**, **fake platform**, or **stolen branding**—and requests for **money**, **access**, or **personal data**.\u2029I lost **money**, **time**, or **peace of mind** before I saw the full picture.',
  victimExperience:
    'I told myself I was **being careful enough**. Part of me had doubts, but I **did not** want to miss out or make things worse by delaying.\u2029That inner conflict is common—and **exploited**.',
  climax:
    'The moment it broke: a **real** company said they had **never** contacted me, a **payment** failed to deliver what was promised, or someone I trusted **vanished**.\u2029That is when I knew.',
  victimPain:
    'The **shame**, **stress**, and **loss** were real. Sorting banks, reports, and family conversations **took months**.\u2029I am not alone—and neither are you.',
  learningVictim:
    'I now know: **pause**, **verify through official channels**, and **never** send gift cards or wire money to strangers.\u2029I wish I had hung up or closed the tab sooner.',
  learningForReaders: [
    '**Verify** offers, landlords, employers, and "official" messages through **numbers and sites you look up yourself**.',
    '**Report** to the FTC, your bank, and local authorities when you lose money or data.',
  ],
}};

export default content;
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for slug, hook in STORIES:
        path = OUT / f"{slug}.ts"
        path.write_text(file_body(slug, hook), encoding="utf-8")
        print("wrote", path.relative_to(ROOT.parent))


if __name__ == "__main__":
    main()
