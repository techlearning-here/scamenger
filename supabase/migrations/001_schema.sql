-- Scam Avenger: full schema (reports + report_raters).
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor) or via Supabase CLI.
-- Requires Supabase Auth enabled for report_raters.

-- =============================================================================
-- 1. REPORTS TABLE
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
  category TEXT,
  lost_money BOOLEAN NOT NULL DEFAULT false,
  lost_money_range TEXT,
  narrative TEXT,
  consent_share_authorities BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  rating_count INTEGER NOT NULL DEFAULT 0,
  sum_credibility INTEGER NOT NULL DEFAULT 0,
  sum_usefulness INTEGER NOT NULL DEFAULT 0,
  sum_completeness INTEGER NOT NULL DEFAULT 0,
  sum_relevance INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitter_view_token TEXT
);

CREATE INDEX IF NOT EXISTS idx_reports_slug ON public.reports (slug);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_country_origin ON public.reports (country_origin);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports (status);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON public.reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON public.reports
  FOR SELECT USING (true);

COMMENT ON TABLE public.reports IS 'User-submitted scam reports; shareable via /reports/?id=.... Aggregated ratings: rating_count, sum_credibility, sum_usefulness, sum_completeness, sum_relevance (avg = sum / count).';
COMMENT ON COLUMN public.reports.report_type_detail IS 'Type-specific value: website URL, phone number, crypto address, or IBAN depending on report_type.';
COMMENT ON COLUMN public.reports.lost_money_range IS 'Amount lost: none, under_100, under_1000, under_10000, under_100000, under_1000000, over_1000000.';
COMMENT ON COLUMN public.reports.report_type IS 'One of: website, phone, crypto, iban, social_media, whatsapp, telegram, discord, other.';
COMMENT ON COLUMN public.reports.status IS 'pending = awaiting approval; approved = visible to public; rejected = declined by admin, not visible.';
COMMENT ON COLUMN public.reports.submitter_view_token IS 'Secret token returned on create; include as view_token in GET to see full report while pending.';

-- =============================================================================
-- 2. REPORT_RATERS TABLE (one rating per user per report)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.report_raters (
  report_id UUID NOT NULL REFERENCES public.reports (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (report_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_report_raters_report_id ON public.report_raters (report_id);
CREATE INDEX IF NOT EXISTS idx_report_raters_user_id ON public.report_raters (user_id);

COMMENT ON TABLE public.report_raters IS 'Tracks which authenticated users have rated which report (one per user per report). Used to prevent double-counting; actual scores stored only as aggregates on reports.';

ALTER TABLE public.report_raters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own report_raters row"
  ON public.report_raters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own report_raters rows"
  ON public.report_raters FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
