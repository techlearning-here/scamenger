/**
 * US scam types with categories. Based on FTC, IC3, and consumer protection sources (2024–2026).
 * Used by the index topics table and /us/scams/[slug] detail pages.
 */

export interface ScamReport {
  who: string;
  when: string;
  prepare?: string[];
  href: string;
  label: string;
}

export type ScamCategoryId =
  | 'online'
  | 'phone'
  | 'financial'
  | 'impersonation'
  | 'employment'
  | 'housing'
  | 'prizes_charity'
  | 'identity_benefits'
  | 'government'
  | 'emerging';

export interface UsScamType {
  slug: string;
  name: string;
  category: ScamCategoryId;
  /** Short scenario that illustrates how this scam typically plays out (modus operandi). */
  story: string;
  intro: string;
  steps: string[];
  reports: ScamReport[];
}

/** Human-readable category labels for display */
export const SCAM_CATEGORY_LABELS: Record<ScamCategoryId, string> = {
  online: 'Online & communication',
  phone: 'Phone & mail',
  financial: 'Financial & banking',
  impersonation: 'Impersonation',
  employment: 'Employment & opportunity',
  housing: 'Housing & rental',
  prizes_charity: 'Prizes & charity',
  identity_benefits: 'Identity & benefits',
  government: 'Government & oversight',
  emerging: 'Emerging & other',
};

