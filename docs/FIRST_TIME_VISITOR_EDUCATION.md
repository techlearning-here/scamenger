# Educating first-time visitors (persona-based approach)

How to help new visitors find the right path using intent-based entry points. See [PERSONAS.md](./PERSONAS.md) for the full persona set.

---

## Goal

First-time visitors often don't know where to start. Educating them in a **persona-based way** means letting them **self-identify by intent** ("I want to…") and then sending them to the right place in one click—without naming personas.

---

## Strategy

1. **Intent over labels** — Use "I want to…" or "I'm here to…" instead of persona names (e.g. "I want to learn about scams" not "Learner").
2. **One primary CTA per path** — Each path leads to one main destination (with optional secondary link). Avoid long lists.
3. **Placement** — Put the "Find your path" block **right after trust** (after hero + trust indicators, before mission or guides). First-time visitors see it before content that assumes they already know what they need.
4. **Keep paths few** — 5–6 paths cover all 12 personas when grouped by intent. More than 6 feels noisy.

---

## Recommended paths (for homepage "Find your path" block)

| Intent | Primary link | Secondary | Personas served |
|--------|--------------|-----------|------------------|
| I want to **learn** about scams | `/stories/` or scroll to Popular guides | `/us/scams/[slug]/` | Learner, Skeptic, Educator |
| I **was scammed** — I need to take action | `/immediate-help/` | `/report/`, `/emotional-support/` | Victim reporter, Recovery victim, Victim (emotional), Family/friend |
| I want to **protect** myself & my devices | `/tools/` | `/tools/protect-phone/`, etc. | Protector, Business |
| I need **help right now** (official links) | `/help-now/` | `/immediate-help/`, `/emotional-support/` | Recovery victim, Family/friend, Victim (emotional) |
| I want to **warn others** | `/report/` | `/stories/` (share), `/newsletter/` | Victim reporter, Scam Avenger, Advocate |
| I want to **stay updated** | `/newsletter/` | `/news/` | News seeker, Educator, Advocate, Scam Avenger |

---

## Implementation

- **Homepage:** Add a section titled **"Find your path"** or **"What do you need?"** with 5–6 cards. Each card: short headline (intent), one-sentence description, primary button/link, optional secondary link.
- **Nav / footer:** Ensure "Get help" (dropdown), "Report a scam," "Tools," "Stories," and "Newsletter" are visible so returning visitors and those who skip the block still find their path.
- **Optional:** On `/report/` thank-you page or `/immediate-help/`, add a line: "New here? See [Find your path](/#find-your-path) to explore guides, tools, and support."

---

## Copy guidelines for path cards

- Use second person ("you") and active verbs: "Learn how scams work," "Report a scam and get a shareable link," "Get your 0–24 hour checklist."
- Keep descriptions to one line so the block stays scannable.
- Avoid jargon; use "official reporting links" not "authority reporting portals."
