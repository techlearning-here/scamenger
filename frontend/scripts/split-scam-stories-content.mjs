/**
 * One-time script: reads monolithic scam-stories-content.ts and writes one file per story
 * under src/data/scam-stories-content/, then prints the index.ts content to stdout.
 * Run from repo root: node frontend/scripts/split-scam-stories-content.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const monolithPath = path.join(rootDir, 'frontend/src/data/scam-stories-content.ts');
const outDir = path.join(rootDir, 'frontend/src/data/scam-stories-content');

const raw = fs.readFileSync(monolithPath, 'utf8');

// Find the big object: const STORY_CONTENT: Record<string, StoryContent> = {
const startMarker = 'const STORY_CONTENT: Record<string, StoryContent> = {';
const startIdx = raw.indexOf(startMarker);
if (startIdx === -1) throw new Error('STORY_CONTENT not found');
let pos = raw.indexOf('{', startIdx) + 1; // position after first '{'
let depth = 1;
const entries = [];

while (depth > 0 && pos < raw.length) {
  const nextOpen = raw.indexOf('{', pos);
  const nextClose = raw.indexOf('}', pos);
  if (nextClose === -1) break;
  if (nextOpen !== -1 && nextOpen < nextClose) {
    depth++;
    pos = nextOpen + 1;
  } else {
    depth--;
    if (depth === 0) break;
    pos = nextClose + 1;
  }
}
const objectStr = raw.slice(startIdx + startMarker.length, pos).trim();
// objectStr is the content inside the outer { }, so it starts with 'slug': { ... },
// We need to split by entries. Each entry is 'slug': { ... },
// Use same brace-counting to split.
let i = 0;
while (i < objectStr.length) {
  const keyMatch = objectStr.slice(i).match(/^\s*'([^']+)':\s*\{/);
  if (!keyMatch) break;
  const key = keyMatch[1];
  i += keyMatch.index + keyMatch[0].length;
  let depth = 1;
  const start = i;
  while (depth > 0 && i < objectStr.length) {
    const nextOpen = objectStr.indexOf('{', i);
    const nextClose = objectStr.indexOf('}', i);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 1;
    } else {
      depth--;
      i = nextClose + 1;
      if (depth === 0) {
        const body = objectStr.slice(start - 1, i).trim(); // include the opening {
        entries.push({ slug: key, body });
        break;
      }
    }
  }
  // skip comma and whitespace
  while (i < objectStr.length && /[\s,]/.test(objectStr[i])) i++;
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const slugs = [];
for (const { slug, body } of entries) {
  const fileName = `${slug}.ts`;
  const fileContent = `import type { StoryContent } from './types';\n\nconst content: StoryContent = ${body};\n\nexport default content;\n`;
  fs.writeFileSync(path.join(outDir, fileName), fileContent, 'utf8');
  slugs.push(slug);
}

// Generate index.ts: import each slug (camelCase or slug-as-is for path) and export
const indexLines = [
  "import type { StoryContent } from './types';",
  '',
  ...slugs.map((s) => `import ${s.replace(/-/g, '_')} from './${s}';`),
  '',
  'const STORY_CONTENT: Record<string, StoryContent> = {',
  ...slugs.map((s) => `  '${s}': ${s.replace(/-/g, '_')},`),
  '};',
  '',
  'export type { StoryContent } from "./types";',
  'export { STORY_CONTENT };',
  '',
  '/**',
  ' * Returns full story content for a slug, or null if only the listing/title exists.',
  ' */',
  'export function getStoryContent(slug: string): StoryContent | null {',
  '  return STORY_CONTENT[slug] ?? null;',
  '}',
  '',
];

fs.writeFileSync(path.join(outDir, 'index.ts'), indexLines.join('\n'), 'utf8');
console.log('Wrote', entries.length, 'story files and index.ts');
