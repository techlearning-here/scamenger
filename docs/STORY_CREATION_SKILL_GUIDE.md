# Guide: Delegate scam story creation to a Cursor Cloud skill

This guide explains how to create a **Cursor skill** (Cloud/personal or project) that generates full scam story content matching your current story page format (e.g. pump-and-dump, LPG). You can then delegate story creation for your **152 pending stories** by invoking the skill with a slug/title/category instead of repeating the same prompt each time.

---

## 1. What the skill will do

- **Input:** One pending story at a time: `slug`, `title`, and `category` (from your existing `SCAM_STORY_ENTRIES` list).
- **Output:** Full story content in the exact shape your app expects:
  - **Listing:** Ensure the entry exists in `frontend/src/data/scam-stories.ts` (slug, title, category).
  - **Content:** One file per story in `frontend/src/data/scam-stories-content/{slug}.ts` with all eight sections, first-person, anonymized, with **bold** (`**...**`) and paragraph breaks (`\u2029`).

The skill teaches the agent the **structure**, **tone**, **format rules**, and **file locations** so it can generate one story per invocation that you can paste or review.

---

## 2. Prerequisites and references

Before creating the skill, have these in the project:

| Resource | Path | Purpose |
|----------|------|---------|
| Writer structure & rules | `docs/SCAM_STORIES_STRUCTURE_for_Writer.md` | Section order, emotional goals, length, format (bold, `\u2029`). |
| Content type & example | `frontend/src/data/scam-stories-content/` | `types.ts` has `StoryContent`; one file per story (e.g. pump-and-dump, LPG). |
| Entry type & categories | `frontend/src/data/scam-stories.ts` | `ScamStoryEntry` (slug, title, category), `ScamCategoryId`, `HARDSHIP_TAG_LABELS`. |
| Category IDs | `frontend/src/data/scams/types.ts` | `ScamCategoryId`: `online`, `phone`, `financial`, `impersonation`, `employment`, `housing`, `prizes_charity`, `identity_benefits`, `government`, `emerging`, `other`. |

The skill should **reference** these (or embed the essential parts) so the agent reads them when applying the skill.

---

## 3. Step-by-step: Create the skill

### Step 3.1 Choose skill location

- **Project skill (recommended):** `.cursor/skills/scamenger-story-writer/`  
  - Shared with the repo; anyone can use “create a story for slug X.”
- **Personal skill:** `~/.cursor/skills/scamenger-story-writer/`  
  - Only on your machine; use if the project is private or you don’t want the skill in the repo.

Create the directory:

```bash
mkdir -p .cursor/skills/scamenger-story-writer
```

### Step 3.2 Create `SKILL.md` with frontmatter and instructions

Create `.cursor/skills/scamenger-story-writer/SKILL.md` with:

**Frontmatter (required):**

```yaml
---
name: scamenger-story-writer
description: >-
  Generates full scam experience story content for Scam Avenger stories: eight sections
  (character intro, initial plot, scam experience, victim experience, climax, victim pain,
  learning victim, learning for readers), first-person anonymized, with bold and paragraph
  breaks. Use when the user asks to create or write a scam story, add story content for
  a slug, or generate a story for one of the pending story titles.
---
```

**Body:** Concise instructions that point to the writer doc and the codebase.

- **Section order** (strict): Character intro → Initial plot → Scam experience → Victim's experience → **Climax** → **Victim's pain** → Learning (victim) → Learning for readers.
- **Format:** No visible headings; bold via `**...**`; paragraph breaks via `\u2029` inside a section string.
- **Files to update:**
  - Listing: `frontend/src/data/scam-stories.ts` — add or confirm `ScamStoryEntry` for the slug (slug, title, category; optional hardshipTag).
  - Content: `frontend/src/data/scam-stories-content/{slug}.ts` — add one file per story exporting a default `StoryContent` object (all eight fields; `learningForReaders` is string array) and register it in `index.ts`.
- **Tone:** First-person, anonymized, emotional but not sensational; name feelings (hopeful, ashamed, etc.); validate, don’t lecture.
- **Categories:** Use one of the existing `ScamCategoryId` values from `frontend/src/data/scams/types.ts`.

Keep SKILL.md under ~500 lines; put long examples or full section prompts in a separate reference file.

