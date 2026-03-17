'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getConfig } from '@/data/config/api';

/**
 * Floating action buttons: "Need help now?" (emergency contacts) and "Report a scam" (when enabled).
 * Rendered on every page for quick access.
 * Report button is always in the DOM with reserved space to avoid layout shift when config loads.
 * Config is applied only after mount to avoid hydration mismatch (server vs client).
 */
export function FabActions() {
  const [hasMounted, setHasMounted] = useState(false);
  const [showReportScam, setShowReportScam] = useState<boolean | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    getConfig().then((c) => setShowReportScam(c.show_report_scam));
  }, [hasMounted]);

  const isReportVisible = hasMounted && showReportScam === true;

  return (
    <div
      className="fab_group"
      role="group"
      aria-label="Quick actions"
      suppressHydrationWarning
    >
      <Link
        href="/help-now/"
        className="fab_help_now"
        aria-label="Need help now? Emergency contacts and reporting links"
        title="Need help now?"
      >
        <span className="fab_help_now_text">Need help now?</span>
      </Link>
      <span
        className={`fab_report_wrapper ${!isReportVisible ? 'fab_report_wrapper--hidden' : ''}`}
        aria-hidden={!isReportVisible}
      >
        <Link
          href="/report/"
          className="fab_report"
          aria-label="Report a scam"
          title="Report a scam"
          tabIndex={isReportVisible ? 0 : -1}
        >
          <span className="fab_report_text">Report a scam</span>
        </Link>
      </span>
    </div>
  );
}
