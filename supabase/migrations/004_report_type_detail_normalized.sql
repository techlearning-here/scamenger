-- Scam similarity matching (#1b): normalize report_type_detail for matching same URL/number.
-- Enables "X other users reported this same number/URL" on report detail.

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS report_type_detail_normalized TEXT;

COMMENT ON COLUMN public.reports.report_type_detail_normalized IS 'Normalized value for matching: phone=digits only, URL=lowercase no protocol/slash/www, else lower trim.';

-- Backfill: phone = digits only; URL-like types = lowercase, no protocol, no www, no trailing slash; else lower trim.
UPDATE public.reports
SET report_type_detail_normalized = CASE
  WHEN report_type_detail IS NULL OR trim(report_type_detail) = '' THEN NULL
  WHEN report_type = 'phone' THEN regexp_replace(report_type_detail, '[^0-9]', '', 'g')
  WHEN report_type IN ('website', 'social_media', 'whatsapp', 'telegram', 'discord')
    AND report_type_detail ~* '^https?://' THEN lower(
      trim(both '/' from regexp_replace(regexp_replace(regexp_replace(trim(report_type_detail), '^https?://', '', 'i'), '^www\.', '', 'i'), '/+$', '', 'g'))
    )
  ELSE lower(trim(report_type_detail))
END
WHERE report_type_detail IS NOT NULL AND trim(report_type_detail) <> '';

CREATE INDEX IF NOT EXISTS idx_reports_similar
  ON public.reports (report_type, report_type_detail_normalized)
  WHERE status = 'approved' AND report_type_detail_normalized IS NOT NULL;
