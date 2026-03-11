import type { Metadata } from 'next';
import { CategoryIntro } from '@/components/CategoryIntro';
import { ProgressSteps } from '@/components/ProgressSteps';
import { ReportCard } from '@/components/ReportCard';
import { ScamCard } from '@/components/ScamCard';
import { getUsScamTypes } from '@/data/us-scams';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';

export const metadata: Metadata = {
  title: 'Corruption, fraud, and waste in government',
  description: 'Where to report federal fraud, waste, abuse, and retaliation. Oversight.gov and Inspector General (OIG) hotlines.',
  keywords: 'report government fraud, report corruption, Oversight.gov, OIG hotline, federal waste report, report abuse federal program, whistleblower',
  alternates: { canonical: `${siteUrl}/us/corruption-fraud-waste/` },
  openGraph: {
    title: 'Corruption, fraud, and waste in government | Scam Avenger',
    description: 'Where to report federal fraud, waste, abuse, and retaliation. Oversight.gov and Inspector General (OIG) hotlines.',
    url: `${siteUrl}/us/corruption-fraud-waste/`,
  },
  twitter: { card: 'summary_large_image', title: 'Corruption, fraud, and waste in government | Scam Avenger', description: 'Where to report federal fraud, waste, abuse, and retaliation.' },
};

export default function CorruptionFraudWastePage() {
  const governmentScams = getUsScamTypes().filter((s) => s.category === 'government');

  return (
    <>
      <h1>Corruption, fraud, and waste in government</h1>

      <ProgressSteps preventHref="#scam-types-in-category" preventLabel="Browse scam guides" />

      <CategoryIntro
        intro="To report fraud, waste, abuse, or retaliation involving federal programs or employees, use the links below. Oversight.gov is the main entry point; specific Inspector General (OIG) hotlines handle issues for their agencies."
        steps={[
          'Gather what you know: dates, agencies, people involved, and type of concern.',
          'Choose the right place to report (general vs. agency-specific) using the links below.',
          'Use the official complaint or hotline form; your report goes to the right oversight body.',
        ]}
      />

      <h2>Where to report</h2>

      <ReportCard
        who="Oversight.gov explains where to report federal fraud, waste, abuse, or retaliation."
        when="Use this when you're not sure which agency's OIG to contact, or for a general entry point."
        prepare={['What happened', 'Agency or program involved', 'Dates and people if known']}
        href="https://www.oversight.gov/report-fraud-waste-abuse"
        label="Oversight.gov – Where to report"
      />

      <ReportCard
        who="The Department of Justice Office of Inspector General handles DOJ-related misconduct."
        when="Use this for fraud, waste, or abuse involving the DOJ or its components."
        prepare={['Description of the concern', 'Agency component', 'Dates and details']}
        href="https://oig.justice.gov/hotline/"
        label="DOJ OIG hotline"
      />

      <ReportCard
        who="Other federal OIGs (HUD, OPM, USAID, Treasury, etc.) have their own hotlines."
        when="Use the OIG for the agency involved in the conduct you're reporting."
        prepare={['Agency or program', 'What happened', 'Supporting details']}
        href="https://www.oversight.gov/"
        label="Oversight.gov – Agency OIG list"
      />

      <ReportCard
        who="USA.gov helps you complain about a federal or state agency in general."
        when="Use this for service complaints or general agency problems, not only fraud/waste."
        prepare={['Agency name', 'What went wrong', 'What you want them to do']}
        href="https://www.usa.gov/agency-complaints"
        label="USA.gov – Complain about a government agency"
      />

      <p className="note">
        We help you find the right official channels to report scams and corruption.
      </p>

      <h2 id="scam-types-in-category">Scam types in this category</h2>
      <p>Detailed guides and where to report each:</p>
      <ul className="scam-cards-grid">
        {governmentScams.map((scam) => (
          <ScamCard key={scam.slug} slug={scam.slug} name={scam.name} category={scam.category} />
        ))}
      </ul>
    </>
  );
}
