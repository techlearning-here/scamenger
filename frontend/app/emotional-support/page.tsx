import type { Metadata } from 'next';
import { Suspense } from 'react';
import { EmotionalSupportClient } from './EmotionalSupportClient';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Emotional Support & Victim Resources | Scam Avenger',
  description: 'Mental health hotlines and scam victim support groups. Confidential support after fraud or scam. 988, Crisis Text Line, AARP Fraud Watch, and more.',
  keywords: 'scam victim support, fraud victim help, mental health hotline, 988, crisis support, identity theft support',
  alternates: { canonical: `${siteUrl}/emotional-support/` },
  openGraph: {
    title: 'Emotional Support & Victim Resources | Scam Avenger',
    description: 'Mental health hotlines and scam victim support. Confidential support after a scam.',
    url: `${siteUrl}/emotional-support/`,
  },
  twitter: {
    card: 'summary',
    title: 'Emotional Support & Victim Resources | Scam Avenger',
    description: 'Mental health and scam victim support links.',
  },
};

export default async function EmotionalSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const params = await searchParams;
  const countryFromUrl = params.country ?? null;

  return (
    <Suspense fallback={<p className="report-scam-lead">Loading…</p>}>
      <EmotionalSupportClient countryFromUrl={countryFromUrl} />
    </Suspense>
  );
}
