---
name: scamenger-story-writer
description: >-
  Generates full scam experience story content for Scam Avenger: narrative, first-person,
  emotional stories in eight sections. Input: CSV file (serial_number, title, category,
  optional angle/region, status, story_file) and either serial number (batch size 1) or
  serial number + batch size. Updates CSV status to done after each batch. One run = story creation + website integration (index listing, links, story page, sitemap, feed). User expectations
  (style, CSV as queue, batch/serial, story_file for cloud) are in the skill and in
  docs/STORY_DEVELOPMENT_EXPERIENCE.md. Cloud output format: docs/STORY_CLOUD_OUTPUT_FORMAT.md.
  Use when the user asks to create scam stories from a CSV, run a batch by serial number,
  or produce story files for frontend integration.
---

# Scamenger story writer

Generate scam stories that are **narrative**, **first-person**, and **emotionally engaging**. Stories can be driven from a **CSV file** using a **serial number** (and optional **batch size**); after completing each batch, update the CSV **status** column to `done`.

**One run = story creation + full website integration.** When you edit `scam-stories.ts` and add a story file under `scam-stories-content/` (one file per story: `{slug}.ts`), the story is automatically listed on the stories index page, linked from the index, and rendered on its `/stories/[slug]` page; the sitemap and RSS feed also include it. No separate integration step is needed.

**Path resolution:** All paths in this skill (e.g. `docs/story-queue.csv`, `docs/STORY_CLOUD_OUTPUT_FORMAT.md`, `frontend/src/data/scam-stories-content/`) are relative to the **project/workspace root** (the repository root where the skill is used), not relative to the skill file’s location (`.cursor/skills/scamenger-story-writer/`). When the agent runs in the scamenger repo, `docs/` and `frontend/` resolve to that repo’s `docs/` and `frontend/` directories. Use these paths as-is in prompts (e.g. “from `docs/story-queue.csv`”). The skill's own **reference** is **`.cursor/skills/scamenger-story-writer/reference.md`** (section definitions, emotional goals, copy-paste prompts, and format rules).

## When to use

- User provides a **CSV file** path and **serial number** (and optionally **batch size**) to process pending stories.
- User asks to "create stories from CSV", "process story at serial N", "process stories from serial S with batch size N".

## User expectations (read this for clarity)

The following expectations apply whether you run **in-repo** (editing TS directly) or produce **cloud output** (e.g. JSON files for later integration). For full rationale, read **docs/STORY_DEVELOPMENT_EXPERIENCE.md**.

- **Story style:** Narrative, first-person, emotional. No bullet-style in main sections; name feelings and inner voice; validate the victim; avoid "I should have known."
- **CSV is the queue:** One row per story; only `pending` rows are processed. After a story is successfully created, set that row's `status` to `done` and **write the CSV back** so progress is persisted.
- **Batch size:** Effective batch = min(requested batch size, number of pending rows). If only serial is given, batch size = 1. If 0 pending, do nothing and report.
- **Serial number:** First column (1-based). Enables "process story #5" (serial only → 1 row) or "from serial 10 with batch size 3" (range of pending rows).
- **Story file (cloud):** The CSV column `story_file` (e.g. `{slug}.json`) is the expected output filename. Cloud code should write one file per story with that name; see **docs/STORY_CLOUD_OUTPUT_FORMAT.md** for the exact JSON shape. After integration, set the row's status to `done` and save the CSV.

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| **CSV file path** | Yes | Path to a CSV with columns: `serial_number`, `title`, `category`, `angle_or_region` (optional), `status`, `story_file`. Optional column: `slug`. |
| **Serial number** | When using serial | Row number (1-based) in the CSV. Used to select which row(s) to process. |
| **Batch size** | Optional | Integer ≥ 1. If **only serial number** is given, treat **batch size = 1**. If serial number and batch size are both given, process up to that many pending rows starting from that serial. If only batch size is given (no serial), process the first N pending rows. |

**Invocation modes:**

1. **Serial only:** CSV path + serial number → batch size = 1. Process the single row with that `serial_number` if it is `pending`.
2. **Serial + batch size:** CSV path + serial number + batch size → among rows with `serial_number` ≥ given serial and `status` = `pending`, take the first **batch size** rows in order and process them.
3. **Batch size only (legacy):** CSV path + batch size (no serial) → process the first **batch size** pending rows in the CSV.

## Steps to use this skill

