import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Protect your bank account — detailed steps | Scam Avenger',
  description: 'Step-by-step settings and tips to protect your bank account from hackers and scams. Alerts, limits, and official guidance.',
  alternates: { canonical: `${siteUrl}/tools/protect-bank-account/` },
  openGraph: {
    title: 'Protect your bank account — detailed steps | Scam Avenger',
    description: 'Step-by-step settings and tips to protect your bank account from hackers and scams. Alerts, limits, and official guidance.',
    url: `${siteUrl}/tools/protect-bank-account/`,
  },
  twitter: {
    card: 'summary',
    title: 'Protect your bank account — detailed steps | Scam Avenger',
    description: 'Step-by-step settings and tips to protect your bank account from hackers and scams.',
  },
};

export default function ProtectBankAccountPage() {
  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <Link href="/tools/">Tools</Link>
        <span className="back-sep"> / </span>
        <span>Protect your bank account</span>
      </nav>
      <header className="tool-page-hero">
        <h1 id="protect-bank-account-heading" className="tool-page-title">
          Protect your bank account — detailed steps
        </h1>
        <p className="tool-page-intro">
          Content for this guide will be added here. You&apos;ll find step-by-step settings and tips to secure your bank account from hackers and scams, plus links to official resources.
        </p>
        <p className="tool-page-cta">
          <Link href="/tools/">Back to Tools &amp; online services</Link>
        </p>
      </header>
    </>
  );
}
