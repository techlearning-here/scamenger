import type { Metadata } from 'next';
import Link from 'next/link';
import { ReportDetailClient } from './ReportDetailClient';

export const metadata: Metadata = {
  title: 'Scam report',
  description: 'View a shared scam report from Scam Avenger.',
  robots: { index: false, follow: true },
};

export default function ReportsPage() {
  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <Link href="/report/">Report a scam</Link>
        <span className="back-sep"> / </span>
        <span>Report</span>
      </nav>
      <h1 className="report-scam-title">Scam report</h1>
      <ReportDetailClient />
    </>
  );
}