### Step 3.3 Create a reference file (recommended)

Create `.cursor/skills/scamenger-story-writer/reference.md` and put there:

- The full **section definitions and prompts** from `docs/SCAM_STORIES_STRUCTURE_for_Writer.md` (Section 4).
- The **format and publishing rules** (Section 5): no headings, bold, `\u2029`, content in frontend only.
- **One complete example** (e.g. pump-and-dump) as a copy-paste reference for the exact TypeScript shape: string fields with `\u2029` and `\u2019` for apostrophes where needed, and `learningForReaders` as an array of strings.

In `SKILL.md`, add a line: “For section prompts and format rules, see [reference.md](reference.md).”

### Step 3.4 Optional: example story snippet in the skill

In `SKILL.md` or `reference.md`, include a **short** example showing only the structure, not the full text:

```ts
// One entry in STORY_CONTENT (slug as key):
'your-scam-slug': {
  characterIntro: 'First-person 1–3 sentences. Use **bold** for key emotions.',
  initialPlot: 'How they encountered the scam. Paragraph two after \\u2029.',
  scamExperience: 'Mechanics: what happened. Use \\u2029 between paragraphs.',
  victimExperience: 'What they thought/felt at the time.',
  climax: 'Turning point—realization or point of no return.',
  victimPain: 'Emotional and practical impact. Comes after climax.',
  learningVictim: 'What they learned; red flags they see now.',
  learningForReaders: [
    '**First takeaway** with bold where needed.',
    'Second takeaway.',
  ],
},
```

Mention that apostrophes inside single-quoted strings must be `\u2019` (or escaped) to avoid breaking the string.

---

## 4. CSV-driven batch workflow (recommended for many stories)

Stories can be driven from a **CSV file** using a **serial number** (and optional **batch size**). The agent reads selected pending rows, generates narrative first-person emotional stories, then updates the CSV **status** to `done` so progress is persisted.

### CSV format

| Column | Required | Description |
|--------|----------|-------------|
| **serial_number** | Yes | 1-based row index (1, 2, 3, …). Used as input to select which story(ies) to generate. |
| **title** | Yes | Story title (used in listing and for slug derivation if slug is empty). |
| **category** | Yes | Must be a valid `ScamCategoryId` (e.g. `financial`, `online`, `impersonation`). |
| **angle_or_region** | No | Optional angle (e.g. "retiree") or region (e.g. "India") for the writer. |
| **status** | Yes | `pending` = to be processed; `done` = already generated. New rows should start as `pending`. |
| **story_file** | Yes | Name of the output file for this story when generated by cloud code (e.g. `{slug}.json`). After cloud code finishes, copy this file and integrate into the frontend; see **docs/STORY_CLOUD_OUTPUT_FORMAT.md** for the expected format. |
| **slug** | No | If present and non-empty, used as the story slug; otherwise derived from title (lowercase, hyphens). |

- **Header row:** `serial_number,title,category,angle_or_region,status,story_file` (serial_number first; story_file gives the output filename for cloud-generated content).
- **Encoding:** UTF-8. Use quotes for fields that contain commas.

Example CSV (see also `docs/story-queue-example.csv` and full queue `docs/story-queue.csv`):

```csv
serial_number,title,category,angle_or_region,status,story_file
1,"The guru and the pump-and-dump group",financial,,"pending",the-guru-and-the-pump-and-dump-group.json
2,LPG payment pending link phone hijacked,online,India,"pending",lpg-payment-pending-link-phone-hijacked.json
```

### Cloud output format and integration

When story content is produced by **cloud code** (or any external process), each story should be written to a file whose name is the CSV’s **`story_file`** for that row (e.g. `pump-and-dump-fake-guru-investment-group.json`). The expected format is **JSON** with keys matching the frontend’s `StoryContent` type. After cloud code finishes, convert each JSON to a `frontend/src/data/scam-stories-content/{slug}.ts` file and register it in `index.ts` (and ensure listing entries exist in `scam-stories.ts`). Full details, example JSON, and integration steps: **docs/STORY_CLOUD_OUTPUT_FORMAT.md**.

### Serial number and batch size

