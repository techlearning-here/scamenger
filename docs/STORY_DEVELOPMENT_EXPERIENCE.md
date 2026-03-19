# Experience from the story development process

This document captures **suggestions and requirements** provided during the scam story development process, and how they were reflected in the skill, CSV workflow, and documentation. Use it to understand why the workflow is shaped this way and to onboard future writers or agents.

---

## 1. Story style (user requirement)

**Suggestion:** Stories should be **narrative**, **first-person**, and have an **emotional touch**.

**Reflection:**

- **Narrative:** Tell the story as a continuous first-person account; avoid bullet-style or dry lists in the main sections.
- **First-person:** Use "I felt", "I thought", "I lost"—never "the victim" or "they" for the narrator.
- **Emotional touch:** Name feelings (hopeful, ashamed, rushed, afraid); include inner voice ("I told myself…", "Part of me wondered…"); validate the victim; avoid "I should have known."

This is enforced in the skill and in **docs/SCAM_STORIES_STRUCTURE_for_Writer.md** so every generated story matches the same tone.

---

## 2. CSV as input (user requirement)

**Suggestion:** Input should be a **CSV file** containing story title, category, optional angle/region, and status. Initial status should be `pending`.

**Reflection:**

- CSV is the single source of truth for the queue: one row per story, with columns that support both **local/Cursor skill** runs and **cloud/external** story generation.
- **Status** drives what gets processed: only `pending` rows are picked; after a story is created, status is set to `done` and the CSV is written back so progress is persisted and the next run only sees remaining work.
- Optional **angle/region** gives the writer a hint (e.g. "India", "retiree") without changing the schema.

---

## 3. Batch size (user requirement)

**Suggestion:** Accept a **batch size** (1 or more). If batch size is greater than the number of pending stories, reset it internally to the maximum number of pending stories (i.e. process all pending).

**Reflection:**

- **Effective batch size** = min(user batch size, number of pending rows). No error if user asks for 10 but only 3 are pending; we just process 3.
- If there are 0 pending, the agent does nothing and reports that.
- Batch size is optional when **serial number** is used (see below).

---

## 4. Status update after completion (user requirement)

**Suggestion:** After completion of stories, the **status** column in the CSV must be set to `done` for the rows that were processed.

**Reflection:**

- The skill (and any integration script) must **write the CSV back** to the same path after marking processed rows as `done`. This keeps the queue accurate and avoids reprocessing.
- Only rows that were **successfully** generated should be marked `done`; partial failures should leave failed rows as `pending`.

---

## 5. Serial number (user requirement)

**Suggestion:** Add a **serial number** as the first column so the skill can take either serial number alone or serial number and batch size. If only serial number is given, treat **batch size as 1**.

**Reflection:**

- **serial_number** is 1-based and unique per row (1, 2, 3, …). It gives a stable way to refer to a specific story in the queue.
- **Invocation modes:**
  - **Serial only:** CSV path + serial number → process that one row if pending (batch size = 1).
  - **Serial + batch size:** CSV path + serial number + batch size → process up to that many pending rows starting from that serial (e.g. "from serial 10 with batch size 3").
  - **Batch size only:** CSV path + batch size (no serial) → process the first N pending rows (backward compatible).
- This supports both "process story #5" and "process stories 10–12" without changing the CSV structure.

---

## 6. Story file name for cloud integration (user requirement)

**Suggestion:** Add a column for the **name of the story file** so that after cloud code finishes story creation, you can copy that file to integrate it with the frontend.

**Reflection:**

- **story_file** column added (e.g. `pump-and-dump-fake-guru-investment-group.json`). Convention: `{slug}.json`.
- Cloud (or any external) code should **write one file per story** using this name. The CSV then tells you exactly which file corresponds to which row, so copy/integration scripts can map filename → slug → `STORY_CONTENT[slug]` and listing entry.
- The export script that generates the queue CSV fills **story_file** from the slug so the queue is always consistent with the codebase.

---

## 7. Expected output format from cloud code (user question)

**Suggestion / question:** What is the expected output file format from the cloud code?

**Reflection:**

- Documented in **docs/STORY_CLOUD_OUTPUT_FORMAT.md**.
- **Format:** One **JSON file per story**, filename = `story_file` from the CSV. The JSON object must have the same keys as the frontend `StoryContent` type: `characterIntro`, `initialPlot`, `scamExperience`, `victimExperience`, `climax`, `victimPain`, `learningVictim`, `learningForReaders` (array of strings).
- Paragraph breaks can use `\u2029`; bold via `**...**`; apostrophes in the final TS strings as `\u2019` where needed. The doc includes a minimal example and integration steps (ensure listing in `scam-stories.ts`, add `scam-stories-content/{slug}.ts` and register in `index.ts`, set CSV status to `done`).

---

## 8. Template batches vs. final copy (SEO & voice)

**Context:** For speed, large batches of stories were sometimes created with a **shared template** opener and generic section text, then dropped into `frontend/src/data/scam-stories-content/{slug}.ts`.

**Reflection:**

- **Template-driven files are not “final” for SEO or read-aloud/voice:** search engines and listeners benefit from **unique**, **story-specific** scenes, stakes, and reader takeaways (same structure as hand-written batches: distinct `characterIntro` through `learningForReaders`, `\u2029` breaks, consistent bolding).
- **Plan a gradual swap:** treat template output as **placeholder** until each slug is replaced with richer first-person copy aligned with **docs/SCAM_STORIES_STRUCTURE_for_Writer.md**.
- **Optional tooling:** `frontend/scripts/generate-pending-story-files.py` can bootstrap files; enrichment is a **separate editorial** step—do not assume the Python output is publish-quality narrative.

---

## 9. Summary: CSV columns and workflow

| Column            | Purpose |
|-------------------|--------|
| serial_number     | 1-based row index; used with serial-only or serial + batch size. |
| title             | Story title (listing + slug derivation if slug missing). |
| category          | `ScamCategoryId` for listing and filtering. |
| angle_or_region   | Optional hint for the writer. |
| status            | `pending` → to be processed; `done` → already integrated. |
| story_file        | Output filename for cloud-generated content (e.g. `{slug}.json`) for copy/integration. |

**Workflow:** CSV + (serial and/or batch size) → select pending row(s) → generate story (in-repo or cloud) → update listing + content (or copy JSON into frontend) → set row status to `done` and save CSV.

---

## 10. Where it’s documented

| Topic                    | Location |
|--------------------------|----------|
| Story style & structure  | `docs/SCAM_STORIES_STRUCTURE_for_Writer.md` |
| Skill (serial, batch, CSV) | `.cursor/skills/scamenger-story-writer/SKILL.md` |
| CSV format & invocation  | `docs/STORY_CREATION_SKILL_GUIDE.md` (§4) |
| Cloud output format     | `docs/STORY_CLOUD_OUTPUT_FORMAT.md` |
| Full queue (with serial & story_file) | `docs/story-queue.csv` (generated by `frontend/scripts/export-story-queue-csv.mjs`) |
| Example queue            | `docs/story-queue-example.csv` |

This experience doc ties your suggestions to the current design so the rationale stays clear as the process evolves.
