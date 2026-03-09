# Scam report rating categories (1–5 stars)

## Research summary

- **Crowdsourced trust platforms** (e.g. TrustTheCrowd, VeriBureau) stress **Relevant, Recent, Real, Reliable** and dimensions like review quality, consistency, and transparency.
- **Scam/fraud reporting services** are rated by users on **reliability**, **usefulness**, **accuracy**, and **transparency**; low ratings often reflect skepticism about effectiveness or fairness.
- **Multi-criteria star ratings** (restaurants, hotels, products) use domain-specific dimensions (e.g. quality, service, completeness); multiple dimensions improve transparency and help surface fraudulent or low-quality content.

For **scam reports** specifically, ratings should help:
1. Surface fraudulent or fake reports (credibility).
2. Signal how useful the report is to the community (usefulness).
3. Indicate quality of information (completeness).
4. Align with the product idea: “This happened to me too” / “Not relevant” (relevance).

---

## Recommended rating categories (1–5 stars each)

| # | Category       | Label (short) | Question / description | 1 (low) → 5 (high) |
|---|----------------|---------------|------------------------|---------------------|
| 1 | **Credibility**  | Credibility   | How believable or accurate does this report seem? | Not credible → Very credible |
| 2 | **Usefulness**   | Usefulness    | How helpful would this report be to others?       | Not helpful → Very helpful |
| 3 | **Completeness** | Completeness  | How complete is the information in this report?   | Very incomplete → Very complete |
| 4 | **Relevance**    | Relevance     | How relevant is this to your experience?          | Not relevant to me → This happened to me too |

- **Credibility** helps surface fake or misleading reports.
- **Usefulness** reflects community value.
- **Completeness** is a simple quality signal.
- **Relevance** matches the FeatureList idea (“This happened to me too” / “Not relevant”) and gives a clear “me too” signal for aggregation.

All four use a **1–5 star** scale. Only authenticated users can rate (per P0). Stored per user per report (one rating per user per report, or allow update).

---

## Optional: single overall star

Some implementations use one overall “How would you rate this report?” (1–5) instead of, or in addition to, the four dimensions. For MVP, the four dimensions above are recommended; an overall score can be derived (e.g. average) for display.

---

*References: TrustTheCrowd, VeriBureau methodology, multi-criteria rating research (CBX, OpenTable-style dimensions), scam/fraud platform user feedback (ReportScammedfunds, Scam-detector, Trustpilot).*
