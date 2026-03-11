/**
 * Country-specific emotional support and scam victim support resources.
 * Key = country code (ISO 3166-1 alpha-2). Use "US" as fallback when country is unknown.
 */

export interface SupportLink {
  label: string;
  href: string;
  description: string;
  external: boolean;
}

export interface SupportSection {
  heading: string;
  intro: string;
  links: SupportLink[];
}

type SupportSectionsByCountry = Record<string, SupportSection[]>;

const US_SECTIONS: SupportSection[] = [
  {
    heading: 'Mental health & crisis support',
    intro: 'If you\'re in distress after a scam or for any reason, these services offer confidential support.',
    links: [
      { label: '988 Suicide & Crisis Lifeline', href: 'https://988lifeline.org/', description: 'Call or text 988. 24/7 free, confidential support for people in distress or crisis.', external: true },
      { label: 'Crisis Text Line', href: 'https://www.crisistextline.org/', description: 'Text HOME to 741741. 24/7 free crisis support by text.', external: true },
      { label: 'SAMHSA National Helpline', href: 'https://www.samhsa.gov/find-help/national-helpline', description: '1-800-662-4357. Free, confidential treatment referral and information (US).', external: true },
    ],
  },
  {
    heading: 'Scam & fraud victim support',
    intro: 'Organizations that help scam victims with recovery, reporting, and emotional support.',
    links: [
      { label: 'AARP Fraud Watch Network', href: 'https://www.aarp.org/money/scams-fraud/fraud-watch-network/', description: 'Resources, helpline, and community for fraud victims. Free for everyone.', external: true },
      { label: 'Identity Theft Resource Center (ITRC)', href: 'https://www.idtheftcenter.org/', description: 'Free assistance for identity theft and fraud victims. Call 888-400-5530.', external: true },
      { label: 'Victim Connect Resource Center', href: 'https://victimconnect.org/', description: 'Referrals and support for crime victims. Call or text 1-855-4VICTIM.', external: true },
      { label: 'National Center for Victims of Crime', href: 'https://victimsofcrime.org/', description: 'Information and referrals for crime victims.', external: true },
      { label: 'Scam Survivors', href: 'https://www.scamsurvivors.com/', description: 'Peer support and recovery resources for scam victims.', external: true },
      { label: 'FTC – Recovering from identity theft', href: 'https://www.identitytheft.gov/', description: 'Step-by-step recovery plan and reporting.', external: true },
    ],
  },
];

const GB_SECTIONS: SupportSection[] = [
  {
    heading: 'Mental health & crisis support',
    intro: 'If you\'re in distress after a scam or for any reason, these services offer confidential support.',
    links: [
      { label: 'Samaritans', href: 'https://www.samaritans.org/', description: 'Call 116 123. 24/7 free, confidential emotional support (UK & Ireland).', external: true },
      { label: 'Crisis Text Line UK', href: 'https://www.crisistextline.org/', description: 'Text SHOUT to 85258. 24/7 free crisis support by text.', external: true },
      { label: 'Mind', href: 'https://www.mind.org.uk/', description: 'Information and support for mental health. Infoline 0300 123 3393.', external: true },
    ],
  },
  {
    heading: 'Scam & fraud victim support',
    intro: 'Organizations that help scam victims with recovery and emotional support.',
    links: [
      { label: 'Victim Support', href: 'https://www.victimsupport.org.uk/', description: 'Free, confidential support for victims of crime in England and Wales.', external: true },
      { label: 'Citizens Advice – Scams', href: 'https://www.citizensadvice.org.uk/consumer/scams/', description: 'Advice and support if you\'ve been scammed.', external: true },
      { label: 'Scam Survivors', href: 'https://www.scamsurvivors.com/', description: 'Peer support and recovery resources for scam victims.', external: true },
    ],
  },
];

