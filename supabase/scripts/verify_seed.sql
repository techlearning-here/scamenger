-- Verify seed data is present and valid. Run after supabase/scripts/seed.sql.
-- Expect exactly 2 rows. If 0 rows, run seed.sql. If wrong values, check supabase/seed/data.json and seed.sql.

SELECT key, value
FROM public.site_settings
WHERE key IN ('show_facebook_consent', 'show_report_scam')
ORDER BY key;

-- Optional: assert expected row count (fails if not 2)
-- SELECT count(*) AS site_settings_seed_count FROM public.site_settings WHERE key IN ('show_facebook_consent', 'show_report_scam');
