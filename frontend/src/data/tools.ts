/**
 * Country-specific tools and online services: protect/avoid scams, recover, identity & credit.
 * Key = country code (ISO 3166-1 alpha-2). Fallback: US, then OTHER.
 */

export interface ToolLink {
  label: string;
  href: string;
  description: string;
  /** True for preventive tools (avoid becoming a victim). If omitted, derived from section. */
  preventive?: boolean;
  /** True when the tool is free to use. */
  free?: boolean;
  /** True for tools aimed at scam victims (recovery, support). If omitted, derived from section. */
  forVictim?: boolean;
  /** True for tools used to report scams. If omitted, derived from section. */
  forReporting?: boolean;
  /** True for especially important or go-to tools; shown with a star. */
  important?: boolean;
  /** True when the tool is run by a third party (not government); shown with a tag. */
  thirdParty?: boolean;
  /** Short line on key benefits (e.g. "Stay updated on new scams; no sign-up required."). */
  benefits?: string;
  external: boolean;
}

export interface ToolSection {
  heading: string;
  intro: string;
  links: ToolLink[];
}

export type ToolsByCountry = Record<string, ToolSection[]>;

const US_SECTIONS: ToolSection[] = [
  {
    heading: 'Protect & avoid scams – tools/services',
    intro: 'Official resources to stay informed and reduce the risk of fraud.',
    links: [
      { label: 'FTC Consumer Advice', href: 'https://consumer.ftc.gov/', description: 'Tips, scam alerts, and how to avoid fraud.', free: true, important: true, benefits: 'Stay updated on new scams; no sign-up required. Official U.S. government resource.', external: true },
      { label: 'FTC Scam Alerts', href: 'https://consumer.ftc.gov/scams', description: 'Latest scam alerts from the Federal Trade Commission.', free: true, benefits: 'Get alerts on trending scams so you can warn others and avoid falling for the same tricks.', external: true },
      { label: 'AARP Fraud Watch', href: 'https://www.aarp.org/money/scams-fraud/', description: 'Education and resources; free for everyone.', free: true, thirdParty: true, benefits: 'Free for all ages. Helpline, scam-tracking map, and tips to protect yourself and family.', external: true },
      { label: 'CISA – Avoid phishing', href: 'https://www.cisa.gov/uscert/ncas/tips/ST04-014', description: 'U.S. government tips on avoiding phishing and cyber fraud.', free: true, benefits: 'Official cybersecurity guidance; learn how to spot and avoid phishing emails and links.', external: true },
      { label: 'Scamnetic (KnowScam)', href: 'https://scamnetic.com/', description: 'AI-based scam detection and protection; Scan&Score, identity verification, scam education, and live support. Typically offered through banks and partners (paid/subscription).', free: false, thirdParty: true, benefits: 'Real-time scam protection; Scam Score™, identity checks, and scam intervention. Check if your bank or employer offers KnowScam.', external: true },
      { label: 'Norton Genie', href: 'https://us.norton.com/products/genie-scam-detector', description: 'Free AI-powered scam detector; paste text or upload screenshots of messages, emails, or links for instant analysis.', free: true, thirdParty: true, benefits: 'Free web tool and mobile app. Covers phishing, smishing, fake alerts, dating scams. From Norton (Genius Group).', external: true },
      { label: 'Sardine Shield', href: 'https://www.sardine.ai/shield', description: 'Real-time scam and fraud protection app; blocks scam calls, phishing links, suspicious messages, and malicious apps.', free: true, thirdParty: true, benefits: 'Privacy-focused; monitors calls, SMS, and browsing. iOS and Android. From Sardine.', external: true },
      { label: 'Truecaller', href: 'https://www.truecaller.com/', description: 'Caller ID and spam-call blocker; identifies and blocks fraud and spam calls and flags suspicious SMS.', free: true, thirdParty: true, benefits: 'Auto-block spam/fraud calls; SMS fraud detection. Free tier available. Popular globally.', external: true },
      { label: 'ScamProbe', href: 'https://scamprobe.com/', description: 'Free AI scam detector; paste messages (email, SMS, DM) for analysis—highlights red flags, fake links, spoofed domains.', free: true, thirdParty: true, benefits: 'No sign-up; paste text and get instant analysis. Covers phishing, urgency tricks, suspicious requests.', external: true },
      { label: 'Malwarebytes Scam Guard', href: 'https://www.malwarebytes.com/solutions/scam-guard', description: 'Real-time scam detection; AI analysis of texts, emails, URLs, and screenshots. Requires Malwarebytes Premium subscription.', free: false, thirdParty: true, benefits: '24/7 protection on Windows, Mac, iOS, Android. Included in paid Malwarebytes Premium Security only.', external: true },
    ],
  },
  {
    heading: 'Recover – tools/services',
    intro: 'Report fraud and get step-by-step recovery help.',
    links: [
      { label: 'FTC Report Fraud', href: 'https://reportfraud.ftc.gov/', description: 'Report scams, fraud, and identity theft; get a recovery checklist.', free: true, important: true, benefits: 'One place to report; you get a personalised recovery plan and checklist. Used by law enforcement.', external: true },
      { label: 'FBI IC3', href: 'https://www.ic3.gov/', description: 'Report internet crime (phishing, romance scams, online fraud).', free: true, benefits: 'Report internet-related crime; data is used for investigations and trend analysis.', external: true },
      { label: 'CFPB – Submit a complaint', href: 'https://www.consumerfinance.gov/complaint/', description: 'Complaints about banks, credit cards, and financial services.', free: true, benefits: 'Free complaint process; companies must respond. Helps with disputes and refunds.', external: true },
      { label: 'IdentityTheft.gov', href: 'https://www.identitytheft.gov/', description: 'Step-by-step recovery plan and reporting for identity theft.', free: true, important: true, benefits: 'Personalised recovery plan, sample letters, and checklist. Official FTC resource.', external: true },
      { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience and get a shareable report link.', free: true, important: true, benefits: 'No sign-up. Get a link to share with others and help warn your community.', external: false },
    ],
  },
  {
    heading: 'Identity & credit – tools/services',
    intro: 'Freeze credit, get your free report, and protect your identity.',
    links: [
      { label: 'Annual Credit Report', href: 'https://www.annualcreditreport.com/', description: 'Free credit reports from Equifax, Experian, and TransUnion.', free: true, important: true, benefits: 'By law you get one free report per bureau per year. Spot errors or signs of identity theft early.', external: true },
      { label: 'FTC – Credit freeze', href: 'https://consumer.ftc.gov/articles/what-know-about-credit-freezes-and-fraud-alerts', description: 'How to place a credit freeze at the three bureaus.', free: true, important: true, benefits: 'Freeze is free; blocks new creditors from seeing your file so scammers can’t open new accounts.', external: true },
      { label: 'IdentityTheft.gov', href: 'https://www.identitytheft.gov/', description: 'Recovery plan, sample letters, and checklist.', free: true, benefits: 'Walk-through for identity theft: report, dispute, and restore your identity step by step.', external: true },
      { label: 'IRS Identity Protection PIN', href: 'https://www.irs.gov/identity-theft-central', description: 'Tax-related identity theft and IP PIN.', free: true, benefits: 'Free IP PIN helps prevent someone else from filing a tax return in your name.', external: true },
      { label: 'my Social Security', href: 'https://www.ssa.gov/myaccount/', description: 'Block electronic access and check earnings (SSA).', free: true, benefits: 'Free account to block online access to your SSA record and check earnings for fraud.', external: true },
      { label: 'CreditWise (Capital One)', href: 'https://www.capitalone.com/creditwise/', description: 'Free credit monitoring; monitors TransUnion and Experian, dark web scan.', free: true, thirdParty: true, benefits: 'No Capital One account required. Alerts for new accounts and SSN activity.', external: true },
    ],
  },
];

const GB_SECTIONS: ToolSection[] = [
  {
    heading: 'Protect & avoid scams – tools/services',
    intro: 'Official resources to stay informed and reduce the risk of fraud.',
    links: [
      { label: 'Action Fraud', href: 'https://www.actionfraud.police.uk/', description: 'National reporting centre; awareness and prevention.', free: true, forReporting: true, important: true, benefits: 'Official UK fraud reporting; get advice and report. Free 24/7.', external: true },
      { label: 'FCA ScamSmart', href: 'https://www.fca.org.uk/scamsmart', description: 'Check investments and avoid investment scams.', free: true, important: true, benefits: 'Check if a firm is authorised; warning list and tips to avoid investment fraud.', external: true },
      { label: 'Take Five', href: 'https://www.takefive-stopfraud.org.uk/', description: 'Stop fraud advice and campaign (UK Finance).', free: true, thirdParty: true, benefits: 'Simple “take five” steps to stop and think before you act; reduces impulse decisions.', external: true },
      { label: 'Citizens Advice – Scams', href: 'https://www.citizensadvice.org.uk/consumer/scams/', description: 'Advice on recognising and avoiding scams.', free: true, benefits: 'Free, impartial advice; learn to spot scams and what to do next.', external: true },
      { label: 'NCSC – Phishing', href: 'https://www.ncsc.gov.uk/guidance/suspicious-email-actions', description: 'What to do with suspicious emails (National Cyber Security Centre).', free: true, benefits: 'Official guidance on handling suspicious emails and links; report phishing.', external: true },
      { label: 'Get Safe Online', href: 'https://www.getsafeonline.org/', description: 'UK online safety advice; check a website, spot scams, and use free tools.', free: true, thirdParty: true, benefits: 'Website checker, "Is it a scam?" tool, and practical guidance. Not run by government.', external: true },
      { label: 'Ask Silver', href: 'https://www.asksilver.com/', description: 'Free scam checker via website or WhatsApp; AI and trusted sources.', free: true, thirdParty: true, benefits: 'Check screenshots, photos, phone numbers, and links; response in under 30 seconds. UK-based.', external: true },
      { label: 'Trend Micro ScamCheck', href: 'https://www.trendmicro.com/en_us/forHome/products/trend-micro-scam-check.html', description: 'AI scam detector app; check messages, links, and deepfakes; SMS and call blocking. 30-day free trial, then subscription.', free: false, thirdParty: true, benefits: 'Scam Radar, deepfake detection on video calls, spam blocking. 30-day free trial; in-app subscription after. iOS and Android.', external: true },
      { label: 'ScamProbe', href: 'https://scamprobe.com/', description: 'Free AI scam detector; paste messages for analysis—highlights red flags, fake links, spoofed domains.', free: true, thirdParty: true, benefits: 'No sign-up; paste text and get instant analysis. Covers phishing and suspicious requests.', external: true },
      { label: 'ScamAvert', href: 'https://scamavert.com/', description: 'AI-powered real-time protection across email, texts, browser, and links; optional Guardian alerts. Free during open beta.', free: true, thirdParty: true, benefits: 'Free during open beta. Contextual analysis, URL intelligence; protect yourself and alert trusted contacts.', external: true },
    ],
  },
  {
    heading: 'Recover – tools/services',
    intro: 'Report fraud and get support.',
    links: [
      { label: 'Action Fraud', href: 'https://www.actionfraud.police.uk/', description: 'Report fraud and cyber crime (England, Wales, Northern Ireland).', free: true, benefits: 'Single national reporting service; report online and get a reference number.', external: true },
      { label: 'Police Scotland', href: 'https://www.scotland.police.uk/contact-us/report-a-crime/', description: 'Report fraud and crime in Scotland.', free: true, benefits: 'Report to Police Scotland; get support and a crime reference.', external: true },
      { label: 'FCA – Report a scam', href: 'https://www.fca.org.uk/consumers/report-scam', description: 'Report financial scams to the Financial Conduct Authority.', free: true, benefits: 'Report unauthorised firms and scams; helps FCA warn others and take action.', external: true },
      { label: 'Citizens Advice – Reporting a scam', href: 'https://www.citizensadvice.org.uk/consumer/scams/reporting-a-scam/', description: 'Get advice and report scams.', free: true, benefits: 'Free advice on reporting and next steps; signpost to right agencies.', external: true },
      { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience and get a shareable report link.', free: true, important: true, benefits: 'No sign-up. Get a link to share and help warn your community.', external: false },
    ],
  },
  {
    heading: 'Identity & credit – tools/services',
    intro: 'Protect your identity and check your credit.',
    links: [
      { label: 'Cifas – Protective registration', href: 'https://www.cifas.org.uk/identity-protection', description: 'Protect your name and address from misuse.', free: true, benefits: 'Reduces risk of identity fraud; lenders check Cifas before opening new accounts.', external: true },
      { label: 'Action Fraud – Identity crime', href: 'https://www.actionfraud.police.uk/a-z-of-fraud/identity-fraud', description: 'Report and get advice on identity fraud.', free: true, benefits: 'Report identity fraud and get guidance on what to do next.', external: true },
      { label: 'GOV.UK – Identity theft', href: 'https://www.gov.uk/identity-theft', description: 'Official guidance on identity theft.', free: true, benefits: 'Step-by-step official guidance: report, protect accounts, and check credit.', external: true },
    ],
  },
];

const CA_SECTIONS: ToolSection[] = [
  {
    heading: 'Protect & avoid scams – tools/services',
    intro: 'Official resources to stay informed and reduce the risk of fraud.',
    links: [
      { label: 'Canadian Anti-Fraud Centre (CAFC)', href: 'https://www.antifraudcentre-centreantifraude.ca/index-eng.htm', description: 'Fraud prevention tips and alerts. 1-888-495-8501.', free: true, important: true, benefits: 'Government-run; fraud alerts, prevention tips, and reporting. Free helpline.', external: true },
      { label: 'FCAC', href: 'https://www.canada.ca/en/financial-consumer-agency.html', description: 'Financial literacy and consumer protection.', free: true, benefits: 'Free tools and info to understand financial products and avoid fraud.', external: true },
      { label: 'Competition Bureau – Scams', href: 'https://www.competitionbureau.gc.ca/eic/site/cb-bc.nsf/eng/04348.html', description: 'Learn about common scams and how to protect yourself.', free: true, benefits: 'Official info on scams and deceptive practices; report to help investigations.', external: true },
      { label: 'Scamnetic (KnowScam)', href: 'https://scamnetic.com/', description: 'AI-based scam detection and protection; Scan&Score, identity verification, scam education, and live support. Typically offered through banks and partners (paid/subscription).', free: false, thirdParty: true, benefits: 'Real-time scam protection; Scam Score™, identity checks, and scam intervention. Check if your bank or employer offers KnowScam.', external: true },
      { label: 'Norton Genie', href: 'https://us.norton.com/products/genie-scam-detector', description: 'Free AI-powered scam detector; paste text or upload screenshots for instant analysis.', free: true, thirdParty: true, benefits: 'Free web and app. Covers phishing, smishing, fake alerts, dating scams. From Norton.', external: true },
      { label: 'Trend Micro ScamCheck', href: 'https://www.trendmicro.com/en_us/forHome/products/trend-micro-scam-check.html', description: 'AI scam detector app; check messages, links, deepfakes; SMS and call blocking. 30-day free trial, then subscription.', free: false, thirdParty: true, benefits: 'Scam Radar, deepfake detection, spam blocking. 30-day free trial; in-app subscription after. iOS and Android.', external: true },
      { label: 'ScamProbe', href: 'https://scamprobe.com/', description: 'Free AI scam detector; paste messages for analysis—highlights red flags, fake links, spoofed domains.', free: true, thirdParty: true, benefits: 'No sign-up; paste text and get instant analysis. Covers phishing and suspicious requests.', external: true },
    ],
  },
  {
    heading: 'Recover – tools/services',
    intro: 'Report fraud and get help.',
    links: [
      { label: 'Canadian Anti-Fraud Centre', href: 'https://www.antifraudcentre-centreantifraude.ca/report-signaler-eng.htm', description: 'Report fraud and identity theft.', free: true, benefits: 'Central place to report; data shared with law enforcement and used for awareness.', external: true },
      { label: 'FCAC – Complaints', href: 'https://www.canada.ca/en/financial-consumer-agency/services/complaints.html', description: 'Complaints about banks and financial services.', free: true, benefits: 'Free complaint process; federally regulated banks must respond.', external: true },
      { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience and get a shareable report link.', free: true, important: true, benefits: 'No sign-up. Get a link to share and help warn your community.', external: false },
    ],
  },
  {
    heading: 'Identity & credit – tools/services',
    intro: 'Check your credit and protect your identity.',
    links: [
      { label: 'Equifax Canada', href: 'https://www.equifax.ca/personal/credit-report.html', description: 'Free credit report and freeze options.', free: true, benefits: 'Free disclosure (report) once per year; place a freeze to block new accounts.', external: true },
      { label: 'TransUnion Canada', href: 'https://www.transunion.ca/credit-disputes', description: 'Credit report and dispute fraud.', free: true, benefits: 'Free report and dispute process; correct errors and fraud on your file.', external: true },
      { label: 'CAFC – Identity theft', href: 'https://www.antifraudcentre-centreantifraude.ca/fraud-identite-identity-fraud-eng.htm', description: 'Steps to take if you are a victim.', free: true, benefits: 'Official checklist and guidance for identity theft recovery.', external: true },
    ],
  },
];

const AU_SECTIONS: ToolSection[] = [
  {
    heading: 'Protect & avoid scams – tools/services',
    intro: 'Official resources to stay informed and reduce the risk of fraud.',
    links: [
      { label: 'Scamwatch (ACCC)', href: 'https://www.scamwatch.gov.au/', description: 'Scam alerts, tips, and how to avoid scams.', free: true, important: true, benefits: 'Government-run; stay updated on current scams and protect yourself.', external: true },
      { label: 'IDCARE', href: 'https://www.idcare.org/', description: 'Free support for identity theft and cyber issues (AU & NZ).', free: true, benefits: 'Free support and case management for identity and cyber victims.', external: true },
      { label: 'Moneysmart (ASIC)', href: 'https://moneysmart.gov.au/', description: 'Financial literacy and scam awareness.', free: true, benefits: 'Official ASIC site; learn about scams and protect your money.', external: true },
      { label: 'CheckScam (Australia)', href: 'https://www.checkscam.com.au/', description: 'Free AI email scam detector; forward suspicious emails for a risk assessment.', free: true, thirdParty: true, benefits: 'Not-for-profit. Send to check@checkscam.com.au; get detailed recommendations.', external: true },
      { label: 'OziShield', href: 'https://ozishield.com/', description: 'Free scam and link checker for Australia and other regions.', free: true, thirdParty: true, benefits: 'Analyzes links in real-time; education on job, delivery, and banking scams.', external: true },
      { label: 'Norton Genie', href: 'https://us.norton.com/products/genie-scam-detector', description: 'Free AI-powered scam detector; paste text or upload screenshots for instant analysis.', free: true, thirdParty: true, benefits: 'Free web and app. Covers phishing, smishing, fake alerts, dating scams. From Norton.', external: true },
      { label: 'Trend Micro ScamCheck', href: 'https://www.trendmicro.com/en_us/forHome/products/trend-micro-scam-check.html', description: 'AI scam detector app; check messages, links, deepfakes; SMS and call blocking. 30-day free trial, then subscription.', free: false, thirdParty: true, benefits: 'Scam Radar, deepfake detection, spam blocking. 30-day free trial; in-app subscription after. iOS and Android.', external: true },
      { label: 'ScamProbe', href: 'https://scamprobe.com/', description: 'Free AI scam detector; paste messages for analysis—highlights red flags, fake links, spoofed domains.', free: true, thirdParty: true, benefits: 'No sign-up; paste text and get instant analysis. Covers phishing and suspicious requests.', external: true },
    ],
  },
  {
    heading: 'Recover – tools/services',
    intro: 'Report scams and get support.',
    links: [
      { label: 'Scamwatch – Report a scam', href: 'https://www.scamwatch.gov.au/report-a-scam', description: 'Report scams to the ACCC.', free: true, benefits: 'Report helps authorities track trends and warn others.', external: true },
      { label: 'IDCARE', href: 'https://www.idcare.org/', description: 'Free support for identity and cyber victim recovery.', free: true, benefits: 'Free one-on-one support; get a recovery plan and liaison with organisations.', external: true },
      { label: 'ReportCyber (ACSC)', href: 'https://www.cyber.gov.au/report', description: 'Report cybercrime to the Australian Cyber Security Centre.', free: true, benefits: 'Report cybercrime; used for national picture and victim support.', external: true },
      { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience and get a shareable report link.', free: true, important: true, benefits: 'No sign-up. Get a link to share and help warn your community.', external: false },
    ],
  },
  {
    heading: 'Identity & credit – tools/services',
    intro: 'Check your credit and protect your identity.',
    links: [
      { label: 'IDCARE', href: 'https://www.idcare.org/', description: 'Identity theft support and recovery.', free: true, benefits: 'Free identity theft support; help with credit and document restoration.', external: true },
      { label: 'Equifax Australia', href: 'https://www.equifax.com.au/personal/products/credit-report', description: 'Free credit report and correction options.', free: true, benefits: 'Free report once per year; dispute errors and fraud.', external: true },
      { label: 'OAIC – Privacy complaints', href: 'https://www.oaic.gov.au/privacy/privacy-complaints', description: 'Complain about misuse of your personal information.', free: true, benefits: 'Free to complain; OAIC can investigate and require organisations to fix issues.', external: true },
    ],
  },
];

const IN_SECTIONS: ToolSection[] = [
  {
    heading: 'Protect & avoid scams – tools/services',
    intro: 'Official resources to stay informed and reduce the risk of fraud.',
    links: [
      { label: 'National Cyber Crime Portal', href: 'https://cybercrime.gov.in/', description: 'Awareness and reporting of cyber crime (Government of India).', free: true, important: true, benefits: 'Official portal; report and get awareness on cyber crime. Free.', external: true },
      { label: 'RBI – Consumer awareness', href: 'https://www.rbi.org.in/scripts/BS_ViewBulletin.aspx', description: 'Reserve Bank alerts and fraud awareness.', free: true, benefits: 'Central bank alerts and guidance to avoid banking and payment fraud.', external: true },
      { label: 'PIB Fact Check', href: 'https://pib.gov.in/Factcheck.aspx', description: 'Government fact-checking of viral claims.', free: true, benefits: 'Verify viral messages and avoid sharing or acting on fake news.', external: true },
      { label: 'Chetana (ActiveMirror)', href: 'https://chetana.activemirror.ai/', description: 'AI scam protection; check calls, messages, links, photos, QR codes. 12 Indian languages.', free: true, thirdParty: true, benefits: 'Color-coded results (safe/caution/danger); optional family alerts via WhatsApp.', external: true },
      { label: 'ScamCheck India', href: 'https://scamcheckindia.com/', description: 'Check suspicious websites and e-commerce sites; chatbot and awareness.', free: true, thirdParty: true, benefits: 'Supported by BIG FM / SAFECOM; verify before you buy or share.', external: true },
      { label: 'Truecaller', href: 'https://www.truecaller.com/', description: 'Caller ID and spam/fraud call blocker; identify and block scam calls and suspicious SMS.', free: true, thirdParty: true, benefits: 'Very popular in India. Auto-block spam; SMS fraud detection. Free tier available.', external: true },
      { label: 'ScamProbe', href: 'https://scamprobe.com/', description: 'Free AI scam detector; paste messages for analysis—highlights red flags, fake links, spoofed domains.', free: true, thirdParty: true, benefits: 'No sign-up; paste text and get instant analysis. Covers phishing and suspicious requests.', external: true },
    ],
  },
  {
    heading: 'Recover – tools/services',
    intro: 'Report fraud and get help.',
    links: [
      { label: 'National Cyber Crime Portal', href: 'https://cybercrime.gov.in/Webform/Crime_AuthoLogin.aspx', description: 'Report cyber crime to the Government of India.', free: true, benefits: 'Report online; track status and get reference for follow-up.', external: true },
      { label: 'National Consumer Helpline', href: 'https://consumerhelpline.gov.in/', description: 'Consumer complaints and scam reporting. 1915 or 1800-11-4000.', free: true, benefits: 'Free helpline; lodge complaints and get guidance on redress.', external: true },
      { label: 'RBI – Complaints', href: 'https://www.rbi.org.in/Scripts/Complaints.aspx', description: 'Complaints about banks and regulated entities.', free: true, benefits: 'Complain against RBI-regulated entities; escalation path for unresolved issues.', external: true },
      { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience and get a shareable report link.', free: true, important: true, benefits: 'No sign-up. Get a link to share and help warn your community.', external: false },
    ],
  },
  {
    heading: 'Identity & credit – tools/services',
    intro: 'Protect your identity and credit.',
    links: [
      { label: 'CIBIL / Experian / Equifax India', href: 'https://www.cibil.com/free-credit-score', description: 'Free credit report and dispute fraud.', free: true, benefits: 'Free annual report from bureaus; dispute errors and fraudulent accounts.', external: true },
      { label: 'CERT-In', href: 'https://www.cert-in.org.in/', description: 'Report cyber security incidents.', free: true, benefits: 'National CERT; report incidents and get guidance on response.', external: true },
      { label: 'National Cyber Crime Portal', href: 'https://cybercrime.gov.in/', description: 'Report identity theft and cyber crime.', free: true, benefits: 'Single portal to report identity theft and related cyber crime.', external: true },
    ],
  },
];

const EU_SECTIONS: ToolSection[] = [
  {
    heading: 'Protect & avoid scams – tools/services',
    intro: 'EU-wide and national resources to stay informed.',
    links: [
      { label: 'European Consumer Centre Network', href: 'https://ec.europa.eu/info/live-work-travel-eu/consumer-rights-and-complaints/enforcement-consumer-protection/consumer-centres_en', description: 'Find your national consumer centre for advice.', free: true, benefits: 'Free advice from your country’s centre; cross-border scam help.', external: true },
      { label: 'European Commission – Consumer safety', href: 'https://ec.europa.eu/safety-gate/', description: 'Product safety alerts (including scams).', free: true, benefits: 'Rapid alerts on dangerous products and related scams across the EU.', external: true },
      { label: 'ScamAvert', href: 'https://scamavert.com/', description: 'AI-powered real-time protection across email, texts, browser, and links; optional Guardian alerts. Free during open beta.', free: true, thirdParty: true, benefits: 'Free during open beta. Contextual analysis, URL intelligence; protect yourself and alert trusted contacts.', external: true },
      { label: 'ScamProbe', href: 'https://scamprobe.com/', description: 'Free AI scam detector; paste messages for analysis—highlights red flags, fake links, spoofed domains.', free: true, thirdParty: true, benefits: 'No sign-up; paste text and get instant analysis. Covers phishing and suspicious requests.', external: true },
    ],
  },
  {
    heading: 'Recover – tools/services',
    intro: 'Report and complain across the EU.',
    links: [
      { label: 'European Consumer Centres', href: 'https://ec.europa.eu/info/live-work-travel-eu/consumer-rights-and-complaints/enforcement-consumer-protection/consumer-centres_en', description: 'Cross-border complaints and scams.', free: true, benefits: 'Free help with cross-border disputes and reporting scams.', external: true },
      { label: 'EC – Online dispute resolution', href: 'https://ec.europa.eu/consumers/odr/', description: 'Online dispute resolution for consumer complaints.', free: true, benefits: 'Free ODR platform; traders can be invited to resolve disputes.', external: true },
      { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience and get a shareable report link.', free: true, important: true, benefits: 'No sign-up. Get a link to share and help warn your community.', external: false },
    ],
  },
  {
    heading: 'Identity & credit – tools/services',
    intro: 'Data protection and credit in the EU.',
    links: [
      { label: 'Your Europe – Consumer', href: 'https://europa.eu/youreurope/citizens/consumers/index_en.htm', description: 'Consumer rights and redress in the EU.', free: true, benefits: 'Official info on your rights and how to seek redress in the EU.', external: true },
    ],
  },
];

const DE_SECTIONS: ToolSection[] = [
  {
    heading: 'Protect & avoid scams – tools/services',
    intro: 'Offizielle Ressourcen zum Schutz vor Betrug.',
    links: [
      { label: 'BSI – Bürger', href: 'https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/verbraucherinnen-und-verbraucher_node.html', description: 'Cybersicherheit und Phishing-Tipps (Bundesamt für Sicherheit).', free: true, benefits: 'Offizielle Tipps zu Phishing und Cybersicherheit; kostenlos.', external: true },
      { label: 'Verbraucherzentrale', href: 'https://www.verbraucherzentrale.de/', description: 'Verbraucherberatung und Betrugsprävention.', free: true, thirdParty: true, benefits: 'Kostenlose Beratung; Betrug erkennen und melden. Fakeshop-Checker für Shop-URLs.', external: true },
      { label: 'ScamProbe', href: 'https://scamprobe.com/', description: 'Free AI scam detector; paste messages for analysis—highlights red flags, fake links, spoofed domains.', free: true, thirdParty: true, benefits: 'No sign-up; paste text and get instant analysis. Covers phishing and suspicious requests.', external: true },
    ],
  },
  {
    heading: 'Recover – tools/services',
    intro: 'Betrug melden und Hilfe holen.',
    links: [
      { label: 'Polizei – Onlinewache', href: 'https://www.polizei.de/Polizei/DE/Onlinewache/onlinewache_node.html', description: 'Straftaten online melden.', free: true, benefits: 'Straftaten online melden; kostenlos und offiziell.', external: true },
      { label: 'Verbraucherzentrale – Beschwerde', href: 'https://www.verbraucherzentrale.de/', description: 'Beratung und Beschwerdemöglichkeiten.', free: true, benefits: 'Beratung und Unterstützung bei Beschwerden; kostenlos.', external: true },
      { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience and get a shareable report link.', free: true, important: true, benefits: 'No sign-up. Get a link to share and help warn your community.', external: false },
    ],
  },
  {
    heading: 'Identity & credit – tools/services',
    intro: 'Identitätsdiebstahl und Schufa.',
    links: [
      { label: 'Schufa – Selbstauskunft', href: 'https://www.schufa.de/', description: 'Kostenlose Datenübersicht und Sperre (Selbstauskunft).', free: true, benefits: 'Kostenlose Datenübersicht einmal jährlich; Sperre gegen Missbrauch.', external: true },
    ],
  },
];

const FR_SECTIONS: ToolSection[] = [
  {
    heading: 'Protect & avoid scams – tools/services',
    intro: 'Ressources officielles pour vous protéger.',
    links: [
      { label: 'Signalement – Pharos', href: 'https://www.internet-signalement.gouv.fr/', description: 'Signaler contenus illégaux et arnaques (PHAROS).', free: true, benefits: 'Service public gratuit; signaler et consulter les conseils.', external: true },
      { label: 'DGCCRF – Arnaques', href: 'https://www.economie.gouv.fr/dgccrf', description: 'Conseils et signalement des arnaques (Conso).', free: true, benefits: 'Conseils et signalement des arnaques; protection des consommateurs.', external: true },
      { label: 'FranceVerif', href: 'https://franceverif.fr/fr/checker', description: 'Détecteur d’arnaques e-commerce; vérifier un site ou un numéro de téléphone.', free: true, thirdParty: true, benefits: 'Premier détecteur e-commerce en France; service gratuit (WebVerif SAS).', external: true },
      { label: 'ScamProbe', href: 'https://scamprobe.com/', description: 'Free AI scam detector; paste messages for analysis—highlights red flags, fake links, spoofed domains.', free: true, thirdParty: true, benefits: 'No sign-up; paste text and get instant analysis. Covers phishing and suspicious requests.', external: true },
    ],
  },
  {
    heading: 'Recover – tools/services',
    intro: 'Signaler une arnaque et obtenir de l\'aide.',
    links: [
      { label: 'Signalement – Pharos', href: 'https://www.internet-signalement.gouv.fr/', description: 'Signaler une arnaque en ligne.', free: true, benefits: 'Signalement en ligne gratuit; traité par les autorités.', external: true },
      { label: 'Service-Public – Arnaque', href: 'https://www.service-public.fr/particuliers/vosdroits/F31800', description: 'Que faire en cas d\'arnaque.', free: true, benefits: 'Démarches officielles et démarches à faire après une arnaque.', external: true },
      { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience and get a shareable report link.', free: true, important: true, benefits: 'No sign-up. Get a link to share and help warn your community.', external: false },
    ],
  },
  {
    heading: 'Identity & credit – tools/services',
    intro: 'Vol d\'identité et crédit.',
    links: [
      { label: 'Service-Public – Vol d\'identité', href: 'https://www.service-public.fr/particuliers/vosdroits/F31801', description: 'Démarches en cas d\'usurpation d\'identité.', free: true, benefits: 'Guide officiel des démarches en cas d\'usurpation d\'identité.', external: true },
    ],
  },
];

const NG_SECTIONS: ToolSection[] = [
  {
    heading: 'Protect & avoid scams – tools/services',
    intro: 'Official resources to stay informed.',
    links: [
      { label: 'EFCC', href: 'https://efcc.gov.ng/', description: 'Economic and Financial Crimes Commission – awareness.', free: true, benefits: 'Official body; awareness and reporting of economic and financial crime.', external: true },
      { label: 'CBN – Consumer protection', href: 'https://www.cbn.gov.ng/', description: 'Central Bank of Nigeria – consumer alerts.', free: true, benefits: 'Central bank consumer info and alerts to avoid banking fraud.', external: true },
      { label: 'ScamProbe', href: 'https://scamprobe.com/', description: 'Free AI scam detector; paste messages for analysis—highlights red flags, fake links, spoofed domains.', free: true, thirdParty: true, benefits: 'No sign-up; paste text and get instant analysis. Covers phishing and suspicious requests.', external: true },
    ],
  },
  {
    heading: 'Recover – tools/services',
    intro: 'Report fraud and get help.',
    links: [
      { label: 'EFCC – Report', href: 'https://efcc.gov.ng/', description: 'Report fraud to the EFCC.', free: true, benefits: 'Report economic and financial crime; investigations and awareness.', external: true },
      { label: 'NCC', href: 'https://www.ncc.gov.ng/', description: 'Telecom fraud (Nigerian Communications Commission).', free: true, benefits: 'Report telecom-related fraud and get regulatory guidance.', external: true },
      { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience and get a shareable report link.', free: true, important: true, benefits: 'No sign-up. Get a link to share and help warn your community.', external: false },
    ],
  },
  {
    heading: 'Identity & credit – tools/services',
    intro: 'Identity and data protection.',
    links: [
      { label: 'NIMC', href: 'https://www.nimc.gov.ng/', description: 'National Identity Management Commission.', free: true, benefits: 'National ID services; protect and verify your identity.', external: true },
    ],
  },
];

const PH_SECTIONS: ToolSection[] = [
  {
    heading: 'Protect & avoid scams – tools/services',
    intro: 'Official resources to stay informed.',
    links: [
      { label: 'BSP – Consumer protection', href: 'https://www.bsp.gov.ph/', description: 'Bangko Sentral – consumer alerts.', free: true, benefits: 'Central bank alerts and consumer protection info.', external: true },
      { label: 'NPC – Privacy', href: 'https://www.privacy.gov.ph/', description: 'National Privacy Commission.', free: true, benefits: 'Data privacy guidance and complaint options.', external: true },
      { label: 'PNP-ACG', href: 'https://acg.pnp.gov.ph/', description: 'Anti-Cybercrime Group – awareness.', free: true, benefits: 'Awareness and reporting of cybercrime.', external: true },
      { label: 'ScamProbe', href: 'https://scamprobe.com/', description: 'Free AI scam detector; paste messages for analysis—highlights red flags, fake links, spoofed domains.', free: true, thirdParty: true, benefits: 'No sign-up; paste text and get instant analysis. Covers phishing and suspicious requests.', external: true },
    ],
  },
  {
    heading: 'Recover – tools/services',
    intro: 'Report scams and get help.',
    links: [
      { label: 'PNP-ACG – Report', href: 'https://acg.pnp.gov.ph/', description: 'Report cybercrime to the PNP.', free: true, benefits: 'Report cybercrime; official police channel.', external: true },
      { label: 'BSP – Complaints', href: 'https://www.bsp.gov.ph/Pages/ConsumerProtection/Complaints.aspx', description: 'Complaints about BSP-supervised institutions.', free: true, benefits: 'Free complaint process for BSP-supervised entities.', external: true },
      { label: 'NPC – Complaints', href: 'https://www.privacy.gov.ph/', description: 'Data privacy and breach complaints.', free: true, benefits: 'Complain about data breaches and misuse of personal data.', external: true },
      { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience and get a shareable report link.', free: true, important: true, benefits: 'No sign-up. Get a link to share and help warn your community.', external: false },
    ],
  },
  {
    heading: 'Identity & credit – tools/services',
    intro: 'Credit and identity protection.',
    links: [
      { label: 'CIC / TransUnion Philippines', href: 'https://www.creditinfo.com.ph/', description: 'Credit report and dispute options.', free: true, benefits: 'Free credit report and dispute process; spot fraud early.', external: true },
    ],
  },
];

const ZA_SECTIONS: ToolSection[] = [
  {
    heading: 'Protect & avoid scams – tools/services',
    intro: 'Official resources to stay informed.',
    links: [
      { label: 'FSCA – Scam alerts', href: 'https://www.fsca.co.za/', description: 'Financial Sector Conduct Authority – warnings.', free: true, benefits: 'Regulator warnings and alerts; check authorised financial providers.', external: true },
      { label: 'SAPS – Crime prevention', href: 'https://www.saps.gov.za/', description: 'South African Police Service.', free: true, benefits: 'Crime prevention info and how to report.', external: true },
      { label: 'NCR', href: 'https://www.ncr.org.za/', description: 'National Credit Regulator – consumer info.', free: true, benefits: 'Consumer rights and credit awareness; free resources.', external: true },
      { label: 'ScamChecker.co.za', href: 'https://scamchecker.co.za/', description: 'Free AI-powered scam detection; paste messages or upload screenshots for analysis.', free: true, thirdParty: true, benefits: 'Identifies advance fee, investment, phishing, romance, job scams. Confirm with FSCA when needed.', external: true },
    ],
  },
  {
    heading: 'Recover – tools/services',
    intro: 'Report fraud and get help.',
    links: [
      { label: 'SAPS – Report', href: 'https://www.saps.gov.za/', description: 'Report crime to the SAPS.', free: true, benefits: 'Report crime and get a case number; free.', external: true },
      { label: 'FSCA – Report', href: 'https://www.fsca.co.za/', description: 'Report financial scams.', free: true, benefits: 'Report unauthorised financial services and scams.', external: true },
      { label: 'National Consumer Commission', href: 'https://www.thencc.gov.za/', description: 'Consumer complaints.', free: true, benefits: 'Lodge consumer complaints; free process.', external: true },
      { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience and get a shareable report link.', free: true, important: true, benefits: 'No sign-up. Get a link to share and help warn your community.', external: false },
    ],
  },
  {
    heading: 'Identity & credit – tools/services',
    intro: 'Identity and credit protection.',
    links: [
      { label: 'Information Regulator (POPIA)', href: 'https://www.justice.gov.za/inforeg/', description: 'Data protection and complaints.', free: true, benefits: 'Complain about misuse of your personal information under POPIA.', external: true },
      { label: 'SAFPS', href: 'https://www.safps.org.za/Home/OurServices', description: 'South African Fraud Prevention Service – protective registration and victim support.', free: true, benefits: 'Free protective registration to reduce identity theft; victim support.', external: true },
      { label: 'Experian / TransUnion / Compuscan', href: 'https://www.mycredit.co.za/', description: 'Free credit report and dispute (e.g. MyCredit).', free: true, benefits: 'One free credit report per year; dispute errors and fraud.', external: true },
    ],
  },
];

const OTHER_SECTIONS: ToolSection[] = [
  {
    heading: 'Protect & avoid scams – tools/services',
    intro: 'Select your country above for official tools in your region. General resources:',
    links: [
      { label: 'FTC Consumer Advice (USA)', href: 'https://consumer.ftc.gov/', description: 'If the scam targeted the U.S., use FTC for tips and alerts.', free: true, benefits: 'Free U.S. government resource; scam alerts and prevention tips.', external: true },
      { label: 'European Consumer Centres', href: 'https://ec.europa.eu/info/live-work-travel-eu/consumer-rights-and-complaints/enforcement-consumer-protection/consumer-centres_en', description: 'If you are in the EU, find your national centre.', free: true, benefits: 'Free advice from your EU country’s consumer centre.', external: true },
      { label: 'ScamProbe', href: 'https://scamprobe.com/', description: 'Free AI scam detector; paste messages for analysis—highlights red flags, fake links, spoofed domains.', free: true, thirdParty: true, benefits: 'No sign-up; works globally. Paste text and get instant analysis.', external: true },
    ],
  },
  {
    heading: 'Recover – tools/services',
    intro: 'Report to official agencies in the country where the scam occurred or where you are based.',
    links: [
      { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience and get a shareable report link.', free: true, important: true, benefits: 'No sign-up. Get a link to share and help warn your community.', external: false },
      { label: 'FTC Report Fraud (USA)', href: 'https://reportfraud.ftc.gov/', description: 'If the scam targeted the U.S., report to the FTC.', free: true, benefits: 'Free reporting and personalised recovery plan from the FTC.', external: true },
    ],
  },
  {
    heading: 'Identity & credit – tools/services',
    intro: 'Check official government and credit bureau sites for your country.',
    links: [],
  },
];

export const TOOLS_BY_COUNTRY: ToolsByCountry = {
  US: US_SECTIONS,
  GB: GB_SECTIONS,
  CA: CA_SECTIONS,
  AU: AU_SECTIONS,
  IN: IN_SECTIONS,
  EU: EU_SECTIONS,
  DE: DE_SECTIONS,
  FR: FR_SECTIONS,
  NG: NG_SECTIONS,
  PH: PH_SECTIONS,
  ZA: ZA_SECTIONS,
  OTHER: OTHER_SECTIONS,
};

const DEFAULT_COUNTRY = 'US';

/** Display order: Identity & credit first, then Protect & avoid scams, then Recover. */
const SECTION_ORDER = ['Identity & credit', 'Protect & avoid scams', 'Recover'];

/**
 * Returns tool sections for the given country code. Falls back to US, then OTHER.
 * Sections are ordered: Identity & credit first, then Protect & avoid scams, then Recover.
 */
export function getToolsForCountry(countryCode: string): ToolSection[] {
  const code = countryCode?.toUpperCase() || DEFAULT_COUNTRY;
  const sections = TOOLS_BY_COUNTRY[code] ?? TOOLS_BY_COUNTRY[DEFAULT_COUNTRY] ?? TOOLS_BY_COUNTRY.OTHER;
  return [...sections].sort((a, b) => {
    const aKey = SECTION_ORDER.findIndex((prefix) => a.heading.startsWith(prefix));
    const bKey = SECTION_ORDER.findIndex((prefix) => b.heading.startsWith(prefix));
    return (aKey === -1 ? 99 : aKey) - (bKey === -1 ? 99 : bKey);
  });
}
