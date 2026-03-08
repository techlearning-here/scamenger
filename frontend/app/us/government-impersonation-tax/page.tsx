import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryIntro } from '@/components/CategoryIntro';
import { ReportCard } from '@/components/ReportCard';
import { getUsScamTypes } from '@/data/us-scams';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Government impersonation and tax scams',
  description: 'Where to report IRS, Treasury, and government imposter fraud. Official IRS phishing and Treasury scam reporting links.',
  keywords: 'report IRS scam, report tax scam, government imposter fraud, Treasury scam report, IRS phishing report, report government impersonation',
  alternates: { canonical: `${siteUrl}/us/government-impersonation-tax/` },
  openGraph: {
    title: 'Government impersonation and tax scams | Scam Avenger',
    description: 'Where to report IRS, Treasury, and government imposter fraud. Official IRS phishing and Treasury scam reporting links.',
    url: `${siteUrl}/us/government-impersonation-tax/`,
  },
  twitter: { card: 'summary_large_image', title: 'Government impersonation and tax scams | Scam Avenger', description: 'Where to report IRS, Treasury, and government imposter fraud.' },
};

export default function GovernmentImpersonationTaxPage() {
  const impersonationScams = getUsScamTypes().filter((s) => s.category === 'impersonation');

  return (
    <>
      <h1>Government impersonation and tax scams</h1>

      <CategoryIntro
        intro="If someone pretended to be the IRS, Treasury, or another government agency to pressure you into paying or sharing personal information, report it using the official links below. For other government imposter scams, the FTC and IC3 also accept reports."
        steps={[
          'Stop contact—real IRS and Treasury do not demand immediate payment by phone, gift cards, or crypto.',
          'Do not send money or personal information to the caller or emailer.',
          'Save evidence: phone number, email, URLs, and any messages.',
          'Report using the correct official link below.',
        ]}
      />

      <h2>Where to report</h2>

      <ReportCard
        who="The IRS accepts reports of phishing and scams that impersonate the IRS."
        when="Use this when you received a suspicious email, call, or message claiming to be the IRS."
        prepare={['Forward the full email or note the phone number', 'Date and what was requested']}
        href="https://www.irs.gov/privacy-disclosure/report-phishing"
        label="IRS – Report phishing"
      />

      <ReportCard
        who="The Treasury Department has a page for reporting scam attempts that impersonate Treasury."
        when="Use this when someone falsely claimed to be from the U.S. Treasury."
        prepare={['How they contacted you', 'What they asked for', 'Any details you have']}
        href="https://www.treasury.gov/about/contact-us/Pages/report-scams.aspx"
        label="Treasury – Report scam attempts"
      />

      <ReportCard
        who="The FTC and IC3 also take reports of government imposter scams."
        when="Use these for any scam where someone pretended to be a government official (IRS, SSA, etc.)."
        prepare={['Dates and contact method', 'What they asked for', 'Amount of money if any']}
        href="https://reportfraud.ftc.gov/"
        label="FTC ReportFraud"
      />

      <p>
        Older adults targeted by fraud can also contact the <a href="https://www.justice.gov/elderjustice/national-elder-fraud-hotline" target="_blank" rel="noopener noreferrer">National Elder Fraud Hotline</a>.
      </p>

      <h2>Scam types in this category</h2>
      <p>Detailed guides and where to report each:</p>
      <ul className="scam-links">
        {impersonationScams.map((scam) => (
          <li key={scam.slug}><Link href={`/us/scams/${scam.slug}/`}>{scam.name}</Link></li>
        ))}
      </ul>
    </>
  );
}
