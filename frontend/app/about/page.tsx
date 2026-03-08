import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Scam Avenger: we help you find where to report scams, fraud, and corruption. We point you to official channels (FTC, IC3, CFPB).',
  keywords: 'Scam Avenger, report scam, report fraud, where to report scam, consumer protection, FTC IC3 CFPB',
  alternates: { canonical: `${siteUrl}/about/` },
  openGraph: {
    title: 'About | Scam Avenger',
    description: 'About Scam Avenger: we help you find where to report scams, fraud, and corruption. We point you to official channels (FTC, IC3, CFPB).',
    url: `${siteUrl}/about/`,
    images: [{ url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&h=630&q=80', width: 1200, height: 630, alt: 'About Scam Avenger' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Scam Avenger',
    description: 'About Scam Avenger: we help you find where to report scams, fraud, and corruption.',
  },
};

export default function AboutPage() {
  return (
    <>
      <div className="about-hero">
        <img
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=80"
          alt=""
          width={1000}
          height={320}
          className="about-hero-img"
        />
        <div className="about-hero-overlay">
          <h1 className="about-hero-title">About Scam Avenger</h1>
          <p className="about-hero-tagline">We help you find where to report scams, fraud, and corruption.</p>
        </div>
      </div>

      <p>Scam Avenger helps you find the right place to report scams and corruption. We explain common scam types and link you to official government and trusted reporting channels.</p>

      <h2>What we do</h2>
      <ul>
        <li>Explain how different scams work and what to do if you&apos;re targeted.</li>
        <li>Point you to the correct official form or agency (e.g. FTC, IC3, CFPB, IRS, Oversight.gov) based on your situation.</li>
        <li>Keep a news feed of scam and consumer-protection updates.</li>
      </ul>

      <h2>What we don&apos;t do</h2>
      <p>We don&apos;t collect your personal information or forward your complaint. We only help you find and use the right official U.S. (and future) channels to report.</p>

      <h2>Coverage</h2>
      <p>We currently focus on the United States. More countries may be added later. All links go to official or trusted sources.</p>

      <p><Link href="/">← Back to Home</Link></p>
    </>
  );
}