1. **Have a CSV queue** with columns `serial_number,title,category,angle_or_region,status,story_file`. Use `docs/story-queue.csv` (full list) or `docs/story-queue-example.csv` (sample). Rows to process must have `status` = `pending`.
2. **Choose how to select stories:** one by serial number, a range (serial + batch size), or the first N pending (batch size only).
3. **Invoke the skill** with a clear prompt: give the **CSV file path** and the **arguments** (serial number and/or batch size). See example prompts below.
4. **Agent actions:** Reads the skill + writer doc + content examples, parses the CSV, selects the right row(s), generates narrative first-person emotional content for each, updates `scam-stories.ts` and adds one file per story under `scam-stories-content/{slug}.ts` (and registers it in `scam-stories-content/index.ts`), sets those rows' `status` to `done`, and saves the CSV. This **creates the story and integrates it with the website** in one go: the story appears on the index page, is linked from the index, and has a full page at `/stories/[slug]`; the sitemap and stories RSS feed pick it up automatically.
5. **Review** the diff in the data files (and CSV). Run the app and open `/stories` and `/stories/[slug]` to confirm the new story is listed and renders.

## Example prompts (CSV and arguments)

Use these as templates; replace the CSV path and numbers as needed.

**Serial only (one story, batch size = 1):**

- *Using the scamenger story writer skill, process the story at serial 5 from `docs/story-queue.csv`.*
- *Create the story for serial 3 from `docs/story-queue-example.csv`.*

**Serial + batch size (multiple stories starting from a serial):**

- *Using the scamenger story writer skill, process stories from `docs/story-queue.csv` starting at serial 10 with batch size 3.*
- *From `docs/story-queue.csv`, process serial 1 with batch size 2.*

**Batch size only (first N pending):**

- *Using the scamenger story writer skill, process the first 5 pending stories from `docs/story-queue.csv`.*
- *Process stories from `docs/story-queue.csv` with batch size 2.*

**With explicit skill mention:**

- *Use the scamenger-story-writer skill. CSV: `docs/story-queue.csv`, serial 7, batch size 1.*
- *@scamenger-story-writer process `docs/story-queue.csv` from serial 20 with batch size 4.*

## CSV format

- **Header row:** `serial_number,title,category,angle_or_region,status,story_file` (first column is 1-based serial).
- **serial_number:** Unique row index (1, 2, 3, …). Used as input to select which story(ies) to generate.
- **story_file:** Expected output filename for this story when generated by cloud/external code (e.g. `{slug}.json`). Use this name so the file can be copied and integrated into the frontend; see **docs/STORY_CLOUD_OUTPUT_FORMAT.md** for the expected JSON shape.
- **status:** Only rows with `status` = `pending` (case-insensitive) are processed. Set to `done` after generating content.
- **After processing:** For each story generated, set that row's `status` to `done` and **write the CSV file back** to the same path.

Example:

```csv
serial_number,title,category,angle_or_region,status,story_file
1,"The guru and the pump-and-dump group",financial,,"pending",the-guru-and-the-pump-and-dump-group.json
2,LPG payment pending link phone hijacked,online,India,"pending",lpg-payment-pending-link-phone-hijacked.json
```

## Selection rules

- **Serial only (batch size = 1):** Select the single row where `serial_number` equals the given serial and `status` is `pending`. If that row is not pending or missing, do nothing and report.
- **Serial + batch size:** Filter rows with `status` = `pending` and `serial_number` ≥ given serial; sort by `serial_number`; take the first **min(batch size, count)** rows. If batch size > available pending from that serial onward, effective batch = number of those pending rows.
- **Batch size only:** Filter rows with `status` = `pending`; take the first **min(batch size, pending count)** rows.

## Story style (mandatory)

- **Narrative:** Tell the story as a continuous first-person account; avoid bullet-style or dry lists in the main sections.
- **First-person:** "I felt", "I thought", "I lost"—never "the victim" or "they" for the narrator.
- **Emotional touch:** Name feelings (hopeful, ashamed, rushed, stupid, afraid); include inner voice ("I told myself…", "Part of me wondered…"); one or two concrete moments that anchor the reader. Validate the victim; avoid "I should have known."

## Before generating

