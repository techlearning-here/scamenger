import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Protect your phone — detailed steps | Scam Avenger',
  description: 'Step-by-step settings and tips to protect your phone from hackers and scams. Lock screen, updates, 2FA, and official guidance.',
  alternates: { canonical: `${siteUrl}/tools/protect-phone/` },
  openGraph: {
    title: 'Protect your phone — detailed steps | Scam Avenger',
    description: 'Step-by-step settings and tips to protect your phone from hackers and scams. Lock screen, updates, 2FA, and official guidance.',
    url: `${siteUrl}/tools/protect-phone/`,
  },
  twitter: {
    card: 'summary',
    title: 'Protect your phone — detailed steps | Scam Avenger',
    description: 'Step-by-step settings and tips to protect your phone from hackers and scams.',
  },
};

export default function ProtectPhonePage() {
  return (
    <>
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <Link href="/tools/">Tools</Link>
        <span className="back-sep"> / </span>
        <span>Protect your phone</span>
      </nav>
      <header className="tool-page-hero">
        <h1 id="protect-phone-heading" className="tool-page-title">
          Protect your phone — detailed steps
        </h1>
        <p className="tool-page-intro">
          Content for this guide will be added here. You&apos;ll find step-by-step settings and tips to secure your phone from hackers and scams, plus links to official resources.
        </p>
        <p className="tool-page-cta">
          <Link href="/tools/">Back to Tools &amp; online services</Link>
        </p>
      </header>
    </>
  );
}
