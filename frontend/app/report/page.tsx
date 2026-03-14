import type { Metadata } from 'next';
import { ReportPageGate } from './ReportPageGate';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const defaultOgImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&h=630&auto=format&fit=crop';

export const metadata: Metadata = {
  title: 'Report a Scam Anonymously | Scam Avenger',
  description: 'Submit a scam report anonymously. Get a shareable link to warn others. Report fraud, phishing & consumer scams. Help protect others.',
  keywords: 'report a scam, report scam anonymously, submit scam report, report fraud online, report phishing, scam report USA',
  alternates: { canonical: `${siteUrl}/report/` },
  openGraph: {
    title: 'Report a Scam Anonymously | Scam Avenger',
    description: 'Submit a scam report anonymously. Get a shareable link to warn others.',
    url: `${siteUrl}/report/`,
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: 'Report a scam – Scam Avenger' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Report a Scam Anonymously | Scam Avenger',
    description: 'Submit a scam report anonymously. Get a shareable link to warn others.',
    images: [defaultOgImage],
  },
};

export default function ReportPage() {
  return <ReportPageGate />;
}
