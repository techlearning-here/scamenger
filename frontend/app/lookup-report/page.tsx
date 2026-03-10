import type { Metadata } from 'next';
import Link from 'next/link';
import { LookupReportForm } from './LookupReportForm';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Look Up Scam Report by ID | Scam Avenger',
  description: 'View a scam report by report ID. Enter the ID from your confirmation or a shared post to see the full report. Look up fraud reports on Scam Avenger.',
  keywords: 'look up scam report, view scam report, report ID lookup, fraud report lookup, scam report by ID',
  alternates: { canonical: `${siteUrl}/lookup-report/` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Look Up Scam Report by ID | Scam Avenger',
    description: 'View a scam report by entering your report ID. Use the ID from your confirmation or a shared post.',
    url: `${siteUrl}/lookup-report/`,
  },
  twitter: {
    card: 'summary',
    title: 'Look Up Scam Report by ID | Scam Avenger',
    description: 'View a scam report by entering your report ID.',
  },
};

export default function LookupReportPage() {
  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Look up report</span>
      </nav>
      <h1 className="report-scam-title">Look up a report by ID</h1>
      <section className="report-id-search-block report-id-search-page" aria-labelledby="report-id-search-heading">
        <h2 id="report-id-search-heading" className="report-id-search-heading">Enter your report ID</h2>
        <p className="report-id-search-intro">If you have a report ID, enter it below to view the full report.</p>
        <LookupReportForm />
      </section>
      <p className="report-id-search-back">
        <Link href="/">Back to home</Link>
      </p>
    </>
  );
}
