'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getConfig } from '@/data/config/api';

/**
 * Renders "Report a scam" nav link only when the feature is enabled in site settings.
 */
export function NavReportScamLink() {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    getConfig().then((c) => setShow(c.show_report_scam));
  }, []);

  if (show !== true) return null;

  return (
    <Link href="/report/" className="site_nav_report">
      Report a scam
    </Link>
  );
}
