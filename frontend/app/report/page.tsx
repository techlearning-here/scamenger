import type { Metadata } from 'next';
import Link from 'next/link';
import { ReportFormClient } from './ReportFormClient';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Report a scam',
  description: 'Submit a scam report anonymously. No account required. Get a shareable link to warn others. Help protect others by reporting scams.',
  alternates: { canonical: `${siteUrl}/report/` },
  openGraph: {
    title: 'Report a scam | Scam Avenger',
    description: 'Submit a scam report anonymously. No account required. Get a shareable link to warn others.',
    url: `${siteUrl}/report/`,
  },
};

export default function ReportPage() {
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
