# Next web feature — recommendation

**Recommended next:** **Scam similarity matching (#1b)**

When a user views a report (by ID or via lookup), show: **"X other users reported this same [phone number / website / crypto address]."**  
This validates victims, encourages more reporting, and reuses existing data. It also builds the same “count by identifier” logic you’ll need for the **Unified scam checker (#1)**.

---

## Why #1b (similarity matching) next

1. **Uses existing data** — `report_type` + `report_type_detail` (phone, URL, crypto, IBAN) are already stored; we only need to count approved reports with the same normalized identifier.
2. **Immediate value** — On the public report page and lookup page, one line of copy (“5 other users reported this number”) increases trust and encourages reporting.
3. **Foundation for #1** — The backend “count (and optionally list) reports by identifier” is exactly what the unified checker needs; we can add a public API and a search UI later.
4. **Contained scope** — Backend: one endpoint (e.g. `GET /reports/similarity?report_type=phone&report_type_detail=+1234567890` or pass report id and derive type+detail). Frontend: call it when showing a report and display the count (and optional “View other reports” link). Normalization: for phone strip to digits; for URL use hostname or normalized URL; for crypto/IBAN use as-is or normalized form.

---

## Implementation outline

| Layer | Task |
|-------|------|
| **Backend** | Add endpoint that accepts `report_type` + `report_type_detail` (or report id), normalizes the detail, counts approved reports with same (report_type, normalized_detail), returns `{ count, report_ids? }`. Only count approved; exclude current report id if provided. |
| **Normalization** | Phone: strip non-digits, optional E.164. URL: extract hostname (and optionally path). Crypto/IBAN: optional lowercase/trim. |
| **Frontend** | On report detail (`ReportDetailClient`) and lookup result: if report has `report_type_detail`, call similarity endpoint; show “X other users reported this [phone/website/etc.]” and optionally link to a list of those reports. |
| **Index** | For performance, consider an index on `(status, report_type, report_type_detail)` or a generated normalized column (e.g. `report_type_detail_normalized`) for lookups. |

---

## Alternatives (if you prefer a different next step)

| Feature | Why consider |
|---------|----------------|
| **Unified scam checker (#1)** | Phase 1 MVP, high traffic potential. Larger scope: search bar on home/layout, detect type from paste, results page with count + list. Doing #1b first gives you the backend and UI pattern; #1 then adds the entry point and “paste anything” flow. |
| **Progress indication (#5)** | After selecting a scam type, show “Report → Track → Prevent”. Pure frontend on existing scam type pages; low effort, improves clarity. |
| **Emotional support resources (#27c)** | Done — country-based emotional support page exists. Consider **"Did this help?" voting (#11b)** instead: upvote/downvote on reports; social proof + ranking. |

---

## After #1b

- **Unified scam checker (#1)** — Add prominent “Paste anything suspicious” search; reuse similarity/count API and add a public lookup by identifier.
- **Multi-country support (#3b)** — Add country selector and localized authorities (UK, AU, CA, India, EU) so reports and guides are region-aware.