const US_SCAMS: UsScamType[] = [
  // —— Online & communication ——
  {
    slug: 'phishing',
    name: 'Phishing & email scams',
    category: 'online',
    story: 'Maria gets an email that looks like it’s from her bank: “Your account will be locked in 24 hours. Click here to verify.” She clicks, enters her password on a site that looks real, and within hours her account is drained. The link didn’t go to her bank—it went to a copycat site run by scammers.',
    intro: 'Phishing is when someone uses fake emails, texts, or websites to steal your passwords, account details, or money. Report it so authorities can track and act on it.',
    steps: [
      'Stop clicking links or replying. Do not enter passwords or pay anything.',
      'Save the email or message (screenshot, forward, or note the sender and date).',
      'Report using the links below. If you clicked a link or shared info, change passwords and alert your bank.',
    ],
    reports: [
      { who: 'The FTC collects scam reports and shares with law enforcement.', when: 'Use for phishing attempts, fake login pages, or requests for money or personal info.', prepare: ['The email or message', 'Sender address or phone', 'Dates'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles internet crime including phishing.', when: 'Use when the scam was online (email, website, or app).', prepare: ['URLs', 'Screenshots', 'What was lost or exposed'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'smishing',
    name: 'Smishing (text message scams)',
    category: 'online',
    story: 'James receives a text: “USPS: Your package is held. Pay $2.99 to release—[link].” He clicks, enters his card to “pay the fee,” and never sees a package. The text wasn’t from USPS; scammers use fake delivery messages to steal card numbers and personal details.',
    intro: 'Smishing uses fake text messages to steal personal or financial information or trick you into clicking malicious links. Report texts that pretend to be your bank, a delivery, or a prize.',
    steps: [
      'Do not click links or reply. Do not give codes, passwords, or payment info.',
      'Save the message (screenshot) and the number it came from.',
      'Report to the FTC and, if it involved a fake link or loss, to IC3.',
    ],
    reports: [
      { who: 'The FTC collects reports of text and phone scams.', when: 'Use for fraudulent or deceptive text messages.', prepare: ['Screenshot of message', 'Phone number', 'Date'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles internet crime.', when: 'Use when you lost money or shared sensitive info via a link in a text.', prepare: ['Message', 'URL if you have it', 'What happened'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'fake-shopping',
    name: 'Fake shopping & online retail scams',
    category: 'online',
    story: 'Sarah finds a popular toy on a new website at half the normal price. She pays with her card; weeks go by and nothing arrives. When she tries to contact the “seller,” the site is gone. The site was a front—scammers take payment and never ship, or send junk.',
    intro: 'Fake shopping sites or sellers take your money and never send the product, or send something worthless. Reporting helps others and can support investigations.',
    steps: [
      'Stop any further payments. Do not send more money or gift cards.',
      'Keep order details, payment method, and any messages or ads.',
      'Report to the FTC and, if the site was online, to IC3.',
    ],
    reports: [
      { who: 'The FTC tracks consumer fraud and fake businesses.', when: 'Use when you paid for something you did not receive or was not as described.', prepare: ['Order details', 'Amount paid', 'Seller name or site', 'Screenshots'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles internet-related fraud.', when: 'Use when the purchase was made online.', prepare: ['Website URL', 'Dates and amount', 'Any messages'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'tech-support',
    name: 'Tech support scams',
    category: 'online',
    story: 'A pop-up fills David’s screen: “Your PC is infected. Call this number now for Microsoft support.” He calls; a “technician” says he must pay $299 for a fix and gets remote access to the computer. There was no virus—the pop-up and the “tech” were the same scam, designed to steal money and data.',
    intro: 'Scammers pretend to be from Microsoft, Apple, or another tech company and say your computer has a virus. They may ask for remote access or payment for fake repairs. Report them to stop others from falling for it.',
    steps: [
      'Do not give remote access, pay for "repairs," or buy gift cards. Hang up or close the pop-up.',
      'Run a real security scan with your own antivirus if you are worried.',
      'Save any pop-up text, phone number, or email and report to the FTC and IC3.',
    ],
    reports: [
      { who: 'The FTC collects reports of tech support scams.', when: 'Use when someone pretended to be tech support to get money or access.', prepare: ['How they contacted you', 'Company they claimed', 'What they asked for'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The FBI\'s IC3 tracks tech support fraud.', when: 'Use when the scam was online (pop-up, phone, or email).', prepare: ['Screenshots', 'Phone number or URL', 'Amount lost if any'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'business-email-compromise',
    name: 'Business email compromise (BEC)',
    category: 'online',
    story: 'The CFO gets an email that looks like it’s from the CEO: “I need you to wire $50,000 to this account today—confidential deal.” The wire goes out before anyone double-checks. The CEO’s email was spoofed or hacked; the money lands in a scammer’s account and is often gone for good.',
    intro: 'BEC scams use hacked or spoofed business or personal email to trick you into sending wire transfers or sensitive data to fraudsters. Report to the FBI IC3 with full details.',
    steps: [
      'Confirm any payment or data request through a separate, known channel before sending anything.',
      'If you already sent money or data, contact your bank and IT immediately.',
      'Report to IC3 with email headers, transaction details, and recipient information.',
    ],
    reports: [
      { who: 'The FBI\'s IC3 is the primary place to report BEC.', when: 'Use when someone used a compromised or fake email to request funds or data.', prepare: ['Email headers', 'Bank/transfer details', 'Recipient info'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
      { who: 'The FTC also accepts reports of business-related fraud.', when: 'Use to report the scam in addition to IC3.', prepare: ['What happened', 'Amount', 'Emails'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
    ],
  },
  {
    slug: 'extortion',
    name: 'Extortion & blackmail scams',
    category: 'online',
    story: 'Someone emails Mike claiming they have footage of him visiting adult sites and will send it to his contacts unless he pays $1,000 in Bitcoin. He never did what they said—they often use old leaked passwords to scare people. Paying usually leads to more demands, not silence.',
    intro: 'Scammers threaten to expose personal information, photos, or data unless you pay. Do not pay—report to the FBI and FTC. Paying often leads to more demands.',
    steps: [
      'Do not pay. Paying does not guarantee they will stop and can make you a repeat target.',
      'Save all messages, emails, or screenshots. Do not delete evidence.',
      'Report to the FBI IC3 and the FTC. Block the contact.',
    ],
    reports: [
      { who: 'The FBI\'s IC3 handles extortion and blackmail reported online.', when: 'Use when someone threatened to release info or harm you unless you paid.', prepare: ['Messages or emails', 'How they contacted you', 'What they demanded'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
      { who: 'The FTC collects reports of extortion and threats.', when: 'Use to report the scam.', prepare: ['What happened', 'Contact method'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
    ],
  },
  // —— Phone & mail ——
  {
    slug: 'robocalls-phone',
    name: 'Robocalls & phone scams',
    category: 'phone',
    story: 'Linda’s phone shows “Social Security Administration.” A recorded voice says her number is linked to crime and she must press 1 to speak to an agent. She does; the “agent” pressures her to buy gift cards to “clear her name.” The real SSA never calls and never asks for payment by gift card.',
    intro: 'Unwanted or fraudulent calls—robocalls, spoofed numbers, or people pretending to be your bank or the government—can be reported to the FCC and FTC.',
    steps: [
      'Hang up. Do not press numbers or give personal or payment info.',
      'Note the number (or "unknown"), date and time, and what they said.',
      'Report using the links below.',
    ],
    reports: [
      { who: 'The FTC collects reports of scam and unwanted calls.', when: 'Use for fraud attempts or illegal robocalls.', prepare: ['Phone number', 'Date and time', 'What was said'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The FCC handles complaints about robocalls and spoofing.', when: 'Use for unwanted calls or caller ID spoofing.', prepare: ['Your number', 'Number that called', 'Carrier'], href: 'https://consumercomplaints.fcc.gov/hc/en-us', label: 'FCC consumer complaints' },
    ],
  },
  // —— Financial & banking ——
  {
    slug: 'bank-zelle-transfer',
    name: 'Bank, Zelle & transfer scams',
    category: 'financial',
    story: 'A stranger messages Rachel: “I accidentally Zelle’d you $400. Please send it back to this number.” She sends $400. Later she finds the original “payment” was a fake notification or a stolen account—real money went out of her account, and the “refund” went straight to the scammer.',
    intro: 'Scammers trick you into sending money via your bank, Zelle, wire, or other transfers. Act quickly to protect your account and report to the right place.',
    steps: [
      'Contact your bank or payment app immediately to report fraud and protect your account.',
      'Save transaction details, dates, and any messages or phone numbers.',
      'Report to the CFPB and your bank. For theft or fraud, also consider local police and IC3.',
    ],
    reports: [
      { who: 'The CFPB takes complaints about banks and financial services.', when: 'Use for problems with your bank, Zelle, or other transfer services.', prepare: ['Bank or app name', 'Dates and amounts', 'What happened'], href: 'https://www.consumerfinance.gov/complaint/', label: 'Go to CFPB complaint portal' },
      { who: 'The FBI\'s IC3 handles internet-related financial fraud.', when: 'Use when the scam involved an app, website, or online transfer.', prepare: ['How you sent money', 'Recipient details', 'Screenshots'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'investment-crypto',
    name: 'Investment & crypto scams',
    category: 'financial',
    story: 'Tom sees an ad: “Turn $500 into $5,000 in 30 days with our crypto trading bot.” He signs up, deposits money, and the dashboard shows huge gains. When he tries to withdraw, the site demands more “fees” and “taxes.” He never gets his money back—the platform was fake and the gains were fabricated.',
    intro: 'Fake investment offers, crypto schemes, or "too good to be true" returns can lead to serious losses. Report to the SEC, FTC, and IC3.',
    steps: [
      'Stop putting in more money. Do not send additional funds or "fees" to withdraw.',
      'Save everything: platform name, URLs, emails, transaction IDs, and screenshots.',
      'Report to the SEC (investments), FTC, and IC3 (internet crime).',
    ],
    reports: [
      { who: 'The SEC handles investment-related fraud and scams.', when: 'Use when the scam involved stocks, investments, or securities.', prepare: ['Company or platform', 'How you invested', 'Amount lost'], href: 'https://www.sec.gov/oiea/ComplaintPage', label: 'SEC – Submit a tip or complaint' },
      { who: 'The FTC tracks investment and crypto-related scams.', when: 'Use for consumer fraud involving investments or crypto.', prepare: ['What was promised', 'Amount lost', 'Platform or contact'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles internet crime including crypto fraud.', when: 'Use when the scam was online or involved cryptocurrency.', prepare: ['Wallet addresses', 'Platform', 'Transactions'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'pig-butchering',
    name: 'Pig butchering & crypto romance scams',
    category: 'financial',
    story: 'Over weeks, “Alex” meets Lisa on a dating app, chats daily, and gains her trust. Then Alex suggests investing in crypto together on a “private platform.” Lisa deposits thousands; the balance grows. When she wants to withdraw, the site asks for more “tax” and “fees.” Alex and the platform disappear. The relationship was the bait; the fake investment was the slaughter.',
    intro: 'Scammers build a relationship over time (dating app, social media, or messaging) then convince you to "invest" in a fake crypto or trading platform. You cannot withdraw your money. Report to IC3 and the FTC.',
    steps: [
      'Stop sending money. Do not pay "fees" or "taxes" to withdraw—it is part of the scam.',
      'Save everything: chat logs, platform URLs, wallet addresses, transaction hashes.',
      'Report to the FBI IC3 and the FTC. Include wallet addresses and transaction IDs.',
    ],
    reports: [
      { who: 'The FBI\'s IC3 is the main place to report pig butchering and crypto fraud.', when: 'Use when you were lured into a fake investment via a relationship.', prepare: ['Wallet addresses', 'Transaction hashes', 'Platform URL', 'Screenshots'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
      { who: 'The FTC collects reports of romance and investment scams.', when: 'Use to report the scam.', prepare: ['What happened', 'Amount lost', 'How you met them'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
    ],
  },
  {
    slug: 'fake-loans',
    name: 'Fake loan & loan fee scams',
    category: 'financial',
    story: 'Carlos has bad credit and finds a lender that “guarantees” a $10,000 loan. They say he must pay a $500 “insurance fee” first. He pays; they ask for another “processing fee.” He never receives a loan. Legitimate lenders do not charge upfront fees before you get the money.',
    intro: 'Scammers offer loans or credit and demand an upfront "fee," "insurance," or "tax" before you get the money. Legitimate lenders do not ask for payment before you receive the loan.',
    steps: [
      'Do not send money or gift cards. Real lenders do not require upfront fees to "release" a loan.',
      'Save any ads, emails, phone numbers, or messages.',
      'Report to the FTC and, if you lost money, to IC3.',
    ],
    reports: [
      { who: 'The FTC tracks fake loan and advance-fee scams.', when: 'Use when someone promised a loan but asked for money first.', prepare: ['Who contacted you', 'Amount they asked for', 'What they promised'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles internet-related fraud.', when: 'Use when the scam was online and you lost money.', prepare: ['Website or contact', 'Amount lost'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'debt-credit-repair',
    name: 'Debt & credit repair scams',
    category: 'financial',
    story: 'A company promises Elena they can remove accurate negative items from her credit report and boost her score for $799 upfront. She pays; months later nothing has changed. Many such “credit repair” services are illegal—no one can lawfully remove true, accurate information from your report for a fee.',
    intro: 'Scammers promise to fix your credit, settle debt, or remove accurate negative items for an upfront fee. Many of these are illegal and do not deliver. Report to the FTC and CFPB.',
    steps: [
      'Do not pay upfront for credit repair or debt settlement promises. Check the CFPB for legitimate options.',
      'Save any contracts, ads, or communications.',
      'Report to the FTC and CFPB.',
    ],
    reports: [
      { who: 'The FTC takes complaints about deceptive credit repair and debt relief.', when: 'Use when a company charged upfront or made false promises.', prepare: ['Company name', 'What they promised', 'Amount paid'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The CFPB takes complaints about financial products and services.', when: 'Use for problems with debt relief or credit repair companies.', prepare: ['Company', 'What happened'], href: 'https://www.consumerfinance.gov/complaint/', label: 'CFPB complaint portal' },
    ],
  },
  // —— Impersonation ——
  {
    slug: 'irs-tax-impersonation',
    name: 'IRS & tax impersonation scams',
    category: 'impersonation',
    story: 'Robert gets a call: “This is the IRS. You owe back taxes. Pay now with gift cards or you’ll be arrested in an hour.” He buys $2,000 in gift cards and reads the codes over the phone. The IRS never calls demanding immediate payment and never accepts gift cards—the caller was a scammer who used fear to get the codes.',
    intro: 'Scammers pretend to be the IRS or tax authorities to pressure you into paying with gift cards, wire, or crypto. The real IRS does not demand payment that way.',
    steps: [
      'Do not pay or give personal or financial information. Hang up or delete the message.',
      'Save the phone number, email, or any message. Real IRS does not demand immediate payment by phone or gift cards.',
      'Report to the IRS and FTC using the links below.',
    ],
    reports: [
      { who: 'The IRS accepts reports of phishing and impersonation.', when: 'Use when someone claimed to be the IRS to get money or information.', prepare: ['Forward the email or note the phone number', 'What they asked for'], href: 'https://www.irs.gov/privacy-disclosure/report-phishing', label: 'IRS – Report phishing' },
      { who: 'The FTC tracks government imposter scams.', when: 'Use for any caller or message pretending to be the IRS or tax authority.', prepare: ['How they contacted you', 'What they asked for'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
    ],
  },
  {
    slug: 'government-imposter',
    name: 'Government imposter scams',
    category: 'impersonation',
    story: 'A woman claiming to be from “Medicare” calls Patricia and says her new card requires a fee and her bank details to activate. Patricia gives her account number. Real Medicare does not call to “activate” cards or ask for payment or bank details over the phone—scammers impersonate agencies to steal money and identity.',
    intro: 'Someone pretends to be from a government agency (IRS, SSA, Medicare, etc.) to scare you into paying or sharing personal information. Report to stop them and protect others.',
    steps: [
      'Stop contact. Real agencies do not demand immediate payment by gift cards, wire, or crypto.',
      'Do not send money or give Social Security numbers or account details.',
      'Save evidence and report using the links below.',
    ],
    reports: [
      { who: 'The FTC collects reports of government imposter scams.', when: 'Use when someone pretended to be any government agency.', prepare: ['Agency they claimed', 'How they contacted you', 'What they asked for'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles internet-related fraud and impersonation.', when: 'Use when the contact was by email, phone, or online.', prepare: ['Dates', 'Contact method', 'Amount if any'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'romance',
    name: 'Romance scams',
    category: 'impersonation',
    story: 'After months of daily messages, “Kevin” tells Jennifer he’s stuck abroad and needs $3,000 for a flight home. She sends it. Then his “boss” needs a bribe; then there’s a “medical emergency.” She has never met him in person or on a real video call. The person on the other end is a scammer who built a fake relationship to drain her savings.',
    intro: 'Someone builds a relationship online (dating app, social media) then asks for money for emergencies, travel, or "investments." Never send money to someone you have not met in person. Report to the FTC and IC3.',
    steps: [
      'Stop sending money or gift cards. Do not give bank or account access.',
      'Save profile links, usernames, messages, and any payment details.',
      'Report to the FTC and IC3. Block the person.',
    ],
    reports: [
      { who: 'The FTC collects reports of romance scams.', when: 'Use when someone you met online asked for money under false pretenses.', prepare: ['Where you met', 'Username or profile', 'Amount sent', 'How you paid'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles romance and confidence fraud.', when: 'Use when the scam was online and you lost money.', prepare: ['Platform', 'Screenshots', 'Amount lost'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'family-emergency-grandparent',
    name: 'Family emergency & grandparent scams',
    category: 'impersonation',
    story: 'A sobbing voice tells Helen, “Grandma, it’s me—I’m in jail in Mexico and I need bail money right now. Don’t tell Mom.” She wires $5,000. When she calls her grandson’s real number, he’s at home and fine. Scammers target older adults with urgent “family emergency” calls and pressure them to send money before they can verify.',
    intro: 'A caller pretends to be a grandchild or relative in trouble and asks for money urgently—often by wire or gift cards. Verify with family through a known number before sending anything.',
    steps: [
      'Do not send money until you have verified with the real family member (call back on a number you know).',
      'Note the caller\'s number and what they said. Real family will not pressure you to keep it secret.',
      'Report to the FTC and your local police or IC3 if you lost money.',
    ],
    reports: [
      { who: 'The FTC collects reports of family emergency and grandparent scams.', when: 'Use when someone pretended to be a relative to get money.', prepare: ['What they said', 'Phone number', 'Amount if sent'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles elder fraud and impersonation.', when: 'Use when you lost money in this type of scam.', prepare: ['How they contacted you', 'Amount lost'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'delivery-package-imposter',
    name: 'Delivery & package impersonation scams',
    category: 'impersonation',
    story: 'A text says “FedEx: Delivery failed. Confirm address and pay $3.99 re-delivery fee—[link].” Mark clicks and enters his card. No package was ever coming; the message was a fake. Scammers use the names of USPS, FedEx, and DHL to get people to click links or pay “fees,” then steal card data or install malware.',
    intro: 'Scammers send fake texts or emails claiming to be USPS, FedEx, or DHL and ask you to pay a "fee" or click a link to "reschedule delivery." Report and do not pay or click.',
    steps: [
      'Do not click links or pay "delivery fees." Real carriers do not ask for payment via text link.',
      'Track packages only on the official carrier website.',
      'Save the message and report to the FTC.',
    ],
    reports: [
      { who: 'The FTC collects reports of delivery and package impersonation.', when: 'Use when a fake delivery message asked for money or personal info.', prepare: ['Screenshot of message', 'Sender number or email'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'USPS recommends reporting fake USPS messages to the Postal Inspection Service.', when: 'Use when the scammer claimed to be USPS.', prepare: ['Message', 'Any link'], href: 'https://www.uspis.gov/report', label: 'USPS – Report fraud' },
    ],
  },
  // —— Employment & opportunity ——
  {
    slug: 'job-employment',
    name: 'Job & employment scams',
    category: 'employment',
    story: 'Nina is hired for a “remote data entry” job. The “employer” sends a check to buy equipment and asks her to wire the difference to a “vendor.” She does; the check bounces. She’s out the wired amount and her bank may hold her liable. Real employers do not send you a check and ask you to send part of it elsewhere—that’s a classic fake-check scam.',
    intro: 'Fake job postings or "employers" ask for money for training, equipment, or "taxes," or steal your personal information. Legitimate employers do not ask you to pay to get the job.',
    steps: [
      'Do not pay for "training," "equipment," or "fees" to start a job. Do not send personal documents unless you have verified the employer.',
      'Research the company and contact them through official channels (not the email in the ad).',
      'Report to the FTC and, if you lost money, to IC3.',
    ],
    reports: [
      { who: 'The FTC tracks job and employment scams.', when: 'Use when a "employer" asked for money or stole your info.', prepare: ['Job posting or contact', 'What they asked for', 'Amount lost if any'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles internet-related job fraud.', when: 'Use when the scam was online and you lost money or identity.', prepare: ['Website or email', 'What happened'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  // —— Housing & rental ——
  {
    slug: 'rental-housing',
    name: 'Rental & housing scams',
    category: 'housing',
    story: 'Omar finds a great apartment on a listing site, contacts the “owner” by email, and sends first month’s rent and a deposit via wire. When he shows up to get the keys, the real owner has never heard of him—the listing used stolen photos and a fake contact. The scammer keeps the money and disappears.',
    intro: 'Fake rental listings ask for a deposit or rent before you see the property or sign a lease. The "landlord" may be impersonating a real owner. Report to the FTC and local authorities.',
    steps: [
      'Do not pay before you have seen the property in person (or via a verified video) and have a real lease.',
      'Verify the owner or property manager through county records or the building management.',
      'Report to the FTC and your local police or housing authority.',
    ],
    reports: [
      { who: 'The FTC collects reports of rental and housing scams.', when: 'Use when you paid for a rental that did not exist or was misrepresented.', prepare: ['Listing or contact', 'Amount paid', 'Address if any'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles rental fraud conducted online.', when: 'Use when the scam was run online and you lost money.', prepare: ['Website or email', 'Amount lost'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  // —— Prizes & charity ——
  {
    slug: 'prize-sweepstakes-lottery',
    name: 'Prize, sweepstakes & lottery scams',
    category: 'prizes_charity',
    story: 'A letter tells Paul he’s won a foreign lottery and must send $500 in “taxes” and “fees” to receive his millions. He sends the money; more “fees” keep coming. He never receives a prize. Legitimate sweepstakes do not require you to pay to claim winnings—any request for upfront payment is a scam.',
    intro: 'You are told you won a prize or lottery but must pay "fees" or "taxes" to collect. Real prizes do not require you to pay upfront. Report to the FTC.',
    steps: [
      'Do not pay any "fee," "tax," or "shipping" to claim a prize. Legitimate sweepstakes do not work that way.',
      'Save any emails, letters, or phone numbers.',
      'Report to the FTC and, if you lost money, to IC3.',
    ],
    reports: [
      { who: 'The FTC tracks prize and sweepstakes scams.', when: 'Use when someone said you won but asked for money first.', prepare: ['How they contacted you', 'What they said you won', 'Amount they asked for'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles lottery and prize fraud online.', when: 'Use when the scam was online and you lost money.', prepare: ['Emails or website', 'Amount lost'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'charity-donation',
    name: 'Charity & donation scams',
    category: 'prizes_charity',
    story: 'After a disaster, Rita gets a call from a “relief fund” that sounds official. She donates by wire. Later she learns the charity doesn’t exist or the number was a scammer. Her money never reached victims. Fake charities use real tragedies to rush people into giving before they can verify; real charities can be checked at IRS.gov or Charity Navigator.',
    intro: 'Fake charities or disaster relief appeals pressure you to donate. Verify charities at Charity Navigator or the IRS before giving. Report fake charities to the FTC and state AG.',
    steps: [
      'Do not give cash, wire, or gift cards. Verify the charity at IRS.gov or Charity Navigator.',
      'Save the website, email, or phone number used to solicit you.',
      'Report to the FTC and your state Attorney General.',
    ],
    reports: [
      { who: 'The FTC collects reports of charity and donation scams.', when: 'Use when a "charity" was fake or misrepresented.', prepare: ['Name of organization', 'How they contacted you', 'Amount if given'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'Your state Attorney General often handles charity fraud.', when: 'Use to report fake charities in your state.', prepare: ['Charity name', 'What happened'], href: 'https://www.usa.gov/state-attorney-general', label: 'USA.gov – State AGs' },
    ],
  },
  // —— Identity & benefits ——
  {
    slug: 'identity-theft',
    name: 'Identity theft',
    category: 'identity_benefits',
    story: 'When Sandra tries to file her taxes, she’s told someone already filed using her Social Security number and claimed a refund. A thief had used her stolen identity. She discovers new credit cards and accounts she never opened. Identity thieves use leaked or stolen personal data to file taxes, open accounts, or take loans in someone else’s name.',
    intro: 'Someone uses your personal information to open accounts, file taxes, or commit fraud. Report it and take steps to limit damage and restore your identity.',
    steps: [
      'Go to IdentityTheft.gov to get a step-by-step recovery plan and report to the FTC.',
      'Place fraud alerts or freezes with the credit bureaus and close any accounts you did not open.',
      'Report to the FTC and, if applicable, to the IRS or other agencies as directed.',
    ],
    reports: [
      { who: 'The FTC runs IdentityTheft.gov for reporting and recovery.', when: 'Use when someone used your identity to open accounts or commit fraud.', prepare: ['What was used', 'When you noticed', 'Accounts affected'], href: 'https://identitytheft.gov/', label: 'IdentityTheft.gov' },
      { who: 'The FTC ReportFraud also accepts identity theft reports.', when: 'Use to report the scam or fraud that led to identity theft.', prepare: ['What happened', 'Dates', 'Any evidence'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
    ],
  },
  {
    slug: 'student-loan',
    name: 'Student loan scams',
    category: 'identity_benefits',
    story: 'A company calls Derek and promises to lower his federal student loan payments or get forgiveness for a one-time fee of $599. He pays; they do nothing and stop returning calls. The U.S. Department of Education and your servicer do not charge to apply for income-driven plans or forgiveness—anyone who does is running a scam.',
    intro: 'Scammers promise to lower payments, forgive loans, or "consolidate" for a fee. The U.S. Department of Education and your servicer do not charge for applying for relief. Report to the FTC and CFPB.',
    steps: [
      'Do not pay for "loan forgiveness" or "consolidation" services. Use StudentAid.gov and your servicer directly.',
      'Save any ads, emails, or phone numbers from the scammer.',
      'Report to the FTC and CFPB.',
    ],
    reports: [
      { who: 'The FTC tracks student loan and debt relief scams.', when: 'Use when someone charged a fee for loan help or made false promises.', prepare: ['Company name', 'What they promised', 'Amount paid'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The CFPB takes complaints about student loans and servicers.', when: 'Use for problems with your loan or a company that contacted you.', prepare: ['Servicer or company', 'What happened'], href: 'https://www.consumerfinance.gov/complaint/', label: 'CFPB complaint portal' },
    ],
  },
  // —— Government & oversight ——
  {
    slug: 'corruption-waste',
    name: 'Corruption & waste in government',
    category: 'government',
    story: 'A federal employee sees a contractor billing for work that was never done and a manager signing off on it. She wants to report it without retaliation. Fraud, waste, and abuse in federal programs can be reported to Inspector General hotlines and Oversight.gov—there are legal protections for whistleblowers who report in good faith.',
    intro: 'To report fraud, waste, abuse, or retaliation in federal programs, use Oversight.gov and the right Inspector General (OIG) for the agency involved.',
    steps: [
      'Gather what you know: dates, agencies, people involved, and the type of concern.',
      'Use Oversight.gov to find the right place or contact the OIG for that agency.',
      'Submit through the official complaint or hotline; your report goes to the correct oversight body.',
    ],
    reports: [
      { who: 'Oversight.gov explains where to report federal fraud, waste, abuse, or retaliation.', when: 'Use when you are not sure which OIG to contact.', prepare: ['What happened', 'Agency or program', 'Dates'], href: 'https://www.oversight.gov/report-fraud-waste-abuse', label: 'Oversight.gov – Where to report' },
      { who: 'USA.gov helps you complain about a federal or state agency.', when: 'Use for general agency complaints or service issues.', prepare: ['Agency', 'What went wrong'], href: 'https://www.usa.gov/agency-complaints', label: 'USA.gov – Agency complaints' },
    ],
  },
  // —— Emerging & other ——
  {
    slug: 'ai-deepfake-scams',
    name: 'AI & deepfake scams',
    category: 'emerging',
    story: 'Karen gets a call from “her daughter”—the voice is identical, crying, saying she’s been in an accident and needs money for the hospital. Karen wires $8,000. The voice was an AI clone made from a few seconds of her daughter’s social media audio. Scammers now use deepfake voice or video to impersonate family, bosses, or public figures and pressure victims into sending money.',
    intro: 'Scammers use AI-generated voice, video, or images to impersonate someone you know or a public figure to trick you into sending money or information. Verify through a separate channel before acting.',
    steps: [
      'Do not send money or sensitive info based only on a call or video. Contact the person through a known number or account.',
      'Save the message, call recording if legal, or any link. Note what was requested.',
      'Report to the FTC and IC3.',
    ],
    reports: [
      { who: 'The FTC collects reports of impersonation and AI-related scams.', when: 'Use when AI or deepfake was used to impersonate someone.', prepare: ['How you were contacted', 'What they asked for', 'Any recording or link'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The FBI\'s IC3 tracks emerging tech fraud.', when: 'Use when you lost money or shared sensitive info.', prepare: ['What happened', 'Contact method'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'elder-fraud-resources',
    name: 'Elder fraud (60+) – resources',
    category: 'emerging',
    story: 'Frank, 72, has been getting daily calls from “his bank” about a “suspicious transaction.” They’ve convinced him to move his savings to a “secure account” and have already taken $30,000. Elder fraud often combines tech-support, government-imposter, or romance schemes with repeated contact to build trust and isolate the victim. Reporting and getting support early can limit losses and protect others.',
    intro: 'Older adults are often targeted by tech support, government impersonation, romance, and investment scams. Report to the FTC and IC3, and contact the National Elder Fraud Hotline for support.',
    steps: [
      'If you or someone you know is 60+ and was targeted, report to the FTC and IC3 with as much detail as possible.',
      'Contact the National Elder Fraud Hotline for reporting help and resources.',
      'Consider a fraud alert or credit freeze if financial info was shared.',
    ],
    reports: [
      { who: 'The National Elder Fraud Hotline helps report and get resources.', when: 'Use when you or a senior you know was targeted by fraud.', prepare: ['What happened', 'When', 'Who contacted them'], href: 'https://www.justice.gov/elderjustice/national-elder-fraud-hotline', label: 'National Elder Fraud Hotline' },
      { who: 'The FTC collects elder fraud reports.', when: 'Use to report the scam.', prepare: ['What happened', 'Amount lost if any'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'The FBI\'s IC3 has an elder fraud focus.', when: 'Use when the scam was online and the victim is 60+.', prepare: ['Details of the scam', 'Losses'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
];

export function getUsScamTypes(): UsScamType[] {
  return US_SCAMS;
}

export function getUsScamBySlug(slug: string): UsScamType | undefined {
  return US_SCAMS.find((s) => s.slug === slug);
}

export function getUsScamSlugs(): string[] {
  return US_SCAMS.map((s) => s.slug);
}

export function getUsScamCategories(): ScamCategoryId[] {
  const seen = new Set<ScamCategoryId>();
  return US_SCAMS.map((s) => s.category).filter((c) => {
    if (seen.has(c)) return false;
    seen.add(c);
    return true;
  });
}
