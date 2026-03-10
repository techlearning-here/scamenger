import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HelpNowClient } from './HelpNowClient';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Need Help Now? Report Fraud – FTC, IC3, CFPB Links | Scam Avenger',
  description: 'Emergency contacts and official reporting links: FTC, IC3, Action Fraud, CAFC, Scamwatch. Report fraud and get help quickly. Where to report scams now.',
  keywords: 'report fraud now, FTC report, IC3 report, Action Fraud, CAFC, Scamwatch, elder fraud hotline, identity theft report, where to report scam',
  alternates: { canonical: `${siteUrl}/help-now/` },
  openGraph: {
    title: 'Need Help Now? Report Fraud – FTC, IC3, CFPB Links | Scam Avenger',
    description: 'Emergency contacts and official reporting links. Report fraud and get help quickly.',
    url: `${siteUrl}/help-now/`,
  },
  twitter: {
    card: 'summary',
    title: 'Need Help Now? Report Fraud | Scam Avenger',
    description: 'Emergency contacts and official reporting links by country.',
  },
};

function HelpNowFallback() {
  return (
    <p className="report-scam-lead" aria-live="polite">
      Loading help links…
    </p>
  );
}

interface HelpNowPageProps {
  searchParams: Promise<{ country?: string }>;
}

export default async function HelpNowPage({ searchParams }: HelpNowPageProps) {
  const params = await searchParams;
  const countryFromUrl = params?.country ?? null;

  return (
    <Suspense fallback={<HelpNowFallback />}>
      <HelpNowClient countryFromUrl={countryFromUrl} />
    </Suspense>
  );
}