const CA_SECTIONS: SupportSection[] = [
  {
    heading: 'Mental health & crisis support',
    intro: 'If you\'re in distress after a scam or for any reason, these services offer confidential support.',
    links: [
      { label: 'Crisis Services Canada', href: 'https://www.crisisservicescanada.ca/', description: 'Call or text 988. 24/7 crisis support across Canada.', external: true },
      { label: 'Crisis Text Line', href: 'https://www.crisistextline.org/', description: 'Text HOME to 741741. 24/7 free crisis support by text.', external: true },
    ],
  },
  {
    heading: 'Scam & fraud victim support',
    intro: 'Organizations that help scam victims with recovery and support.',
    links: [
      { label: 'Canadian Anti-Fraud Centre', href: 'https://www.antifraudcentre-centreantifraude.ca/index-eng.htm', description: 'Report fraud and get support. 1-888-495-8501.', external: true },
      { label: 'Scam Survivors', href: 'https://www.scamsurvivors.com/', description: 'Peer support and recovery resources for scam victims.', external: true },
    ],
  },
];

const AU_SECTIONS: SupportSection[] = [
  {
    heading: 'Mental health & crisis support',
    intro: 'If you\'re in distress after a scam or for any reason, these services offer confidential support.',
    links: [
      { label: 'Lifeline', href: 'https://www.lifeline.org.au/', description: 'Call 13 11 14. 24/7 crisis support and suicide prevention.', external: true },
      { label: 'Beyond Blue', href: 'https://www.beyondblue.org.au/', description: 'Call 1300 22 4636. Information and support for anxiety, depression, and mental health.', external: true },
      { label: 'MensLine Australia', href: 'https://mensline.org.au/', description: 'Call 1300 78 99 78. 24/7 support for men.', external: true },
    ],
  },
  {
    heading: 'Scam & fraud victim support',
    intro: 'Organizations that help scam victims with recovery and support.',
    links: [
      { label: 'IDCARE', href: 'https://www.idcare.org/', description: 'Free support for identity theft and cyber issues in Australia and New Zealand.', external: true },
      { label: 'Scamwatch – Get help', href: 'https://www.scamwatch.gov.au/get-help', description: 'Resources if you\'ve been scammed (ACCC).', external: true },
      { label: 'Scam Survivors', href: 'https://www.scamsurvivors.com/', description: 'Peer support and recovery resources for scam victims.', external: true },
    ],
  },
];

const DE_SECTIONS: SupportSection[] = [
  {
    heading: 'Mental health & crisis support',
    intro: 'If you\'re in distress after a scam or for any reason, these services offer confidential support.',
    links: [
      { label: 'Telefonseelsorge', href: 'https://www.telefonseelsorge.de/', description: 'Call 0800 111 0 111 or 0800 111 0 222. 24/7 free, anonymous support (Germany).', external: true },
      { label: 'Nummer gegen Kummer', href: 'https://www.nummergegenkummer.de/', description: 'Children and youth helpline; adult line 0800 111 0 550.', external: true },
    ],
  },
  {
    heading: 'Scam & fraud victim support',
    intro: 'Organizations that help scam victims.',
    links: [
      { label: 'Verbraucherzentrale', href: 'https://www.verbraucherzentrale.de/', description: 'Consumer advice and support (in German).', external: true },
      { label: 'Scam Survivors', href: 'https://www.scamsurvivors.com/', description: 'Peer support and recovery resources for scam victims.', external: true },
    ],
  },
];

const FR_SECTIONS: SupportSection[] = [
  {
    heading: 'Mental health & crisis support',
    intro: 'If you\'re in distress after a scam or for any reason, these services offer confidential support.',
    links: [
      { label: 'SOS Amitié', href: 'https://www.sos-amitie.org/', description: 'Call 09 72 39 40 50. 24/7 emotional support (France).', external: true },
      { label: 'Fil Santé Jeunes', href: 'https://www.filsantejeunes.com/', description: 'Call 0 800 235 236. Health and mental health support for young people.', external: true },
    ],
  },
  {
    heading: 'Scam & fraud victim support',
    intro: 'Organizations that help scam victims.',
    links: [
      { label: 'Service-Public – Arnaques', href: 'https://www.service-public.fr/particuliers/vosdroits/F34508', description: 'Official information on reporting scams (in French).', external: true },
      { label: 'Scam Survivors', href: 'https://www.scamsurvivors.com/', description: 'Peer support and recovery resources for scam victims.', external: true },
    ],
  },
];

