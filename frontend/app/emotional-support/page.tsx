import type { Metadata } from 'next';
import { Suspense } from 'react';
import { EmotionalSupportClient } from './EmotionalSupportClient';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const defaultOgImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&h=630&auto=format&fit=crop';

export const metadata: Metadata = {
  title: 'Emotional Support & Victim Resources | Scam Avenger',
  description: 'Mental health hotlines and scam victim support groups. Confidential support after fraud or scam. 988, Crisis Text Line, AARP Fraud Watch, and more.',
  keywords: 'scam victim support, fraud victim help, mental health hotline, 988, crisis support, identity theft support',
  alternates: { canonical: `${siteUrl}/emotional-support/` },
  openGraph: {
    title: 'Emotional Support & Victim Resources | Scam Avenger',
    description: 'Mental health hotlines and scam victim support. Confidential support after a scam.',
    url: `${siteUrl}/emotional-support/`,
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: 'Emotional support & victim resources – Scam Avenger' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emotional Support & Victim Resources | Scam Avenger',
    description: 'Mental health and scam victim support links.',
    images: [defaultOgImage],
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
