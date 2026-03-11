import type { Metadata } from 'next';
import { CategoryIntro } from '@/components/CategoryIntro';
import { ProgressSteps } from '@/components/ProgressSteps';
import { ReportCard } from '@/components/ReportCard';
import { ScamCard } from '@/components/ScamCard';
import { getUsScamTypes } from '@/data/us-scams';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Financial and banking scams',
  description: 'Where to report bank fraud, card fraud, loan scams, and debt collector issues. CFPB complaint portal and regulator links.',
  keywords: 'report bank fraud, report credit card fraud, CFPB complaint, loan scam report, debt collector complaint, Zelle fraud report, wire fraud report',
  alternates: { canonical: `${siteUrl}/us/financial-banking/` },
  openGraph: {
    title: 'Financial and banking scams | Scam Avenger',
    description: 'Where to report bank fraud, card fraud, loan scams, and debt collector issues. CFPB complaint portal and regulator links.',
    url: `${siteUrl}/us/financial-banking/`,
  },
  twitter: { card: 'summary_large_image', title: 'Financial and banking scams | Scam Avenger', description: 'Where to report bank fraud, card fraud, loan scams, and debt collector issues.' },
};

export default function FinancialBankingPage() {
  const financialScams = getUsScamTypes().filter((s) => s.category === 'financial');

  return (
    <>
      <h1>Financial and banking scams</h1>

      <ProgressSteps preventHref="#scam-types-in-category" preventLabel="Browse scam guides" />

      <CategoryIntro
        intro="For issues with bank accounts, credit cards, loans, mortgages, or debt collectors—including scams like fake bank texts or Zelle/transfer fraud—report to the agencies below. If money was stolen, also contact your bank and local police or the FBI as appropriate."
        steps={[
          'Stop any further transfers or payments.',
          'Contact your bank or card issuer to report fraud and protect your account.',
          'Save all evidence: dates, amounts, messages, and how you paid.',
          'Report to the right official channel using the links below.',
        ]}
      />

      <h2>Where to report</h2>

      <ReportCard
        who="The CFPB takes complaints about banks, credit cards, loans, mortgages, and debt collection."
        when="Use this for problems with financial products or services, including scams involving your bank or card."
        prepare={['Dates and amounts', 'Name of company and account details', 'What happened', "Steps you've already taken"]}
        href="https://www.consumerfinance.gov/complaint/"
        label="Go to CFPB complaint portal"
      />

      <ReportCard
        who="Federal banking regulators (OCC, Fed, FDIC) provide fraud resources and oversight."
        when="Use their resources for fraud involving banks they supervise; CFPB may still be the main place to file a complaint."
        prepare={['Your bank name', 'Dates and description of the issue']}
        href="https://www.usa.gov/bank-complaints"
        label="USA.gov – Bank complaints and fraud"
      />

      <p>
        If money was stolen or you are a victim of fraud, also contact your local police and consider <a href="https://www.ic3.gov/" target="_blank" rel="noopener noreferrer">IC3</a> for internet-related theft.
      </p>

      <h2 id="scam-types-in-category">Scam types in this category</h2>
      <p>Detailed guides and where to report each:</p>
      <ul className="scam-cards-grid">
        {financialScams.map((scam) => (
          <ScamCard key={scam.slug} slug={scam.slug} name={scam.name} category={scam.category} />
        ))}
      </ul>
    </>
  );
}
