'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getConfig } from '@/data/config/api';

/**
 * Renders "Report a scam" nav link when the feature is enabled in site settings.
 * Keeps a stable DOM (hidden until mount + config) to match FabActions and avoid
 * SSR/client hydration mismatches in the header.
 */
export function NavReportScamLink() {
  const [hasMounted, setHasMounted] = useState(false);
  const [showReportScam, setShowReportScam] = useState<boolean | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    getConfig().then((c) => setShowReportScam(c.show_report_scam));
  }, [hasMounted]);

  const visible = hasMounted && showReportScam === true;

  return (
    <span
      className={`site_nav_report_wrap ${visible ? '' : 'site_nav_report_wrap--hidden'}`}
      aria-hidden={!visible}
    >
      <Link
        href="/report/"
        className="site_nav_report"
        tabIndex={visible ? 0 : -1}
        prefetch={false}
      >
        Report a scam
      </Link>
    </span>
  );
}
