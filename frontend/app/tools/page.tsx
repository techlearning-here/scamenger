import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ToolsClient } from './ToolsClient';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const defaultOgImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&h=630&auto=format&fit=crop';

export const metadata: Metadata = {
  title: 'Tools & Online Services – Protect, Recover, Identity | Scam Avenger',
  description: 'Official tools and services by country: protect yourself from scams, recover after fraud, and protect your identity and credit. Step-by-step guides to protect your phone, laptop, bank account, and credit card. FTC, Action Fraud, Scamwatch, CAFC, and more.',
  keywords: 'scam protection tools, fraud recovery, identity theft protection, credit freeze, report fraud, protect phone laptop bank account credit card, FTC, Action Fraud, Scamwatch, official resources by country',
  alternates: { canonical: `${siteUrl}/tools/` },
  openGraph: {
    title: 'Tools & Online Services | Scam Avenger',
    description: 'Official tools by country: protect, recover, identity. Guides for phone, laptop, bank & credit card.',
    url: `${siteUrl}/tools/`,
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: 'Tools & online services – Scam Avenger' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tools & Online Services | Scam Avenger',
    description: 'Official tools by country: protect, recover, identity. Guides for phone, laptop, bank & credit card.',
    images: [defaultOgImage],
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
