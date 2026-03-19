/**
 * One-off script: reads SCAM_STORY_ENTRIES from scam-stories.ts and writes
 * docs/story-queue.csv with serial_number,title,category,angle_or_region,status,story_file.
 * Stories that already have content in scam-stories-content/*.ts get status "done"; others "pending".
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const storiesPath = path.join(rootDir, 'frontend/src/data/scam-stories.ts');
const contentDir = path.join(rootDir, 'frontend/src/data/scam-stories-content');
const outPath = path.join(rootDir, 'docs/story-queue.csv');

const storiesSrc = fs.readFileSync(storiesPath, 'utf8');
const contentFiles = fs.readdirSync(contentDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts');
const hasContent = new Set(contentFiles.map((f) => f.slice(0, -3)));

const entryRe = /\{\s*slug:\s*'([^']+)',\s*title:\s*'((?:[^'\\]|\\.)*)',\s*category:\s*'([^']+)'/g;
const entries = [];
let m;
while ((m = entryRe.exec(storiesSrc)) !== null) {
  const title = m[2].replace(/\\'/g, "'");
  entries.push({ slug: m[1], title, category: m[3] });
}

function csvEscape(s) {
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

const lines = ['serial_number,title,category,angle_or_region,status,story_file'];
entries.forEach((e, i) => {
  const serial = i + 1;
  const status = hasContent.has(e.slug) ? 'done' : 'pending';
  const storyFile = `${e.slug}.json`;
  lines.push([serial, csvEscape(e.title), e.category, '', status, storyFile].join(','));
});

fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');
// eslint-disable-next-line no-console
console.log('Wrote', outPath, 'with', entries.length, 'stories,', hasContent.size, 'done,', entries.length - hasContent.size, 'pending.');
process.exit(0);