1. Read **docs/STORY_DEVELOPMENT_EXPERIENCE.md** for the user's expectations and why the workflow is shaped this way (especially if running as cloud/external code).
2. Read **`.cursor/skills/scamenger-story-writer/reference.md`** for section order, emotional goals, section definitions and prompts, and format rules (or **docs/SCAM_STORIES_STRUCTURE_for_Writer.md** in the repo).
3. Read **frontend/src/data/scam-stories-content/types.ts** for the `StoryContent` interface and **frontend/src/data/scam-stories-content/** for one-file-per-story examples (e.g. `pump-and-dump-fake-guru-investment-group.ts`, `lpg-payment-pending-link-phone-hijacked.ts`).
4. Parse the CSV; apply **selection rules** (by serial only → 1 row; serial + batch size → up to N rows from that serial onward; batch size only → first N pending).
5. For each selected row: derive or use `slug`, ensure entry exists in `scam-stories.ts`, then add full content as a new file `scam-stories-content/{slug}.ts` and register it in `scam-stories-content/index.ts` (or, for cloud: write output to the file named in `story_file` per **docs/STORY_CLOUD_OUTPUT_FORMAT.md**).

## Section order (strict)

1. Character intro  
2. Initial plot  
3. Scam experience  
4. Victim's experience  
5. **Climax**  
6. **Victim's pain** (after climax)  
7. Learning (victim)  
8. Learning for readers (array of 2–4 bullets)

For full section definitions, emotional goals, and copy-paste prompts, see **`.cursor/skills/scamenger-story-writer/reference.md`**.

## Format rules

- **No visible headings** on the page; sections are continuous paragraphs.
- **Bold:** Wrap key phrases in `**double asterisks**` (emotions, red flags, turning points, takeaways).
- **Paragraph breaks within a section:** Use the Unicode paragraph separator `\u2029` between paragraphs (e.g. `'First paragraph.\u2029Second paragraph.'`). Required for production (Vercel).
- **Apostrophes in strings:** Use `\u2019` inside single-quoted strings where an apostrophe would otherwise end the string (e.g. `didn\u2019t`, `I\u2019d`).
- **Curly quotes in content:** Use `\u201c` and `\u201d` for “ and ” when inside strings.
- **learningForReaders:** Array of strings; each item can contain `**bold**`. Site adds Report/Spot-and-avoid links; don't repeat in every bullet.

## Files to edit

| File | Action |
|------|--------|
| **CSV file** | After successfully generating each story, set that row's `status` to `done` and **save the CSV** so the next run only processes remaining pending rows. |
| **frontend/src/data/scam-stories.ts** | For each story: ensure one entry in `SCAM_STORY_ENTRIES`: `{ slug, title, category }`. Slug from CSV or derived from title. Category must be a valid `ScamCategoryId`. |
| **frontend/src/data/scam-stories-content/** | For each story: add one file `{slug}.ts` exporting a default `StoryContent` object (all eight fields) and register it in `index.ts`. |

## Integration with the website (automatic)

Editing the two data files above **is** the full integration. The site reads from them as follows:

- **Stories index page** (`/stories`): Renders all entries from `SCAM_STORY_ENTRIES`. Each story card links to `/stories/[slug]`. Featured and “Latest” sections use the same list. No extra step to “link” a story to the index—adding the entry to `SCAM_STORY_ENTRIES` is enough.
- **Story page** (`/stories/[slug]`): Uses the entry for title/category and `getStoryContent(slug)` from `scam-stories-content/` for the body. Once content exists for that slug, the page shows the full story instead of a “coming soon” message.
- **Sitemap and RSS:** `app/sitemap.ts` and `app/stories/feed/route.ts` both iterate over `SCAM_STORY_ENTRIES`, so new stories are included in the sitemap and stories feed after the next build or request.

So when you run “Process stories from docs/story-queue.csv …”, the skill **combines story creation and website integration**: generate content → write to the two data files → story is live on the index, linked, and on its own page (and in sitemap/feed). No separate integration or linking step is required.

## Categories (ScamCategoryId)

`online` | `phone` | `financial` | `impersonation` | `employment` | `housing` | `prizes_charity` | `identity_benefits` | `government` | `emerging` | `other`

## Slug derivation (when slug column is missing or empty)

From `title`: lowercase, replace spaces and non-alphanumeric characters with single hyphens, trim hyphens from start/end. Example: `"The guru and the pump"` → `the-guru-and-the-pump`. Ensure uniqueness (if slug already exists in SCAM_STORY_ENTRIES, append a number or use the existing entry).

## Output checklist per story

- [ ] Entry in `scam-stories.ts` for this slug (if missing).
- [ ] New file `scam-stories-content/{slug}.ts` (and entry in `index.ts`) with default export = full `StoryContent` object, narrative and first-person with emotional touch.
- [ ] Paragraph breaks use `\u2029`; apostrophes use `\u2019` where needed in quoted strings.
- [ ] learningForReaders is an array of 2–4 strings with actionable takeaways.
- [ ] That row's `status` in the CSV set to `done` and CSV file saved.

## Workflow summary

1. Read CSV from the given path; normalize header (trim, lowercase). Ensure first column is `serial_number`.
2. Apply selection: if **serial only** → one row with that serial_number if pending; if **serial + batch size** → pending rows with serial_number ≥ given serial, take first batch_size; if **batch size only** → first batch_size pending rows.
3. For each selected row: derive slug (or use provided), generate full story (narrative, first-person, emotional), update `scam-stories.ts`, add `scam-stories-content/{slug}.ts` and register in `index.ts`, then set row's `status` to `done`. This **creates the story and integrates it with the website** (index listing, index links, `/stories/[slug]` page, sitemap, RSS) in one run.
4. Write the updated CSV back to the same path.
5. Report how many stories were generated and how many remain pending.

**See also:** **`.cursor/skills/scamenger-story-writer/reference.md`** (section definitions, prompts, format rules, in-skill), **docs/STORY_DEVELOPMENT_EXPERIENCE.md** (user expectations and rationale), **docs/STORY_CREATION_SKILL_GUIDE.md** (CSV format and example), **docs/STORY_CLOUD_OUTPUT_FORMAT.md** (expected JSON output and integration when story content is produced by cloud code).