- **Serial number only:** Give CSV path + serial number (e.g. "process story at serial 5"). Batch size is **1**; the agent processes only the row with that `serial_number` if it is `pending`.
- **Serial number + batch size:** Give CSV path + serial number + batch size (e.g. "from serial 10 with batch size 3"). The agent selects pending rows with `serial_number` ≥ that serial, in order, and processes up to that many.
- **Batch size only (no serial):** Give CSV path + batch size. The agent processes the first N pending rows in the CSV.

Effective batch size is capped by the number of pending rows in the selected range (e.g. if you ask for serial 10 and batch 5, but only 3 pending rows exist from serial 10 onward, only 3 are processed).

### Status update after completion

- After each story is successfully generated (listing + content added), the agent sets that row’s **status** to `done` in the CSV.
- The agent **writes the CSV file back** to the same path so the next run only processes remaining `pending` rows.

### How to invoke

- *"Process stories from `docs/story-queue.csv` at serial 5."* (batch size 1)
- *"Process stories from `docs/story-queue.csv` from serial 10 with batch size 3."*
- *"Process stories from `docs/story-queue.csv` with batch size 5."* (first 5 pending rows)

The agent will: (1) read CSV and select row(s) by serial and/or batch size, (2) for each selected row generate full story and update `scam-stories.ts` and add `scam-stories-content/{slug}.ts` (and register in `index.ts`), (3) set those rows’ status to `done` and save the CSV, (4) report how many were done and how many remain pending.

---

## 5. How to delegate story creation (other workflows)

### Option A: One story per message (for quality review)

1. **Pick one pending story** from your list (e.g. from `SCAM_STORY_ENTRIES` that doesn’t yet have a file in `scam-stories-content/`).
2. **Invoke the skill** with a clear request, for example:
   - “Using the scamenger-story-writer skill, create the full story content for the story with slug `romance-scam-lasted-two-years`, title `Two years of "us"—then I found out who he really was`, category `impersonation`.”
   - Or: “Add story content for slug `email-looked-like-from-my-bank` (title: The email looked exactly like my bank's. It wasn't.; category: online).”
3. **Agent (with skill):** Reads the skill + reference, generates the eight sections, and edits:
   - `frontend/src/data/scam-stories.ts` (if the entry is missing),
   - `frontend/src/data/scam-stories-content/{slug}.ts` (and registration in `index.ts`).
4. **You:** Review the diff, run the app, and check the story page. Then repeat for the next slug.

### Option B: Batch list for the agent

1. **Provide a list** of pending stories (slug, title, category) in one message, e.g.:
   - “Here are the next 5 stories I need. Create full content for each using the scamenger-story-writer skill: 1) slug `xyz`, title `...`, category `financial`; 2) …”
2. **Agent:** Creates content for each in turn (or one by one if you prefer), editing the same two files.
3. **You:** Review each addition; revert or edit if something is off.

### Option C: You write the prompt, agent fills the structure

1. **You:** “Use the story writer skill. Slug: `job-scam-xyz`, title: `The “employer” never sent the contract`, category: `employment`. Focus the victim on someone who lost their job and was desperate for work.”
2. **Agent:** Generates all eight sections following the skill and reference, with that angle in mind.

---

## 6. Input checklist for each story

When you delegate, include (or the skill can ask for):

| Item | Example | Required |
|------|---------|----------|
| **slug** | `pump-and-dump-fake-guru-investment-group` | Yes (kebab-case, unique). |
| **title** | `The "guru" and the pump-and-dump group that cleaned me out` | Yes (matches listing). |
| **category** | `financial` | Yes; must be a valid `ScamCategoryId`. |
| **Optional: angle or region** | “Victim was a retiree”; “India, LPG scam” | No but helps. |

The skill should state that **slug must already exist** in `SCAM_STORY_ENTRIES` (or the agent must add it when adding content).

---

## 7. Output checklist (what the agent must produce)

