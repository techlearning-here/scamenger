#!/usr/bin/env python3
"""Regenerate scam-stories-content/index.ts from all *.ts story files (excl. index, types)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIR = ROOT / "src" / "data" / "scam-stories-content"

def slug_to_id(slug: str) -> str:
    return slug.replace("-", "_")

def main() -> None:
    files = sorted(
        f.stem
        for f in DIR.glob("*.ts")
        if f.name not in ("index.ts", "types.ts")
    )
    imports = []
    entries = []
    for slug in files:
        ident = slug_to_id(slug)
        imports.append(f"import {ident} from './{slug}';")
        entries.append(f"  '{slug}': {ident},")

    body = f"""/**
 * Full story content for scam experience pages.
 * One file per story under scam-stories-content/; structure follows docs/SCAM_STORIES_STRUCTURE_for_Writer.md.
 * Regenerate imports: python3 frontend/scripts/regenerate-scam-stories-content-index.py
 */

import type {{ StoryContent }} from './types';

{chr(10).join(imports)}

const STORY_CONTENT: Record<string, StoryContent> = {{
{chr(10).join(entries)}
}};

export type {{ StoryContent }} from './types';
export {{ STORY_CONTENT }};

/**
 * Returns full story content for a slug, or null if only the listing/title exists.
 */
export function getStoryContent(slug: string): StoryContent | null {{
  return STORY_CONTENT[slug] ?? null;
}}
"""
    out = DIR / "index.ts"
    out.write_text(body, encoding="utf-8")
    print("Wrote", len(files), "stories to", out.relative_to(ROOT.parent))


if __name__ == "__main__":
    main()
