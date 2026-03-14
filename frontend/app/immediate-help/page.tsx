import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ImmediateHelpClient } from './ImmediateHelpClient';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const defaultOgImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&h=630&auto=format&fit=crop';

export const metadata: Metadata = {
  title: 'Immediate Response (0–24 Hours) | Scam Avenger',
  description: 'Emergency checklist, evidence collection list, and official reporting links for the first 0–24 hours after a scam. Step-by-step what to do right now.',
  keywords: 'immediate scam help, first 24 hours after scam, evidence collection, report scam now, emergency fraud checklist',
  alternates: { canonical: `${siteUrl}/immediate-help/` },
  openGraph: {
    title: 'Immediate Response (0–24 Hours) | Scam Avenger',
    description: 'Emergency checklist and official links for the first 24 hours after a scam.',
    url: `${siteUrl}/immediate-help/`,
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: 'Immediate response 0–24 hours – Scam Avenger' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Immediate Response (0–24 Hours) | Scam Avenger',
    description: 'Emergency checklist and official links for the first 24 hours after a scam.',
    images: [defaultOgImage],
  },
};

function ImmediateHelpFallback() {
  return (
    <p className="report-scam-lead" aria-live="polite">
      Loading…
    </p>
  );
}

export default function ImmediateHelpPage() {
  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <Link href="/help-now/">Need help now?</Link>
        <span className="back-sep"> / </span>
        <span>Immediate response (0–24 hours)</span>
      </nav>
      <Suspense fallback={<ImmediateHelpFallback />}>
        <ImmediateHelpClient />
      </Suspense>
    </>
  );
}