- [ ] **Listing:** `frontend/src/data/scam-stories.ts` contains an entry `{ slug, title, category }` for this story (and optional `hardshipTag` if needed).
- [ ] **Content:** `frontend/src/data/scam-stories-content/{slug}.ts` exists and is registered in `index.ts` with a full `StoryContent` default export.
- [ ] **StoryContent fields:** `characterIntro`, `initialPlot`, `scamExperience`, `victimExperience`, `victimPain`, `climax`, `learningVictim`, `learningForReaders` (array).
- [ ] **Format:** No visible section headings; key phrases in **bold** (`**...**`); multiple paragraphs within a section separated by `\u2029`; apostrophes in strings use `\u2019` where necessary to avoid breaking the string.
- [ ] **Tone:** First-person, anonymized, emotional but respectful; victim’s pain after climax; learning for readers as 2–4 actionable bullets.

---

## 8. Skill discovery and triggering

- **Discovery:** The skill’s `description` in the frontmatter should include phrases like “create scam story,” “add story content,” “generate story for slug,” “pending stories,” so the agent (or you via @-mention) can find it.
- **Trigger:** When you say “create the story for slug X” or “add content for the next pending story,” the agent should load this skill and follow it.
- **@-mention (if supported):** You can explicitly invoke the skill, e.g. “@scamenger-story-writer create story for slug …”.

---

## 9. Reducing repetition across 152 stories

- **Do one story per request** when you want to review each (recommended at first).
- **Reuse the same prompt template** and only change slug/title/category (and optional angle), e.g.:
  - “Using the story writer skill, create full content for: slug `[SLUG]`, title `[TITLE]`, category `[CATEGORY]`.”
- **Batch in small groups** (e.g. 3–5) if the agent can handle multiple in one go; always review before committing.
- **Keep a list** of slugs you’ve already filled (e.g. in a spreadsheet or a markdown file) and tick them off so you don’t repeat.

---

## 9. Quick reference: file paths and types

| What | Where |
|------|--------|
| Add/update story **listing** | `frontend/src/data/scam-stories.ts` → `SCAM_STORY_ENTRIES` |
| Add/update story **content** | `frontend/src/data/scam-stories-content/{slug}.ts` + `index.ts` |
| Story structure & rules | `docs/SCAM_STORIES_STRUCTURE_for_Writer.md` |
| Categories | `frontend/src/data/scams/types.ts` → `ScamCategoryId` |
| Reference example (full) | `frontend/src/data/scam-stories-content/` → `pump-and-dump-fake-guru-investment-group.ts` and `lpg-payment-pending-link-phone-hijacked.ts` |

---

## 11. Summary

1. **Create** `.cursor/skills/scamenger-story-writer/SKILL.md` (and optional `reference.md`) with the description, section order, format rules, and file locations above.
2. **Point** the skill at `docs/SCAM_STORIES_STRUCTURE_for_Writer.md` and at the pump-and-dump / LPG examples in `scam-stories-content/`.
3. **Delegate** by CSV: provide a CSV path and batch size; the agent processes up to N pending rows, generates narrative first-person emotional stories, and sets status to `done` in the CSV. Or delegate one-by-one: “Create story content for slug X, title Y, category Z” (and optional angle).
4. **Review** each generated story and the diff in the two data files (and CSV status updates).
5. **Repeat** (next batch or next slug) until all pending stories are filled.

This way you avoid repeating the long “how to write a story” prompt every time and rely on the skill to keep format and structure consistent.

---

## 12. Ready-to-use skill in this repo

A project skill is already set up at **`.cursor/skills/scamenger-story-writer/SKILL.md`**. It contains the frontmatter, section order, format rules, file paths, and delegation notes. The agent will load it when you ask to create a story for a slug.

**Try it (one story):** In chat, say: *"Using the scamenger story writer skill, create the full story content for slug `romance-scam-lasted-two-years`, title (use the exact title from the list), category `impersonation`."* Then review the edits to `scam-stories.ts` and the new file in `scam-stories-content/`.

**Try it (CSV batch):** Use a CSV with columns `serial_number,title,category,angle_or_region,status,story_file` (see `docs/story-queue-example.csv` or full `docs/story-queue.csv`). For **steps and example prompts** (serial only, serial + batch size, batch size only), see the skill: **`.cursor/skills/scamenger-story-writer/SKILL.md`** → "Steps to use this skill" and "Example prompts (CSV and arguments)". Example: *"Process story at serial 3 from `docs/story-queue.csv`."* (batch size 1), or *"Process from serial 1 with batch size 2."* The agent will generate the selected pending stories and set their status to `done` in the CSV.
