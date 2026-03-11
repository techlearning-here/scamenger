-- Allow users to update their rating: store per-user scores in report_raters.
-- Existing rows have NULL scores (legacy); new/updated ratings have values.

ALTER TABLE public.report_raters
  ADD COLUMN IF NOT EXISTS credibility INTEGER CHECK (credibility >= 1 AND credibility <= 5),
  ADD COLUMN IF NOT EXISTS usefulness INTEGER CHECK (usefulness >= 1 AND usefulness <= 5),
  ADD COLUMN IF NOT EXISTS completeness INTEGER CHECK (completeness >= 1 AND completeness <= 5),
  ADD COLUMN IF NOT EXISTS relevance INTEGER CHECK (relevance >= 1 AND relevance <= 5);

COMMENT ON COLUMN public.report_raters.credibility IS '1-5 score; NULL for legacy rows from before this migration.';
COMMENT ON COLUMN public.report_raters.usefulness IS '1-5 score; NULL for legacy rows.';
COMMENT ON COLUMN public.report_raters.completeness IS '1-5 score; NULL for legacy rows.';
COMMENT ON COLUMN public.report_raters.relevance IS '1-5 score; NULL for legacy rows.';

-- Users can update own row (for rating change).
CREATE POLICY "Users can update own report_raters row"
  ON public.report_raters FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
