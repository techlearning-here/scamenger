import type { Metadata } from 'next';
import Link from 'next/link';
import { ReportFormClient } from './ReportFormClient';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Report a scam',
  description: 'Submit a scam report and get a shareable link. No account required. Help protect others by reporting scams.',
  alternates: { canonical: `${siteUrl}/report/` },
  openGraph: {
    title: 'Report a scam | Scam Avenger',
    description: 'Submit a scam report and get a shareable link. No account required.',
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
        Seen something suspicious? Share to protect others. We’ll give you a link you can share with anyone.
      </p>
      <ReportFormClient />
    </>
  );
}
