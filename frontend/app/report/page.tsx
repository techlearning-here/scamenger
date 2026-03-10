import type { Metadata } from 'next';
import { ReportPageGate } from './ReportPageGate';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Report a Scam Anonymously | Scam Avenger',
  description: 'Submit a scam report anonymously. No account required. Get a shareable link to warn others. Report fraud, phishing & consumer scams. Help protect others.',
  keywords: 'report a scam, report scam anonymously, submit scam report, report fraud online, report phishing, scam report USA',
  alternates: { canonical: `${siteUrl}/report/` },
  openGraph: {
    title: 'Report a Scam Anonymously | Scam Avenger',
    description: 'Submit a scam report anonymously. No account required. Get a shareable link to warn others.',
    url: `${siteUrl}/report/`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Report a Scam Anonymously | Scam Avenger',
    description: 'Submit a scam report anonymously. No account required. Get a shareable link to warn others.',
  },
};

export default function ReportPage() {
  return <ReportPageGate />;
}
