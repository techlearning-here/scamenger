'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getConfig } from '@/data/config/api';
import { ReportFormClient } from './ReportFormClient';

/**
 * Shows report form when Report a scam is enabled; otherwise shows a disabled message.
 */
export function ReportPageGate() {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    getConfig().then((c) => setEnabled(c.show_report_scam));
  }, []);

  if (enabled === null) {
    return (
      <>
        <nav className="back" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="back-sep"> / </span>
          <span>Report a scam</span>
        </nav>
        <h1 id="report-scam-heading" className="report-scam-title">
          Report a scam
        </h1>
        <p className="report-scam-lead" aria-live="polite">
          Loading…
        </p>
      </>
    );
  }

  if (!enabled) {
    return (
      <>
        <nav className="back" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="back-sep"> / </span>
          <span>Report a scam</span>
        </nav>
        <h1 id="report-scam-heading" className="report-scam-title">
          Report a scam
        </h1>
        <div className="report-scam-error" role="status">
          <p>This feature is currently disabled. You can still look up existing reports or contact us.</p>
          <p>
            <Link href="/lookup-report/">Look up a report</Link>
            {' · '}
            <Link href="/contact/">Contact us</Link>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Report a scam</span>
      </nav>
      <h1 id="report-scam-heading" className="report-scam-title">
        Report a scam
      </h1>
      <p className="report-scam-lead">
        Report anonymously—no account or sign-in required. Seen something suspicious? Share it to protect others. We’ll give you a link you can share with anyone.
      </p>
      <ReportFormClient />
    </>
  );
}
