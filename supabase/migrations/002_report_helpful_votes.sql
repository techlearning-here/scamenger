-- "Did this help?" voting (#11b): one vote per user per report (helpful = true/false).
-- Only approved reports should be votable; RLS and app logic enforce.

CREATE TABLE IF NOT EXISTS public.report_helpful_votes (
  report_id UUID NOT NULL REFERENCES public.reports (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (report_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_report_helpful_votes_report_id ON public.report_helpful_votes (report_id);
CREATE INDEX IF NOT EXISTS idx_report_helpful_votes_user_id ON public.report_helpful_votes (user_id);

COMMENT ON TABLE public.report_helpful_votes IS 'One vote per user per report: Did this help? Yes (helpful=true) / No (helpful=false). Used for #11b social proof.';

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
