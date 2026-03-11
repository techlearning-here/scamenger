/**
 * Validates supabase/seed/data.json for required keys and value types.
 * Run from repo root: node supabase/seed/validate.js
 * Exit code 0 = valid; 1 = invalid (with stderr message).
 */

const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, 'data.json');

const REQUIRED_SITE_SETTINGS_KEYS = ['show_facebook_consent', 'show_report_scam'];

function main() {
  if (!fs.existsSync(SEED_PATH)) {
    console.error('Missing supabase/seed/data.json');
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
  } catch (e) {
    console.error('Invalid JSON in supabase/seed/data.json:', e.message);
    process.exit(1);
  }

  if (!data.site_settings || !Array.isArray(data.site_settings)) {
    console.error('data.json must have a "site_settings" array');
    process.exit(1);
  }

  const keys = new Set(data.site_settings.map((row) => row.key));
  const missing = REQUIRED_SITE_SETTINGS_KEYS.filter((k) => !keys.has(k));
  if (missing.length) {
    console.error('data.json site_settings missing required keys:', missing.join(', '));
    process.exit(1);
  }

  for (const row of data.site_settings) {
    if (REQUIRED_SITE_SETTINGS_KEYS.includes(row.key) && typeof row.value !== 'boolean') {
      console.error(`data.json site_settings.${row.key}.value must be a boolean, got ${typeof row.value}`);
      process.exit(1);
    }
  }

  console.log('Seed data valid:', Object.keys(data).join(', '));
}

main();
