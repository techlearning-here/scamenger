/**
 * Country-specific emergency and reporting links for the Need help now? page.
 * Key = country code (ISO 3166-1 alpha-2). Use "US" as fallback when country is unknown.
 */

export interface HelpLink {
  label: string;
  href: string;
  description: string;
  external: boolean;
}

export const HELP_LINKS_BY_COUNTRY: Record<string, HelpLink[]> = {
  US: [
    { label: 'FTC Report Fraud', href: 'https://reportfraud.ftc.gov/', description: 'Report scams, fraud, and identity theft to the Federal Trade Commission.', external: true },
    { label: 'FBI IC3 (Internet Crime)', href: 'https://www.ic3.gov/', description: 'Report internet crime, including phishing, romance scams, and online fraud.', external: true },
    { label: 'CFPB – Submit a complaint', href: 'https://www.consumerfinance.gov/complaint/', description: 'Complaints about banks, credit cards, loans, and financial services.', external: true },
    { label: 'National Elder Fraud Hotline', href: 'tel:+18333728311', description: '1-833-372-8311 — Report elder fraud and get support (DOJ). Mon–Fri 10am–6pm ET.', external: true },
    { label: 'IdentityTheft.gov', href: 'https://www.identitytheft.gov/', description: 'Step-by-step recovery and reporting if someone stole your identity.', external: true },
    { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience with our community and get a shareable report link.', external: false },
  ],
  GB: [
    { label: 'Action Fraud', href: 'https://www.actionfraud.police.uk/', description: 'Report fraud and cyber crime in England, Wales and Northern Ireland.', external: true },
    { label: 'Police Scotland', href: 'https://www.scotland.police.uk/contact-us/report-a-crime/', description: 'Report fraud and crime in Scotland.', external: true },
    { label: 'FCA – Report a scam', href: 'https://www.fca.org.uk/consumers/report-scam', description: 'Report financial scams to the Financial Conduct Authority.', external: true },
    { label: 'Citizens Advice – Scams', href: 'https://www.citizensadvice.org.uk/consumer/scams/reporting-a-scam/', description: 'Get advice and report scams.', external: true },
    { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience with our community and get a shareable report link.', external: false },
  ],
  CA: [
    { label: 'Canadian Anti-Fraud Centre (CAFC)', href: 'https://www.antifraudcentre-centreantifraude.ca/index-eng.htm', description: 'Report fraud and identity theft. 1-888-495-8501.', external: true },
    { label: 'FCAC – Complaints', href: 'https://www.canada.ca/en/financial-consumer-agency/services/complaints.html', description: 'Complaints about banks and financial services.', external: true },
    { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience with our community and get a shareable report link.', external: false },
  ],
  AU: [
    { label: 'Scamwatch (ACCC)', href: 'https://www.scamwatch.gov.au/report-a-scam', description: 'Report scams to the Australian Competition and Consumer Commission.', external: true },
    { label: 'IDCARE', href: 'https://www.idcare.org/', description: 'Free support for identity theft and cyber issues in Australia and New Zealand.', external: true },
    { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience with our community and get a shareable report link.', external: false },
  ],
  DE: [
    { label: 'Polizei – Onlinewache', href: 'https://www.polizei.de/Polizei/DE/Onlinewache/onlinewache_node.html', description: 'Report crime online (in German).', external: true },
    { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience with our community and get a shareable report link.', external: false },
  ],
  FR: [
    { label: 'Signalement – Pharos', href: 'https://www.internet-signalement.gouv.fr/', description: 'Report illegal content and scams (PHAROS).', external: true },
    { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience with our community and get a shareable report link.', external: false },
  ],
  IN: [
    { label: 'National Cyber Crime Portal', href: 'https://cybercrime.gov.in/', description: 'Report cyber crime to the Government of India.', external: true },
    { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience with our community and get a shareable report link.', external: false },
  ],
  NG: [
    { label: 'EFCC – Report fraud', href: 'https://efcc.gov.ng/', description: 'Economic and Financial Crimes Commission.', external: true },
    { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience with our community and get a shareable report link.', external: false },
  ],
  PH: [
    { label: 'NPC – Data privacy complaints', href: 'https://www.privacy.gov.ph/', description: 'National Privacy Commission.', external: true },
    { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience with our community and get a shareable report link.', external: false },
  ],
  ZA: [
    { label: 'South African Police – Report', href: 'https://www.saps.gov.za/', description: 'Report crime to the SAPS.', external: true },
    { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience with our community and get a shareable report link.', external: false },
  ],
  OTHER: [
    { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience with our community and get a shareable report link.', external: false },
    { label: 'FTC Report Fraud (USA)', href: 'https://reportfraud.ftc.gov/', description: 'If the scam targeted the U.S., you can report to the FTC.', external: true },
  ],
};

const DEFAULT_COUNTRY = 'US';

/**
 * Returns help links for the given country code. Falls back to US, then OTHER.
 */
export function getHelpLinksForCountry(countryCode: string): HelpLink[] {
  const code = countryCode?.toUpperCase() || DEFAULT_COUNTRY;
  return HELP_LINKS_BY_COUNTRY[code] ?? HELP_LINKS_BY_COUNTRY[DEFAULT_COUNTRY] ?? HELP_LINKS_BY_COUNTRY.OTHER;
}