const IN_SECTIONS: SupportSection[] = [
  {
    heading: 'Mental health & crisis support',
    intro: 'If you\'re in distress after a scam or for any reason, these services offer confidential support.',
    links: [
      { label: 'Vandrevala Foundation', href: 'https://www.vandrevalafoundation.com/', description: '24/7 free mental health helpline. Call 1860 2662 345 or 1800 2333 330.', external: true },
      { label: 'iCall', href: 'https://icall.org.in/', description: 'Psychosocial helpline (Mon–Sat).', external: true },
    ],
  },
  {
    heading: 'Scam & fraud victim support',
    intro: 'Organizations that help scam victims.',
    links: [
      { label: 'National Cyber Crime Portal', href: 'https://cybercrime.gov.in/', description: 'Report cyber crime and get guidance (Government of India).', external: true },
      { label: 'Scam Survivors', href: 'https://www.scamsurvivors.com/', description: 'Peer support and recovery resources for scam victims.', external: true },
    ],
  },
];

const ZA_SECTIONS: SupportSection[] = [
  {
    heading: 'Mental health & crisis support',
    intro: 'If you\'re in distress after a scam or for any reason, these services offer confidential support.',
    links: [
      { label: 'SADAG (South African Depression and Anxiety Group)', href: 'https://www.sadag.org/', description: 'Suicide Crisis Helpline 0800 567 567; Cipla Mental Health 0800 456 789; 24/7 toll-free helplines.', external: true },
      { label: 'Lifeline South Africa', href: 'https://lifeline.co.za/', description: 'Call 0861 322 322. 24/7 free, confidential counselling and crisis support.', external: true },
      { label: 'Department of Social Development Substance Abuse Helpline', href: 'https://www.sadag.org/', description: '0800 12 13 14. 24-hour substance abuse and mental health support.', external: true },
    ],
  },
  {
    heading: 'Scam & fraud victim support',
    intro: 'Organizations that help scam victims with reporting and support in South Africa.',
    links: [
      { label: 'South African Fraud Prevention Service (SAFPS)', href: 'https://www.safps.org.za/', description: 'Report fraud, apply for protective registration. 011 867 2234, safps@safps.org.za.', external: true },
      { label: 'National Consumer Commission', href: 'https://www.thedtic.gov.za/consumer-affairs/', description: 'Consumer protection and dispute resolution (South Africa).', external: true },
      { label: 'SAPS – Report fraud', href: 'https://www.saps.gov.za/', description: 'Report to your nearest police station or use SAPS channels for fraud and cyber crime.', external: true },
      { label: 'Scam Survivors', href: 'https://www.scamsurvivors.com/', description: 'Peer support and recovery resources for scam victims.', external: true },
    ],
  },
];

const PH_SECTIONS: SupportSection[] = [
  {
    heading: 'Mental health & crisis support',
    intro: 'If you\'re in distress after a scam or for any reason, these services offer confidential support.',
    links: [
      { label: 'NCMH Crisis Hotline', href: 'https://ncmh.gov.ph/', description: '24/7 free crisis hotline. Call 1800-1888-1553, 0917-899-8727 (Globe), or 0919-057-1553 (Smart).', external: true },
      { label: 'National Center for Mental Health', href: 'https://ncmh.gov.ph/', description: 'Mental health support, suicide prevention, and referrals nationwide.', external: true },
    ],
  },
  {
    heading: 'Scam & fraud victim support',
    intro: 'Organizations that help scam victims with reporting and support in the Philippines.',
    links: [
      { label: 'BSP Consumer Affairs', href: 'https://www.bsp.gov.ph/', description: 'Financial scams, e-wallets (GCash, Maya). (02) 8708-7087, consumeraffairs@bsp.gov.ph.', external: true },
      { label: 'SEC – Report investment scams', href: 'https://www.sec.gov.ph/scam-report/', description: 'Investment scams and Ponzi schemes. Report online or call 8818-6337.', external: true },
      { label: 'PNP Anti-Cybercrime Group', href: 'https://cyberresponse.ph/', description: 'Report online scams. (02) 8723-0401, 0919-160-1754, or cyberresponse.ph.', external: true },
      { label: 'NBI Cybercrime Division', href: 'https://nbi.gov.ph/cybercrime-complaint/', description: 'Complex or high-value cybercrime. (02) 8521-9208 or file online.', external: true },
      { label: 'Scam Survivors', href: 'https://www.scamsurvivors.com/', description: 'Peer support and recovery resources for scam victims.', external: true },
    ],
  },
];

