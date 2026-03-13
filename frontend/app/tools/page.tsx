import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ToolsClient } from './ToolsClient';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Tools & Online Services – Protect, Recover, Identity | Scam Avenger',
  description: 'Official tools and services by country: protect yourself from scams, recover after fraud, and protect your identity and credit. FTC, Action Fraud, Scamwatch, CAFC, and more.',
  keywords: 'scam protection tools, fraud recovery, identity theft protection, credit freeze, report fraud, FTC, Action Fraud, Scamwatch, official resources by country',
  alternates: { canonical: `${siteUrl}/tools/` },
  openGraph: {
    title: 'Tools & Online Services | Scam Avenger',
    description: 'Official tools by country: protect, recover, and protect your identity.',
    url: `${siteUrl}/tools/`,
  },
  twitter: {
    card: 'summary',
    title: 'Tools & Online Services | Scam Avenger',
    description: 'Official tools and services by country: protect, recover, identity.',
  },
};

function ToolsFallback() {
  return (
    <p className="report-scam-lead" aria-live="polite">
      Loading tools…
    </p>
  );
}

interface ToolsPageProps {
  searchParams: Promise<{ country?: string }>;
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const params = await searchParams;
  const countryFromUrl = params?.country ?? null;

  return (
    <Suspense fallback={<ToolsFallback />}>
      <ToolsClient countryFromUrl={countryFromUrl} />
    </Suspense>
  );
}
