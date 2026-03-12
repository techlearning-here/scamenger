-- Scam Avenger: full schema (single combined migration).
-- Run in Supabase SQL Editor or via Supabase CLI. Requires Supabase Auth for report_raters.
-- Includes: reports, report_raters, report_helpful_votes, contact_messages, site_settings, and Facebook post tracking on reports.

-- =============================================================================
-- REPORTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  country_origin TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN (
    'website', 'phone', 'crypto', 'iban',
    'social_media', 'whatsapp', 'telegram', 'discord',
    'other'
  )),
  report_type_detail TEXT,
  report_type_detail_normalized TEXT,
  category TEXT,
  lost_money BOOLEAN NOT NULL DEFAULT false,
  lost_money_range TEXT,
  narrative TEXT,
  consent_share_authorities BOOLEAN NOT NULL DEFAULT false,
  consent_share_social BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  rating_count INTEGER NOT NULL DEFAULT 0,
  sum_credibility INTEGER NOT NULL DEFAULT 0,
  sum_usefulness INTEGER NOT NULL DEFAULT 0,
  sum_completeness INTEGER NOT NULL DEFAULT 0,
  sum_relevance INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitter_view_token TEXT,
  facebook_post_id TEXT,
  facebook_posted_at TIMESTAMPTZ,
  facebook_permalink TEXT
);

CREATE INDEX IF NOT EXISTS idx_reports_slug ON public.reports (slug);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_country_origin ON public.reports (country_origin);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports (status);
CREATE INDEX IF NOT EXISTS idx_reports_similar
  ON public.reports (report_type, report_type_detail_normalized)
  WHERE status = 'approved' AND report_type_detail_normalized IS NOT NULL;

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON public.reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON public.reports
  FOR SELECT USING (true);

COMMENT ON TABLE public.reports IS 'User-submitted scam reports; shareable via /reports/?id=.... Aggregated ratings: rating_count, sum_credibility, sum_usefulness, sum_completeness, sum_relevance (avg = sum / count).';
COMMENT ON COLUMN public.reports.report_type_detail IS 'Type-specific value: website URL, phone number, crypto address, or IBAN depending on report_type.';
COMMENT ON COLUMN public.reports.report_type_detail_normalized IS 'Normalized value for matching: phone=digits only, URL=lowercase no protocol/slash/www, else lower trim.';
COMMENT ON COLUMN public.reports.lost_money_range IS 'Amount lost: none, under_100, under_1000, under_10000, under_100000, under_1000000, over_1000000.';
COMMENT ON COLUMN public.reports.report_type IS 'One of: website, phone, crypto, iban, social_media, whatsapp, telegram, discord, other.';
COMMENT ON COLUMN public.reports.status IS 'pending = awaiting approval; approved = visible to public; rejected = declined by admin, not visible.';
COMMENT ON COLUMN public.reports.submitter_view_token IS 'Secret token returned on create; include as view_token in GET to see full report while pending.';
COMMENT ON COLUMN public.reports.consent_share_social IS 'Submitter consent to share an anonymized summary on Scam Avenger social (e.g. Facebook) after admin approval.';
COMMENT ON COLUMN public.reports.facebook_post_id IS 'Facebook Graph API post id (e.g. page_id_post_id) when report was posted to Scam Avenger Page.';
COMMENT ON COLUMN public.reports.facebook_posted_at IS 'When the report was posted to Facebook (admin action).';
COMMENT ON COLUMN public.reports.facebook_permalink IS 'Permalink URL of the Facebook post.';

-- =============================================================================
-- REPORT_RATERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.report_raters (
  report_id UUID NOT NULL REFERENCES public.reports (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  credibility INTEGER CHECK (credibility >= 1 AND credibility <= 5),
  usefulness INTEGER CHECK (usefulness >= 1 AND usefulness <= 5),
  completeness INTEGER CHECK (completeness >= 1 AND completeness <= 5),
  relevance INTEGER CHECK (relevance >= 1 AND relevance <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (report_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_report_raters_report_id ON public.report_raters (report_id);
CREATE INDEX IF NOT EXISTS idx_report_raters_user_id ON public.report_raters (user_id);

COMMENT ON TABLE public.report_raters IS 'Tracks which authenticated users have rated which report (one per user per report). Actual scores stored here; aggregates on reports.';
COMMENT ON COLUMN public.report_raters.credibility IS '1-5 score; NULL for legacy rows from before per-user scores.';
COMMENT ON COLUMN public.report_raters.usefulness IS '1-5 score; NULL for legacy rows.';
COMMENT ON COLUMN public.report_raters.completeness IS '1-5 score; NULL for legacy rows.';
COMMENT ON COLUMN public.report_raters.relevance IS '1-5 score; NULL for legacy rows.';

ALTER TABLE public.report_raters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own report_raters row"
  ON public.report_raters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own report_raters rows"
  ON public.report_raters FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own report_raters row"
  ON public.report_raters FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- REPORT_HELPFUL_VOTES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.report_helpful_votes (
  report_id UUID NOT NULL REFERENCES public.reports (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (report_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_report_helpful_votes_report_id ON public.report_helpful_votes (report_id);
CREATE INDEX IF NOT EXISTS idx_report_helpful_votes_user_id ON public.report_helpful_votes (user_id);

COMMENT ON TABLE public.report_helpful_votes IS 'One vote per user per report: Did this help? Yes (helpful=true) / No (helpful=false). Used for social proof.';

ALTER TABLE public.report_helpful_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own vote"
  ON public.report_helpful_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vote"
  ON public.report_helpful_votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read votes (for counts)"
  ON public.report_helpful_votes FOR SELECT
  USING (true);

-- =============================================================================
-- CONTACT_MESSAGES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON public.contact_messages (read);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

COMMENT ON TABLE public.contact_messages IS 'Contact form submissions; admin views and deletes via dashboard.';

-- =============================================================================
-- SITE_SETTINGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT 'true'
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.site_settings
  FOR SELECT USING (true);

COMMENT ON TABLE public.site_settings IS 'Site configuration. show_facebook_consent: when true, report form shows the Facebook share consent checkbox. show_report_scam: when true, Report a scam is shown in nav and FAB and /report/ is available.';

INSERT INTO public.site_settings (key, value)
VALUES ('show_facebook_consent', 'true')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_settings (key, value)
VALUES ('show_report_scam', 'true')
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- BACKFILL: report_type_detail_normalized (for existing data if any)
-- =============================================================================

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