const NG_SECTIONS: SupportSection[] = [
  {
    heading: 'Mental health & crisis support',
    intro: 'If you\'re in distress after a scam or for any reason, these services offer confidential support.',
    links: [
      { label: 'SURPIN Helpline', href: 'https://www.surpinng.com/', description: '24/7 suicide prevention and crisis support. Call 08000787746 (toll-free), 09034400009, 09080217555.', external: true },
      { label: 'Lagos State Suicide Hotlines', href: 'https://www.nigerianmentalhealth.org/helplines', description: '24/7 support: 08058820777, 09030000741.', external: true },
      { label: 'NDLEA Call Centre', href: 'https://ndlea.gov.ng/', description: 'Substance abuse support. 0800 1020 3040 (toll-free, 24/7, multiple languages).', external: true },
    ],
  },
  {
    heading: 'Scam & fraud victim support',
    intro: 'Organizations that help scam victims with reporting and support in Nigeria.',
    links: [
      { label: 'EFCC (Economic and Financial Crimes Commission)', href: 'https://www.efcc.gov.ng/', description: 'Report fraud and financial crime. 0809 932 9999, 0803 940 0000, info@efcc.gov.ng.', external: true },
      { label: 'Scamwatch Nigeria', href: 'https://www.scamwatch.ng/', description: 'Report scams and get guidance. info@scamwatch.ng or online form.', external: true },
      { label: 'Scam Survivors', href: 'https://www.scamsurvivors.com/', description: 'Peer support and recovery resources for scam victims.', external: true },
    ],
  },
];

const OTHER_SECTIONS: SupportSection[] = [
  {
    heading: 'Mental health & crisis support',
    intro: 'If you\'re in distress after a scam or for any reason, these services offer confidential support. Some serve multiple countries.',
    links: [
      { label: 'Crisis Text Line', href: 'https://www.crisistextline.org/', description: 'Text HOME to 741741. 24/7 crisis support (US, Canada, UK, Ireland).', external: true },
      { label: 'International Association for Suicide Prevention', href: 'https://www.iasp.info/resources/Crisis_Centres/', description: 'Directory of crisis centres worldwide.', external: true },
      { label: '988 Suicide & Crisis Lifeline (US)', href: 'https://988lifeline.org/', description: 'Call or text 988 (US). 24/7 free support.', external: true },
      { label: 'Samaritans (UK & Ireland)', href: 'https://www.samaritans.org/', description: 'Call 116 123 (UK/Ireland). 24/7 free support.', external: true },
    ],
  },
  {
    heading: 'Scam & fraud victim support',
    intro: 'Organizations that help scam victims with recovery and emotional support.',
    links: [
      { label: 'Scam Survivors', href: 'https://www.scamsurvivors.com/', description: 'Peer support and recovery resources for scam victims (international).', external: true },
      { label: 'Report a scam to Scam Avenger', href: '/report/', description: 'Share your experience and get a shareable report link.', external: false },
    ],
  },
];

const SUPPORT_SECTIONS_BY_COUNTRY: SupportSectionsByCountry = {
  US: US_SECTIONS,
  GB: GB_SECTIONS,
  CA: CA_SECTIONS,
  AU: AU_SECTIONS,
  DE: DE_SECTIONS,
  FR: FR_SECTIONS,
  IN: IN_SECTIONS,
  ZA: ZA_SECTIONS,
  PH: PH_SECTIONS,
  NG: NG_SECTIONS,
  OTHER: OTHER_SECTIONS,
};

const DEFAULT_COUNTRY = 'US';

/**
 * Returns emotional support sections (mental health + victim support) for the given country code.
 * Falls back to US, then OTHER.
 */
export function getSupportSectionsForCountry(countryCode: string): SupportSection[] {
  const code = countryCode?.toUpperCase() || DEFAULT_COUNTRY;
  return SUPPORT_SECTIONS_BY_COUNTRY[code] ?? SUPPORT_SECTIONS_BY_COUNTRY[DEFAULT_COUNTRY] ?? SUPPORT_SECTIONS_BY_COUNTRY.OTHER;
}
