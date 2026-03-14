import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Protect your credit card — detailed steps | Scam Avenger',
  description: 'Step-by-step settings and tips to protect your credit card from hackers and scams. Alerts, freezes, and official guidance.',
  alternates: { canonical: `${siteUrl}/tools/protect-credit-card/` },
  openGraph: {
    title: 'Protect your credit card — detailed steps | Scam Avenger',
    description: 'Step-by-step settings and tips to protect your credit card from hackers and scams. Alerts, freezes, and official guidance.',
    url: `${siteUrl}/tools/protect-credit-card/`,
  },
  twitter: {
    card: 'summary',
    title: 'Protect your credit card — detailed steps | Scam Avenger',
    description: 'Step-by-step settings and tips to protect your credit card from hackers and scams.',
  },
};

export default function ProtectCreditCardPage() {
  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <Link href="/tools/">Tools</Link>
        <span className="back-sep"> / </span>
        <span>Protect your credit card</span>
      </nav>
      <header className="tool-page-hero">
        <h1 id="protect-credit-card-heading" className="tool-page-title">
          Protect your credit card — detailed steps
        </h1>
        <p className="tool-page-intro">
          Content for this guide will be added here. You&apos;ll find step-by-step settings and tips to secure your credit card from hackers and scams, plus links to official resources.
        </p>
        <p className="tool-page-cta">
          <Link href="/tools/">Back to Tools &amp; online services</Link>
        </p>
      </header>
    </>
  );
}
