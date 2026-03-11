# Mobile app — feature vision and synthesis

**Purpose:** Enable users to report unsolicited or scam phone calls quickly from their phone and to benefit from collective reporting (e.g. alerts and escalation to authorities). This document synthesizes the original vision and proposes additional mobile-specific features.

**Implementation timing:** Mobile app and these features are planned **after** gathering public feedback on the rest of Scamenger’s features (web reporting, help-now, emotional support, country-specific flows, etc.). Prioritize core web experience and user feedback before building the mobile app.

---

## 1. Core vision (from original doc)

- **Mobile app** so users can report scam or unsolicited calls **easily** from their device.
- **Voice-to-text** to describe the scam by speaking; the app converts speech to text for the report narrative.
- **Threshold-based escalation:** When the **same phone number** is reported by **multiple users** and crosses a **configurable threshold**, the system can **report it to that country’s authorities** (or designated body) to help counter spam/scam calls.

---

## 2. Synthesized core features

| # | Feature | Description |
|---|---------|-------------|
| **M1** | **Quick report — scam/unsolicited call** | From the app, user can report a phone number (and optionally SMS/WhatsApp) with minimal steps: number (pre-filled from call log if permitted), country of origin, scam type, optional narrative. Same data model as web report; shareable report URL. |
| **M2** | **Voice-to-text for narrative** | User can record or speak their description of the scam; app uses speech-to-text to fill the narrative field. Reduces friction for reporting right after a call. Supports **local-language voice → text**, with optional **translation to English** for the stored narrative (see M13). |
| **M3** | **Report-from-call-log** | After a call, user can open the app and “Report this number” with the number taken from the device call log (with user consent). One-tap to start a report for the last incoming/outgoing number. |
| **M4** | **Threshold-based escalation to authorities** | Configurable per-country threshold (e.g. “report to authority when this number has ≥ N reports”). When threshold is met, system generates a summary (no PII) and submits or notifies the relevant authority (or partner). Helps turn crowd-sourced data into official action. |

---

## 3. Additional mobile app features (suggested)

| # | Feature | Description |
|---|---------|-------------|
| **M5** | **Look up number before answering** | Incoming call screen shows a short risk line: “X reports” or “Reported as scam” if the number exists in Scam Avenger (or linked) database. Requires OS integration (CallKit / Android equivalent) or optional dialer/overlay. |
| **M6** | **SMS / WhatsApp report type** | Report scam SMS or WhatsApp contact (phone number + optional screenshot or paste of message). Reuses same report flow and phone-number aggregation as M1/M4. |
| **M7** | **Offline draft reports** | Save report as draft when offline; submit when back online. Important for areas with patchy connectivity or when user is in a hurry after a call. |
| **M8** | **Push notifications — alerts** | Push when a number the user reported is confirmed or escalated, or when a new scam trend in their region/category is published. Drives re-engagement and trust. |
| **M9** | **Quick actions after call** | Post-call prompt: “Was that a scam call? Report it.” with one tap to open the app with the number pre-filled (subject to OS/permissions). |
| **M10** | **Scam guides and “what to do” on mobile** | Same scam-type guides and “Report → Track → Prevent” content as web, optimized for small screens and one-handed use. Deep links from report flow to relevant guide. |
| **M11** | **Country and language** | Use device locale/carrier to pre-select country and language; show reporting authorities and escalation rules for that country (aligned with M4). |
| **M12** | **Lightweight “check this number”** | Standalone screen: enter number → see “X reports” / “No reports yet” and optional link to full report list. Reuses unified checker logic from web when available. |
| **M13** | **Local-language voice → text → English** | User speaks in their **local language**; app transcribes via speech-to-text in that language, then **translates the narrative to English** before saving (or offers both original + English). Ensures reports are searchable and usable in a common language for moderation, authorities, and cross-country trends while still allowing submission in the user’s language. |

---

## 4. Technical and product notes

- **Backend:** Reuse existing report API and phone-number reporting; add optional “authority escalation” job and config (thresholds, per-country endpoints or templates).
- **Data:** Same report schema (phone as report type); aggregation by phone number + country for thresholds and “X reports” (see FeatureList.md — unified scam checker, similarity matching).
- **Privacy:** Escalation to authorities must use only aggregated/anonymized data; no PII in automated submissions. Consent and terms should cover “share with authorities when threshold is met.”
- **Config:** Threshold (e.g. 5, 10, 20 reports) and “escalation on/off” per country or globally; store in site_settings or dedicated config table.
- **Voice + translation (M2, M13):** Speech-to-text can use device/OS APIs (e.g. on-device) or a cloud STT service; translation to English typically requires a translation API (e.g. Google Translate, Azure). Consider storing both original language text and English for transparency and moderation; display in app according to user language preference.

---

## 5. Link to main feature list

- **Report type “phone”** and report form: see **FeatureList.md** §0 and §4 (report scams form).
- **Unified scam checker** (search by phone/URL/etc.) and **similarity matching** (“X users reported this number”): FeatureList.md §1 and §4 (1b).
- **Multi-country support** and authorities: FeatureList.md §1 (3b), §2 (4b).

When the mobile app is built, these mobile features can be added to FeatureList.md under a dedicated “Mobile app” section with status (Planned / Missing / Done).
