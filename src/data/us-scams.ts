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
  /** Optional tips for how to spot this scam (red flags). */
  spotIt?: string[];
  /** Optional do's: positive actions to take. */
  dos?: string[];
  /** Optional don'ts: things to avoid. */
  donts?: string[];
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
    story: 'Maria gets an email that looks like it’s from her bank: “Your account will be locked in 24 hours. Click here to verify.” She clicks, enters her password on a site that looks real, and within hours her account is drained. The link didn’t go to her bank—it went to a copycat site run by scammers. She had entered her password and the code from her phone on a page that looked exactly like her bank; within hours her checking account was emptied and her card was used in another state. By the time she reached her real bank, the money was already gone.',
    intro: 'Phishing is when someone uses fake emails, texts, or websites to steal your passwords, account details, or money. Report it so authorities can track and act on it.',
    spotIt: ['Urgent warnings that your account will be locked or closed unless you act now.', 'Links or buttons in the email that look like your bank but the URL is slightly wrong (e.g. myb4nk.com).', 'Requests for your password, PIN, or one-time codes by email or phone.'],
    dos: ['Save the email or message (screenshot or forward) and note the sender and date.', 'Report to the FTC and IC3 using the links below.', 'Change passwords and alert your bank if you clicked a link or shared any info.'],
    donts: ['Click links or reply to the message.', 'Enter your password, PIN, or one-time codes.', 'Pay or send money.'],
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
    story: 'James receives a text: “USPS: Your package is held. Pay $2.99 to release—[link].” He clicks, enters his card to “pay the fee,” and never sees a package. The text wasn’t from USPS. When James checked his statement later, he saw not just the fee but hundreds of dollars in charges he never made. Scammers send millions of these fake delivery messages every day; the fee page was a front to steal his information.',
    intro: 'Smishing uses fake text messages to steal personal or financial information or trick you into clicking malicious links. Report texts that pretend to be your bank, a delivery, or a prize.',
    dos: ['Save the message (screenshot) and the number it came from.', 'Report to the FTC and, if you clicked a link or lost money, to IC3.'],
    donts: ['Click links or reply to the text.', 'Give codes, passwords, or payment info.'],
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
    story: 'Sarah finds a popular toy on a new website at half the normal price. She pays with her card; weeks go by and nothing arrives. When she tries to contact the “seller,” the site is gone. The site was a front—scammers take payment and never ship, or send junk. Sarah had thought she beat the rush; she never saw the toy or her money again. Other common forms: counterfeit goods sold as brand-name, social media shop scams (Instagram/Facebook ads), fake ticket sales (concerts, sports), bait-and-switch (very low quality vs. the ad), or overpayment check scams where a "buyer" sends extra and asks you to refund the difference.',
    intro: 'Fake shopping sites or sellers take your money and never send the product, send counterfeits, or use bait-and-switch. This includes fake stores, social media shops, fake tickets, and overpayment schemes. Reporting helps others and can support investigations.',
    spotIt: ['Stores or sellers that only exist on social media with no verifiable business.', 'Deals that are far below normal price or "today only" pressure.', 'A "buyer" who overpays by check and asks you to wire or send the difference back.'],
    dos: ['Keep order details, payment method, and any messages or ads.', 'Report to the FTC and, if the site was online, to IC3.', 'Dispute unauthorized charges with your bank or card issuer.'],
    donts: ['Send more money or gift cards to "release" an order or get a refund.', 'Wire or send the "difference" back if a buyer overpays by check.'],
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
    story: 'A pop-up fills David’s screen: “Your PC is infected. Call this number now for Microsoft support.” He calls; a “technician” says he must pay $299 for a fix and gets remote access to the computer. There was no virus—the pop-up and the “tech” were the same scam, designed to steal money and data. David had been browsing when the pop-up appeared; his heart raced at the idea of losing his photos and documents. He called and gave remote access. Only after handing over hundreds of dollars in gift cards did he realize the pop-up and the person on the phone were part of the same scheme—there was no virus, only theft.',
    intro: 'Scammers pretend to be from Microsoft, Apple, or another tech company and say your computer has a virus. They may ask for remote access or payment for fake repairs. Report them to stop others from falling for it.',
    dos: ['Close the pop-up or hang up without giving any information.', 'Run a real security scan with your own antivirus if you are worried.', 'Save any pop-up text, phone number, or email and report to the FTC and IC3.'],
    donts: ['Give remote access to your computer.', 'Pay for "repairs" or buy gift cards for tech support.', 'Call numbers shown in unexpected pop-ups.'],
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
    story: 'The CFO gets an email that looks like it’s from the CEO: “I need you to wire $50,000 to this account today—confidential deal.” The wire goes out before anyone double-checks. The CEO’s email was spoofed or hacked; the money has already landed in an account controlled by scammers, often overseas. By the time the bank is contacted, the funds are moved again. Business email compromise exploits trust and urgency; recovery is rare.',
    intro: 'BEC scams use hacked or spoofed business or personal email to trick you into sending wire transfers or sensitive data to fraudsters. Report to the FBI IC3 with full details.',
    dos: ['Confirm any payment or data request through a separate, known channel (e.g. call the real person) before sending anything.', 'If you already sent money or data, contact your bank and IT immediately.', 'Report to IC3 with email headers, transaction details, and recipient information.'],
    donts: ['Send wire transfers or sensitive data based only on an email.', 'Assume an email address or display name is genuine.', 'Rush a payment because the sender says it is urgent.'],
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
    story: 'Mike opens his email and freezes. A stranger claims to have footage of him visiting adult sites and says they will send it to his family, friends, and colleagues unless he pays $1,000 in Bitcoin within 48 hours. They have included an old password he used years ago, which makes the threat feel real. Mike has never done what they describe—scammers often use leaked passwords from old data breaches just to create fear. He is tempted to pay to make it go away. But people who pay usually get more demands, not silence. The scammer has no real leverage; they are counting on shame and panic to get money. The right move is not to pay and to report it.',
    dos: ['Save all messages, emails, or screenshots; do not delete evidence.', 'Report to the FBI IC3 and the FTC.', 'Block the contact.'],
    donts: ['Pay. Paying does not guarantee they will stop and can make you a repeat target.', 'Reply or engage with the scammer.', 'Assume they actually have compromising material.'],
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
  {
    slug: 'free-trial-recurring-billing',
    name: 'Free trial & recurring billing scam',
    category: 'online',
    story: 'You sign up for a "free trial" with just your card "for verification." Soon you notice a charge every month. When you try to cancel, the link is buried, the form never submits, or a rep keeps putting you on hold. Some sites hide the terms in tiny print or make unsubscribing nearly impossible. What started as a trial has turned into a recurring charge you never clearly agreed to—and the company is counting on you giving up before you get it stopped.',
    dos: ['Read the terms and cancellation policy before signing up.', 'Cancel through the service and keep proof (screenshots, emails).', 'Dispute unauthorized charges with your bank or card issuer and report to the FTC.'],
    donts: ['Give your card "just for verification" without checking how to cancel.', 'Assume you can cancel easily; many trials auto-renew.', 'Ignore small recurring charges; they add up.'],
    intro: 'Scammers offer free trials but charge your card repeatedly or make cancellation difficult. Check terms before signing up and report unauthorized or deceptive charges.',
    steps: [
      'Cancel through the service if possible and dispute unauthorized charges with your bank or card issuer.',
      'Keep emails, receipts, and screenshots of sign-up and cancellation attempts.',
      'Report to the FTC and your state AG if the company will not stop charging or is deceptive.',
    ],
    reports: [
      { who: 'The FTC tracks free trial and subscription scams.', when: 'Use when you were charged without clear consent or could not cancel.', prepare: ['Company name', 'Dates and amounts', 'What you tried'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'Your state Attorney General may handle deceptive billing complaints.', when: 'Use to report in your state.', prepare: ['Company', 'What happened'], href: 'https://www.usa.gov/state-attorney-general', label: 'USA.gov – State AGs' },
    ],
  },
  // —— Phone & mail ——
  {
    slug: 'robocalls-phone',
    name: 'Robocalls & phone scams',
    category: 'phone',
    story: 'Linda’s phone shows “Social Security Administration.” A recorded voice says her number is linked to crime and she must press 1 to speak to an agent. She does; the “agent” pressures her to buy gift cards to “clear her name.” The real SSA never calls and never asks for payment by gift card. By the time she realizes it was a scam, the codes are already used and the money is gone.',
    intro: 'Unwanted or fraudulent calls—robocalls, spoofed numbers, or people pretending to be your bank or the government—can be reported to the FCC and FTC.',
    dos: ['Hang up without pressing numbers or giving information.', 'Note the number (or "unknown"), date and time, and what they said.', 'Report to the FTC and FCC using the links below.'],
    donts: ['Press numbers to "speak to an agent" or "remove your number."', 'Give personal or payment info, or buy gift cards.', 'Assume caller ID is accurate; numbers can be spoofed.'],
    steps: [
      'Hang up. Do not press numbers or give personal or payment info.',
      'Note the number (or "unknown"), date and time, and what they said.',
      'Report using the links below.',
    ],
    reports: [
      { who: 'The FTC collects reports of scam and unwanted calls.', when: 'Use for fraud attempts or illegal robocalls.', prepare: ['Phone number', 'Date and time', 'What was said'], href: 'https://reportfraud.ftc.gov/', label: 'Go to FTC ReportFraud' },
      { who: 'The FCC handles complaints about robocalls and spoofing.', when: 'Use for unwanted calls or caller ID spoofing.', prepare: ['Your number', 'Number that called', 'Carrier'], href: 'https://www.fcc.gov/complaints', label: 'FCC consumer complaints' },
    ],
  },
  // —— Financial & banking ——
  {
    slug: 'bank-zelle-transfer',
    name: 'Bank, Zelle & transfer scams',
    category: 'financial',
    story: 'A stranger messages Rachel: “I accidentally Zelle’d you $400. Please send it back to this number.” She sends $400. Later she finds the original “payment” was a fake notification or a stolen account—real money went out of her account, and the “refund” went straight to the scammer.',
    intro: 'Scammers trick you into sending money via your bank, Zelle, wire, or other transfers. Act quickly to protect your account and report to the right place.',
    dos: ['Contact your bank or payment app immediately to report fraud.', 'Save transaction details, dates, and any messages or phone numbers.', 'Report to the CFPB and your bank; for theft, also consider local police and IC3.'],
    donts: ['Send money back to someone who claims they paid you by mistake.', 'Trust a screenshot or notification as proof of payment.', 'Give verification codes or account access to anyone.'],
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
    story: 'Tom sees an ad: “Turn $500 into $5,000 in 30 days with our crypto trading bot.” He signs up, deposits money, and the dashboard shows huge gains. When he tries to withdraw, the site demands more “fees” and “taxes.” He never gets his money back—the platform was fake and the gains were fabricated. Scammers run these sites for weeks or months, then shut them down and disappear with everyone\'s deposits.',
    intro: 'Fake investment offers, crypto schemes, or "too good to be true" returns can lead to serious losses. Report to the SEC, FTC, and IC3.',
    dos: ['Stop putting in more money.', 'Save everything: platform name, URLs, emails, transaction IDs, and screenshots.', 'Report to the SEC (investments), FTC, and IC3.'],
    donts: ['Send additional funds or "fees" to withdraw—it is part of the scam.', 'Trust guaranteed or "too good to be true" returns.', 'Invest through platforms you have not verified with the SEC or your state regulator.'],
    steps: [
      'Stop putting in more money. Do not send additional funds or "fees" to withdraw.',
      'Save everything: platform name, URLs, emails, transaction IDs, and screenshots.',
      'Report to the SEC (investments), FTC, and IC3 (internet crime).',
    ],
    reports: [
      { who: 'The SEC handles investment-related fraud and scams.', when: 'Use when the scam involved stocks, investments, or securities.', prepare: ['Company or platform', 'How you invested', 'Amount lost'], href: 'https://www.sec.gov/tcr', label: 'SEC – Submit a tip or complaint' },
      { who: 'The FTC tracks investment and crypto-related scams.', when: 'Use for consumer fraud involving investments or crypto.', prepare: ['What was promised', 'Amount lost', 'Platform or contact'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles internet crime including crypto fraud.', when: 'Use when the scam was online or involved cryptocurrency.', prepare: ['Wallet addresses', 'Platform', 'Transactions'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'pig-butchering',
    name: 'Pig butchering & crypto romance scams',
    category: 'financial',
    story: 'Over weeks, “Alex” meets Lisa on a dating app, chats daily, and gains her trust. Then Alex suggests investing in crypto together on a “private platform.” Lisa deposits thousands; the balance grows. When she wants to withdraw, the site asks for more “tax” and “fees.” Alex and the platform disappear. The relationship was the bait; the fake investment was the slaughter. These "pig butchering" schemes can last months and drain a victim\'s savings before they realize they have never met the person and the platform was never real.',
    intro: 'Scammers build a relationship over time (dating app, social media, or messaging) then convince you to "invest" in a fake crypto or trading platform. You cannot withdraw your money. Report to IC3 and the FTC.',
    dos: ['Stop sending money.', 'Save everything: chat logs, platform URLs, wallet addresses, transaction hashes.', 'Report to the FBI IC3 and the FTC with wallet addresses and transaction IDs.'],
    donts: ['Pay "fees" or "taxes" to withdraw—it is part of the scam.', 'Invest on a platform recommended by someone you only know online.', 'Assume the relationship is real; scammers build trust for weeks or months.'],
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
    slug: 'pump-dump-social-group',
    name: 'Pump-and-dump & fake guru investment groups',
    category: 'financial',
    story: 'A Facebook or Instagram ad invites retail investors to join a “free” WhatsApp or Telegram group for stock or crypto tips. In the group, one person is introduced as a “professor” or financial expert; other members—actually scammers—praise him and share stories of getting rich by following his picks. The “professor” recommends specific stocks or coins. When people buy, the scammers (who already hold the asset) sell into the rally and disappear. The price crashes; victims lose money. Sometimes the group also sends people to a fake trading platform where deposits are stolen. The SEC and CFTC have warned about these messaging-app schemes.',
    intro: 'Scammers use Facebook ads to draw you into WhatsApp or Telegram “investment clubs.” A fake “expert” or “professor” and fake members push stock or crypto picks in a pump-and-dump: they pump the price by getting you to buy, then dump their holdings and leave you with losses. They may also send you to a fake platform that steals your money. Report to the SEC, FTC, and IC3.',
    spotIt: [
      'Ads on Facebook, Instagram, or other social media inviting you to a WhatsApp or Telegram group for “exclusive” stock or crypto tips.',
      'A “professor” or “expert” in the group who is praised by many other members; those members may be fake accounts run by the same scammers.',
      'Pressure to buy a specific stock or coin “before it goes up”; the promoters often already hold it and plan to sell (pump and dump).',
      'Links to a trading platform you have never heard of, or that is not registered with the SEC or CFTC.',
    ],
    dos: ['Verify any trading platform with the SEC or CFTC before investing.', 'Save group links, screenshots, expert names, platform URLs, and transaction details.', 'Report to the SEC, FTC, and IC3 with wallet or broker details if you invested.'],
    donts: ['Invest based on tips from private WhatsApp or Telegram groups.', 'Send more money to unlock or withdraw funds.', 'Trust a professor or expert promoted only inside the group.'],
    steps: [
      'Do not invest based on tips from private WhatsApp or Telegram groups. Verify any platform with the SEC (investments) or CFTC (commodities).',
      'Stop sending money. Save group links, screenshots, “expert” names, platform URLs, and any transaction details.',
      'Report to the SEC (stock/securities fraud), FTC, and IC3 (internet crime). Include wallet addresses or broker details if you invested.',
    ],
    reports: [
      { who: 'The SEC handles stock and securities fraud, including pump-and-dump schemes.', when: 'Use when the scam involved stocks or investment recommendations.', prepare: ['Group or platform name', 'What was recommended', 'Amount lost', 'Screenshots'], href: 'https://www.sec.gov/tcr', label: 'SEC – Submit a tip or complaint' },
      { who: 'The FTC collects reports of investment and consumer fraud.', when: 'Use for any consumer loss from the scheme.', prepare: ['What happened', 'Amount lost', 'Platform or group'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles internet crime including fake platforms and crypto fraud.', when: 'Use when the scam was online or involved a fake website or crypto.', prepare: ['URLs', 'Wallet addresses', 'Chat or group info', 'Amount lost'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'fake-loans',
    name: 'Fake loan & loan fee scams',
    category: 'financial',
    story: 'Carlos has bad credit and finds a lender that “guarantees” a $10,000 loan. They say he must pay a $500 “insurance fee” first. He pays; they ask for another “processing fee.” He never receives a loan. Legitimate lenders do not charge upfront fees before you get the money. Real loans are approved first; you see the terms and the money, then you repay. If they want money before you see a cent, walk away.',
    intro: 'Scammers offer loans or credit and demand an upfront "fee," "insurance," or "tax" before you get the money. Legitimate lenders do not ask for payment before you receive the loan.',
    dos: ['Save any ads, emails, phone numbers, or messages.', 'Report to the FTC and, if you lost money, to IC3.'],
    donts: ['Send money or gift cards; real lenders do not require upfront fees to release a loan.', 'Pay "insurance" or "processing" fees before receiving the loan.'],
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
    slug: 'fake-debt-collector',
    name: 'Fake debt collector & phantom debt',
    category: 'financial',
    story: 'Someone calls insisting you owe a debt you have never heard of and threatens arrest or legal action if you do not pay immediately. They may have a few real details (old account, name) to sound legitimate. Phantom debt is debt you do not actually owe; fake collectors buy old debt or make it up to pressure payments. They often have a few real details—an old account number, your name—so they sound legitimate. Real collectors send written notice and cannot threaten arrest for not paying; if someone does, it is a scam.',
    intro: 'Scammers pose as debt collectors and demand payment for debts you do not owe or that are old, discharged, or fake. Real collectors must send written notice and cannot threaten arrest for not paying.',
    dos: ['Ask for the company name and callback number; verify it independently.', 'Request written validation of the debt (you have rights under the Fair Debt Collection Practices Act).', 'Report to the FTC and CFPB; if you paid, also report to your state AG.'],
    donts: ['Pay or give bank or card details over the phone.', 'Assume the caller is legitimate because they have some of your details.', 'Ignore your rights to request written validation.'],
    steps: [
      'Do not pay or give bank or card details over the phone. Ask for the name of the company and a callback number; verify it independently.',
      'Request written validation of the debt. You have rights under the Fair Debt Collection Practices Act.',
      'Report to the FTC and CFPB. If you paid, also report to your state AG.',
    ],
    reports: [
      { who: 'The FTC takes complaints about debt collection practices.', when: 'Use when a collector threatened you or tried to collect a debt you do not owe.', prepare: ['Collector name and number', 'What they said', 'Debt they claimed'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'The CFPB takes complaints about debt collectors.', when: 'Use for harassment or false debt claims.', prepare: ['Company name', 'What happened'], href: 'https://www.consumerfinance.gov/complaint/', label: 'CFPB complaint portal' },
    ],
  },
  {
    slug: 'debt-credit-repair',
    name: 'Debt & credit repair scams',
    category: 'financial',
    story: 'A company promises Elena they can remove accurate negative items from her credit report and boost her score for $799 upfront. She pays; months later nothing has changed. Many such “credit repair” services are illegal—no one can lawfully remove true, accurate information from your report for a fee. Another common scam is "debt elimination": someone claims a legal loophole or "sovereign" method can make your debt disappear for a fee; it cannot, and you may lose money and still owe the debt.',
    intro: 'Scammers promise to fix your credit, settle debt, remove accurate negative items, or "eliminate" debt with a fake legal loophole—for an upfront fee. Many of these are illegal and do not deliver. Report to the FTC and CFPB.',
    dos: ['Check the CFPB for legitimate options and your rights.', 'Save any contracts, ads, or communications.', 'Report to the FTC and CFPB.'],
    donts: ['Pay upfront for credit repair or debt settlement promises.', 'Believe claims that accurate negative items can be removed for a fee.', 'Use "debt elimination" or "sovereign" schemes that charge for fake loopholes.'],
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
  // —— Insurance (financial) ——
  {
    slug: 'fake-insurance-agent',
    name: 'Fake insurance & insurance agent scams',
    category: 'financial',
    story: 'Maria pays an "agent" for a year of auto insurance. When she has an accident and files a claim, her insurer says they have no record of her policy. The agent had pocketed her premiums and never sent them to a real company—or sold her a fake policy from a phantom insurer. Premium diversion and fake policies are common: scammers pose as agents or use fake company names, collect premiums, and disappear or string victims along until a claim reveals the truth. Real insurers are licensed in your state; you can verify an agent or company with your state insurance department before paying.',
    intro: 'Scammers sell fake insurance policies or pose as agents and keep your premiums without providing real coverage. Verify any agent or company with your state insurance department before buying. Report to your state insurance commissioner and the FTC.',
    spotIt: ['Policies or agents you cannot verify with your state insurance department.', 'Pressure to pay in cash, wire, or gift card only.', 'Unusually low premiums or "too good to be true" coverage.', 'No written policy or documentation from a known insurer.'],
    dos: ['Verify the company and agent with your state insurance department (NAIC or state DOI) before paying.', 'Get a written policy and confirm directly with the insurer that you are covered.', 'Save all payments, correspondence, and policy documents; report to your state insurance commissioner and FTC.'],
    donts: ['Pay premiums to an agent or company you have not verified as licensed.', 'Buy insurance from someone who only accepts cash, wire, or gift cards.', 'Assume a website or card makes them legitimate; check with the state DOI.'],
    steps: [
      'Verify the company and agent with your state insurance department before paying. Use NAIC\'s OFRS or your state DOI.',
      'If you already paid and discover the policy is fake, stop paying and gather all documents and payment records.',
      'Report to your state insurance commissioner (via OFRS or state DOI) and to the FTC.',
    ],
    reports: [
      { who: 'Your state insurance commissioner handles complaints about insurers and agents.', when: 'Use when you bought a fake policy or an agent kept your premiums.', prepare: ['Company or agent name', 'Amount paid', 'Policy or documents'], href: 'https://content.naic.org/state-insurance-departments', label: 'NAIC – State insurance departments' },
      { who: 'NAIC\'s Online Fraud Reporting System (OFRS) accepts insurance fraud reports.', when: 'Use to report fake policies, phantom insurers, or premium diversion.', prepare: ['What happened', 'Agent or company', 'Amount lost'], href: 'https://ofrs.naic.org', label: 'NAIC OFRS – Report insurance fraud' },
      { who: 'The FTC collects reports of consumer fraud including fake insurance.', when: 'Use to report the scam.', prepare: ['What happened', 'Amount paid'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
    ],
  },
  {
    slug: 'health-medicare-insurance-scam',
    name: 'Health & Medicare insurance scams',
    category: 'financial',
    story: 'Someone calls offering "free" Medicare coverage review or a "limited-time" health plan. They ask for your Medicare number, Social Security number, or bank details to "enroll" or "verify" you. Later you find unauthorized charges, fake plans, or identity theft. Legitimate Medicare and marketplace representatives do not cold-call and ask for your Medicare number or payment over the phone. Scammers use enrollment periods and confusion about health insurance to steal personal information and money. Never give your Medicare number or financial details to an unsolicited caller.',
    intro: 'Scammers offer fake health plans, "Medicare" enrollment, or coverage reviews to steal your Medicare number, identity, or payments. Real Medicare and marketplace help is free; never give personal or financial details to an unsolicited caller. Report to your state insurance department, FTC, and HHS OIG.',
    spotIt: ['Unsolicited calls or visits offering "free" Medicare reviews or health plan enrollment.', 'Requests for your Medicare number, SSN, or bank details to "enroll" or "verify."', 'Plans that are not on Healthcare.gov or that are not from a licensed insurer.', 'Pressure to act "before open enrollment ends" or to get a "special" deal.'],
    dos: ['Verify any plan with Healthcare.gov (marketplace) or Medicare.gov before enrolling.', 'Contact Medicare or your state SHIP if you have questions; they do not cold-call.', 'Save the caller\'s number and any materials; report to your state insurance department, FTC, and HHS OIG if Medicare was used.'],
    donts: ['Give your Medicare number, SSN, or bank details to an unsolicited caller.', 'Enroll in a health plan through someone who contacted you first.', 'Pay for "enrollment" or "coverage" that you did not sign up for through official channels.'],
    steps: [
      'Do not give your Medicare number, SSN, or payment info to an unsolicited caller.',
      'Verify any plan at Medicare.gov or Healthcare.gov and contact your state insurance department.',
      'Report to your state insurance commissioner, FTC, and HHS OIG if someone misused Medicare or sold a fake plan.',
    ],
    reports: [
      { who: 'Your state insurance department handles health insurance and agent complaints.', when: 'Use when you were sold a fake health plan or someone misused your info.', prepare: ['Who contacted you', 'What they asked for', 'Amount if paid'], href: 'https://content.naic.org/state-insurance-departments', label: 'NAIC – State insurance departments' },
      { who: 'HHS OIG investigates Medicare and Medicaid fraud.', when: 'Use when someone misused your Medicare/Medicaid number or posed as Medicare.', prepare: ['What happened', 'Dates', 'Any ID or numbers shared'], href: 'https://oig.hhs.gov/fraud/report-fraud/', label: 'HHS OIG – Report fraud' },
      { who: 'The FTC collects reports of health and insurance-related fraud.', when: 'Use to report the scam.', prepare: ['What happened', 'Amount lost if any'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
    ],
  },
  // —— Impersonation ——
  {
    slug: 'irs-tax-impersonation',
    name: 'IRS & tax impersonation scams',
    category: 'impersonation',
    story: 'Robert gets a call: “This is the IRS. You owe back taxes. Pay now with gift cards or you’ll be arrested in an hour.” He buys $2,000 in gift cards and reads the codes over the phone. The IRS never calls demanding immediate payment and never accepts gift cards—the caller was a scammer who used fear to get the codes. Once the codes are read over the phone, the money is gone. Real IRS contacts by mail first and does not threaten arrest in a single call.',
    intro: 'Scammers pretend to be the IRS or tax authorities to pressure you into paying with gift cards, wire, or crypto. The real IRS does not demand payment that way.',
    spotIt: ['Demands for immediate payment by gift card, wire, or cryptocurrency.', 'Threats of arrest, deportation, or license suspension if you don\'t pay right away.', 'The real IRS contacts by mail first and never asks for gift cards or payment over the phone.'],
    dos: ['Save the phone number, email, or any message.', 'Report to the IRS and FTC using the links below.', 'Know that the real IRS contacts by mail first and never demands immediate payment by phone or gift cards.'],
    donts: ['Pay or give personal or financial information.', 'Believe threats of immediate arrest or deportation.', 'Buy gift cards or wire money to "clear" tax debt.'],
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
    story: 'A woman claiming to be from “Medicare” calls Patricia and says her new card requires a fee and her bank details to activate. Patricia gives her account number. Real Medicare does not call to “activate” cards or ask for payment or bank details over the phone—scammers impersonate agencies to steal money and identity. Other common variants: police or sheriff "warrant" calls, jury duty fines, immigration/USCIS, FBI/DEA, census workers, or fake relief or stimulus checks.',
    intro: 'Someone pretends to be from a government agency (IRS, SSA, Medicare, police, sheriff, jury office, immigration/USCIS, FBI/DEA, census, or "relief" programs) to scare you into paying or sharing personal information. Report to stop them and protect others.',
    spotIt: ['Calls or messages claiming you have a warrant, missed jury duty, or must pay a fine to avoid arrest.', 'Impersonation of immigration, FBI, DEA, or census to get money or personal data.', 'Offers of "relief" or "stimulus" that require a fee or your bank details.'],
    dos: ['Hang up or delete the message; contact the real agency via their official website.', 'Save the phone number, email, or message.', 'Report using the links below.'],
    donts: ['Send money or give Social Security numbers or account details.', 'Believe that a government agency demands immediate payment by gift cards, wire, or crypto.', 'Trust caller ID; numbers can be spoofed.'],
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
    slug: 'utility-shutoff-scam',
    name: 'Utility company shutoff scam',
    category: 'impersonation',
    story: 'A caller says they are from the electric or gas company and your service will be cut off in an hour unless you pay immediately by wire or gift card. Real utility companies send notices by mail and do not demand instant payment by gift card. If your service were really at risk, you would have had a letter or a notice on your bill first. Hang up and call the number on your actual bill to confirm your account status.',
    intro: 'Scammers pretend to be your electric, gas, or water company and threaten to shut off service unless you pay right away. Real utilities do not demand immediate payment by gift card or wire.',
    dos: ['Hang up and look up your utility\'s real number on your bill or their official website.', 'Call the number on your bill to confirm your account status.', 'Report to the FTC and your state Attorney General.'],
    donts: ['Pay by gift card or wire in response to a threatening call.', 'Use the phone number the caller gives you.', 'Assume the call is real because they know your address.'],
    steps: [
      'Hang up. Do not pay by gift card or wire. Look up your utility\'s real number on your bill or their official website.',
      'Call the number on your bill to confirm your account status.',
      'Report to the FTC and your state Attorney General.',
    ],
    reports: [
      { who: 'The FTC collects reports of utility and imposter scams.', when: 'Use when someone pretended to be a utility to get payment.', prepare: ['Phone number', 'What they said', 'Amount if paid'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'Your state Attorney General may handle utility-related fraud.', when: 'Use to report in your state.', prepare: ['What happened'], href: 'https://www.usa.gov/state-attorney-general', label: 'USA.gov – State AGs' },
    ],
  },
  {
    slug: 'government-grant-scam',
    name: 'Government grant scam',
    category: 'impersonation',
    story: 'You get a call or message saying you qualify for a federal grant and need to pay a "processing fee" or "tax" to receive it. Real government grants do not require you to pay upfront fees to receive money. Grants are applied for through official programs; no legitimate agency will call or message out of the blue to say you have been "approved" and only need to pay a fee to get the funds. Anyone who does that is a scammer.',
    intro: 'Scammers claim you have been approved for a government grant and ask for a fee or your bank details to "release" the funds. Real grants do not work that way.',
    dos: ['Save the phone number, email, or message.', 'Apply for grants only through official programs (Grants.gov, etc.).', 'Report to the FTC and IC3 if you lost money.'],
    donts: ['Pay any "fee" or give bank account details to receive a grant.', 'Believe unsolicited calls or messages that you have been "approved" for a grant.', 'Send money to "release" or "process" grant funds.'],
    steps: [
      'Do not pay any "fee" or give bank account details. No real grant requires upfront payment to receive funds.',
      'Save the phone number, email, or message. Grants are applied for through official programs, not unsolicited calls.',
      'Report to the FTC.',
    ],
    reports: [
      { who: 'The FTC tracks government grant and imposter scams.', when: 'Use when someone claimed you won a grant but asked for money first.', prepare: ['How they contacted you', 'What they promised', 'Amount they asked for'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles internet-related grant fraud.', when: 'Use when the scam was online and you lost money.', prepare: ['Emails or website', 'Amount lost'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'romance',
    name: 'Romance scams',
    category: 'impersonation',
    story: 'After months of daily messages, “Kevin” tells Jennifer he’s stuck abroad and needs $3,000 for a flight home. She sends it. Then his “boss” needs a bribe; then there’s a “medical emergency.” She has never met him in person or on a real video call. The person on the other end is a scammer who built a fake relationship to drain her savings. Romance scammers can spend months building trust before they ask for money; once they do, the "emergencies" never stop. She has never met him in person or on a real video call—and she never will.',
    intro: 'Someone builds a relationship online (dating app, social media) then asks for money for emergencies, travel, or "investments." Never send money to someone you have not met in person. Report to the FTC and IC3.',
    spotIt: ['The person avoids meeting in person or a live video call and has excuses (travel, military, overseas job).', 'They develop the relationship then ask for money for emergencies, travel, medical, or "investments."', 'They pressure you to act quickly or keep the request secret from family or friends.'],
    dos: ['Stop sending money or gift cards.', 'Save profile links, usernames, messages, and any payment details.', 'Report to the FTC and IC3 and block the person.'],
    donts: ['Send money to someone you have not met in person.', 'Give bank or account access.', 'Keep the request secret from family or friends.'],
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
    dos: ['Verify with the real family member by calling back on a number you already have.', 'Note the caller\'s number and what they said.', 'Report to the FTC and your local police or IC3 if you lost money.'],
    donts: ['Send money until you have verified with the real family member.', 'Believe that a relative needs you to keep the request secret.', 'Use the phone number the caller gives you to "verify."'],
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
    dos: ['Track packages only on the official carrier website.', 'Save the message (screenshot) and report to the FTC.', 'Report fake USPS messages to the Postal Inspection Service.'],
    donts: ['Click links or pay "delivery fees" via text or email.', 'Assume the message is from the real carrier.', 'Enter card or personal info on a link from a text.'],
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
    story: 'Nina is hired for a “remote data entry” job. The “employer” sends a check to buy equipment and asks her to wire the difference to a “vendor.” She does; the check bounces. She’s out the wired amount and her bank may hold her liable. Real employers do not send you a check and ask you to send part of it elsewhere—that’s a classic fake-check scam. Other variants: mystery shopper scams, business directory or yellow-pages listing scams, fake invoices or vendor bills, fake franchise or business opportunity offers, and MLM schemes disguised as jobs with heavy "sign-up" fees.',
    intro: 'Fake job postings or "employers" ask for money for training, equipment, or "taxes," or steal your personal information. This includes mystery shopper schemes, business directory scams, fake invoices, fake franchises, and MLM-style sign-up fees. Legitimate employers do not ask you to pay to get the job.',
    spotIt: ['Jobs that require you to pay for equipment, training, or a "listing" before you earn.', 'Mystery shopper or "evaluate our transfer system" offers that involve moving money.', 'Invoices or "vendor" payments you did not authorize, or MLM pitches with large upfront fees.'],
    dos: ['Research the company and contact them through official channels (not only the email in the ad).', 'Verify the employer before sending personal documents.', 'Report to the FTC and, if you lost money, to IC3.'],
    donts: ['Pay for "training," "equipment," or "fees" to start a job.', 'Wire or send part of a "paycheck" or check to a "vendor."', 'Send personal documents to an unverified employer.'],
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
    story: 'Omar finds a great apartment on a listing site, contacts the “owner” by email, and sends first month’s rent and a deposit via wire. When he shows up to get the keys, the real owner has never heard of him—the listing used stolen photos and a fake contact. The scammer keeps the money and disappears. Rental scams often use real listings and stolen photos; the "owner" is someone far away who will never meet you in person. Never pay before you have seen the property and signed a real lease with a verified owner or manager.',
    intro: 'Fake rental listings ask for a deposit or rent before you see the property or sign a lease. The "landlord" may be impersonating a real owner. Report to the FTC and local authorities.',
    dos: ['See the property in person (or via a verified video) and sign a real lease before paying.', 'Verify the owner or property manager through county records or the building management.', 'Report to the FTC and your local police or housing authority.'],
    donts: ['Pay before you have seen the property and have a real lease.', 'Wire rent or deposit to someone you have not met or verified.', 'Trust listings that only exist online with no way to verify the owner.'],
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
  {
    slug: 'timeshare-resale',
    name: 'Timeshare resale scam',
    category: 'housing',
    story: 'A company promises to sell your timeshare for a large fee upfront. You pay; they never sell it or disappear. Legitimate resale companies do not typically charge large upfront fees before a sale. If someone demands thousands before they have even found a buyer, they are very likely to take the money and do nothing—or disappear. Check with the BBB and your state Attorney General before paying.',
    intro: 'Scammers promise to sell your timeshare for an upfront fee, then do nothing or disappear. Be wary of anyone demanding a large fee before finding a buyer.',
    dos: ['Research the company with the BBB and your state AG.', 'Check your timeshare contract for any approved resale or exit options.', 'Report to the FTC and your state Attorney General.'],
    donts: ['Pay large upfront fees before a buyer is found.', 'Trust pressure to "act now" or "limited time" offers.', 'Skip checking the company with the BBB or state AG.'],
    steps: [
      'Do not pay large upfront fees. Research the company with the BBB and your state AG.',
      'Check your timeshare contract for any approved resale or exit options.',
      'Report to the FTC and your state Attorney General.',
    ],
    reports: [
      { who: 'The FTC tracks timeshare and resale scams.', when: 'Use when a company took money and did not deliver.', prepare: ['Company name', 'Amount paid', 'What they promised'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'Your state Attorney General may handle real estate and timeshare fraud.', when: 'Use to report in your state.', prepare: ['Company', 'What happened'], href: 'https://www.usa.gov/state-attorney-general', label: 'USA.gov – State AGs' },
    ],
  },
  {
    slug: 'home-repair-contractor',
    name: 'Home repair & contractor scams',
    category: 'housing',
    story: 'Someone shows up after a storm or calls offering a "great deal" on roofing or repairs. They take a large deposit and never return, or do shoddy work. Storm chasers and fake contractors often pressure for upfront payment and disappear. They may knock on your door right after a storm or call from a "local" number. Get a written contract and verify the contractor\'s license with your state before paying anything; real contractors do not demand full payment before work begins.',
    intro: 'Fake contractors or "storm chasers" take deposits and do not complete work, or do poor work. Get written contracts and verify licenses before paying.',
    dos: ['Get a written contract and check your state contractor license board.', 'Be wary of door-to-door offers or high-pressure "today only" deals.', 'Report to the FTC and your state AG or consumer protection office.'],
    donts: ['Pay in full upfront before work begins.', 'Hire without verifying the contractor\'s license.', 'Trust "storm chasers" who show up right after a disaster.'],
    steps: [
      'Do not pay in full upfront. Get a written contract and check your state contractor license board.',
      'Be wary of door-to-door offers or high-pressure "today only" deals.',
      'Report to the FTC and your state AG or consumer protection office.',
    ],
    reports: [
      { who: 'The FTC collects reports of home repair and contractor fraud.', when: 'Use when you paid and work was not done or was substandard.', prepare: ['Company or person', 'Amount paid', 'What was agreed'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'Your state Attorney General or consumer office often handles contractor complaints.', when: 'Use to report in your state.', prepare: ['Contractor name', 'What happened'], href: 'https://www.usa.gov/state-attorney-general', label: 'USA.gov – State AGs' },
    ],
  },
  {
    slug: 'moving-company-hostage',
    name: 'Moving company hostage-goods scam',
    category: 'housing',
    story: 'A moving company loads your belongings and then demands much more money than the quote to deliver them, or holds your items "hostage" until you pay extra fees. Some use lowball quotes and then add charges; others are outright frauds that take your things and disappear. Once your belongings are on the truck, you have very little leverage. Always get a written estimate, check the mover\'s license (FMCSA for interstate moves), and never pay the full amount before delivery.',
    intro: 'Dishonest movers quote low, then demand more money before releasing your belongings, or hold your goods hostage. Get written estimates and check reviews and licensing before hiring.',
    dos: ['Get a written estimate and read the contract.', 'Check the mover\'s license (FMCSA for interstate) and reviews.', 'Report to the FMCSA and state AG if you are being held up.'],
    donts: ['Pay the full amount before delivery.', 'Hire without a written estimate or contract.', 'Use a mover that is not licensed for interstate moves when moving across state lines.'],
    steps: [
      'Get a written estimate and read the contract. Check the mover\'s license (FMCSA for interstate) and reviews.',
      'Do not pay the full amount before delivery. Report to the FMCSA and state AG if you are being held up.',
      'File a complaint with the FTC and your state consumer protection or AG.',
    ],
    reports: [
      { who: 'The FTC collects reports of moving company fraud.', when: 'Use when a mover demanded more money or held your goods.', prepare: ['Company name', 'What happened', 'Amount'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'FMCSA regulates interstate movers and takes complaints.', when: 'Use for interstate moves.', prepare: ['Mover name', 'Details'], href: 'https://www.fmcsa.dot.gov/protect-your-move', label: 'FMCSA – Protect Your Move' },
      { who: 'Your state Attorney General often handles intrastate moving complaints.', when: 'Use to report in your state.', prepare: ['What happened'], href: 'https://www.usa.gov/state-attorney-general', label: 'USA.gov – State AGs' },
    ],
  },
  {
    slug: 'fake-tenant-screening',
    name: 'Fake background check or tenant-screening scam',
    category: 'housing',
    story: 'You apply for an apartment and are told to pay for a "background check" or "tenant screening" through a link the "landlord" sent. You pay; the site is fake and the "landlord" is a scammer collecting fees. Real landlords use established screening services and do not ask you to pay through a random link. The "landlord" and the "screening" site are often the same scammer collecting fees—and sometimes your personal data—from many applicants.',
    intro: 'Scammers pose as landlords and direct you to fake screening or background-check sites to steal your money and sometimes your personal data. Verify the landlord and use only legitimate screening processes.',
    dos: ['Confirm the property and owner through county records or the building.', 'Research the screening site; legitimate services are well known.', 'Report to the FTC and your state AG.'],
    donts: ['Pay screening fees through links from an unverified landlord.', 'Give personal data to a site you cannot verify.', 'Assume the "landlord" and "screening" site are separate.'],
    steps: [
      'Do not pay screening fees through links from an unverified landlord. Confirm the property and owner through county records or the building.',
      'Research the screening site; legitimate services are well known and used by many landlords.',
      'Report to the FTC and your state AG.',
    ],
    reports: [
      { who: 'The FTC collects reports of fake tenant and background-check scams.', when: 'Use when you paid for a fake screening or lost money.', prepare: ['Website or contact', 'Amount', 'What was promised'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'Your state Attorney General may handle rental and consumer fraud.', when: 'Use to report in your state.', prepare: ['What happened'], href: 'https://www.usa.gov/state-attorney-general', label: 'USA.gov – State AGs' },
    ],
  },
  // —— Prizes & charity ——
  {
    slug: 'prize-sweepstakes-lottery',
    name: 'Prize, sweepstakes & lottery scams',
    category: 'prizes_charity',
    story: 'A letter tells Paul he’s won a foreign lottery and must send $500 in “taxes” and “fees” to receive his millions. He sends the money; more “fees” keep coming. He never receives a prize. Legitimate sweepstakes do not require you to pay to claim winnings—any request for upfront payment is a scam. Once you pay once, more "fees" and "taxes" keep coming. The prize never exists.',
    intro: 'You are told you won a prize or lottery but must pay "fees" or "taxes" to collect. Real prizes do not require you to pay upfront. Report to the FTC.',
    dos: ['Save any emails, letters, or phone numbers.', 'Report to the FTC and, if you lost money, to IC3.'],
    donts: ['Pay any "fee," "tax," or "shipping" to claim a prize.', 'Believe that legitimate sweepstakes require upfront payment.', 'Send money to "release" or "process" winnings.'],
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
    story: 'After a disaster, Rita gets a call from a “relief fund” that sounds official. She donates by wire. Later she learns the charity doesn’t exist or the number was a scammer. Her money never reached victims. Fake charities use real tragedies to rush people into giving before they can verify; real charities can be checked at IRS.gov or Charity Navigator. Her money never reached victims—it went to a scammer who sounded official and urgent.',
    intro: 'Fake charities or disaster relief appeals pressure you to donate. Verify charities at Charity Navigator or the IRS before giving. Report fake charities to the FTC and state AG.',
    dos: ['Verify the charity at IRS.gov or Charity Navigator before giving.', 'Save the website, email, or phone number used to solicit you.', 'Report to the FTC and your state Attorney General.'],
    donts: ['Give cash, wire, or gift cards to an unverified charity.', 'Donate under pressure or to newly created "relief" funds without checking.', 'Assume a name that sounds official is a real charity.'],
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
  {
    slug: 'pet-adoption-scam',
    name: 'Pet adoption scam',
    category: 'prizes_charity',
    story: 'You find a pet "rescuer" online and pay adoption and shipping fees. The pet never arrives, or the "rescuer" keeps asking for more money for "vet fees" or "customs." Fake rescues use stolen photos and emotional appeals to get payment. The "rescuer" may keep asking for more money for "vet fees" or "customs" even after you have paid adoption and shipping. Real rescues allow in-person or verified adoption and do not keep demanding more fees. Reverse-image search any photos to see if they were stolen from real shelters.',
    intro: 'Fake pet adoption or rescue sites charge fees for animals that do not exist or never ship. Real rescues allow in-person or verified adoption and do not keep demanding more fees.',
    dos: ['Verify the rescue through local shelters or BBB.', 'Reverse-image search photos to see if they are stolen from real rescues.', 'Report to the FTC and your state AG.'],
    donts: ['Pay by wire or gift card for a pet you have not seen in person.', 'Send more money for "vet fees" or "customs" after initial payment.', 'Trust emotional appeals without verifying the rescue.'],
    steps: [
      'Do not pay by wire or gift card. Verify the rescue through local shelters or BBB.',
      'Reverse-image search photos to see if they are stolen from real rescues.',
      'Report to the FTC and your state AG.',
    ],
    reports: [
      { who: 'The FTC collects reports of pet and adoption scams.', when: 'Use when you paid for a pet you did not receive.', prepare: ['Website or contact', 'Amount paid', 'Screenshots'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'Your state Attorney General may handle consumer and charity fraud.', when: 'Use to report in your state.', prepare: ['What happened'], href: 'https://www.usa.gov/state-attorney-general', label: 'USA.gov – State AGs' },
    ],
  },
  {
    slug: 'vacation-cruise-scam',
    name: 'Vacation package & free cruise scam',
    category: 'prizes_charity',
    story: 'You get a call or pop-up saying you have "won" a free cruise or vacation and only need to pay "port fees" or "taxes." You pay; the trip never materializes or is worthless. Legitimate free trips do not require you to pay large upfront fees. If you have to pay "port fees" or "taxes" to receive a prize, it is not a prize—it is a sales pitch or a scam. The trip may never materialize or may be worthless. Verify any offer through the BBB or official travel sources before paying.',
    intro: 'Scammers offer "free" vacations or cruises and then charge fees, or sell vacation packages that do not exist. Real giveaways do not require you to pay to receive the prize.',
    dos: ['Verify the company through the BBB or official travel sources.', 'Save all ads, emails, or phone numbers.', 'Report to the FTC and, if you paid, to IC3.'],
    donts: ['Pay "fees" or "taxes" to claim a "free" trip.', 'Trust pop-ups or cold calls offering free cruises.', 'Give payment info before verifying the offer.'],
    steps: [
      'Do not pay "fees" or "taxes" to claim a "free" trip. Verify the company through the BBB or official travel sources.',
      'Save all ads, emails, or phone numbers.',
      'Report to the FTC and, if you paid, to IC3.',
    ],
    reports: [
      { who: 'The FTC tracks vacation and travel scams.', when: 'Use when you paid for a trip that did not exist or was misrepresented.', prepare: ['Company name', 'Amount paid', 'What was promised'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles internet-related travel fraud.', when: 'Use when the scam was online and you lost money.', prepare: ['Website or email', 'Amount lost'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'crowdfunding-scam',
    name: 'Bogus crowdfunding campaign',
    category: 'prizes_charity',
    story: 'A crowdfunding page asks for donations for a disaster, medical emergency, or cause. The organizer is fake or keeps the money. Scammers use real tragedies and fake profiles to get donations that never reach victims. Before giving to a crowdfunding campaign, verify the organizer and, when possible, the beneficiary. Be cautious with newly created accounts and campaigns that pressure you to give immediately.',
    intro: 'Fake crowdfunding campaigns on GoFundMe-style sites collect money for causes that do not exist or that the organizer keeps. Verify campaigns and report fraud to the platform and FTC.',
    dos: ['Verify the campaign through the platform and, when possible, the beneficiary.', 'Report suspicious or fraudulent campaigns to the platform and the FTC.', 'Be cautious with newly created accounts.'],
    donts: ['Donate under pressure or to campaigns you cannot verify.', 'Assume the organizer and beneficiary are legitimate.', 'Give without checking if the campaign or organizer is real.'],
    steps: [
      'Verify the campaign through the platform and, when possible, the beneficiary. Be cautious with newly created accounts.',
      'Report suspicious or fraudulent campaigns to the platform (e.g. GoFundMe) and the FTC.',
      'If you donated to a fake campaign, report to the FTC.',
    ],
    reports: [
      { who: 'The FTC collects reports of charity and crowdfunding fraud.', when: 'Use when a campaign was fake or misused funds.', prepare: ['Campaign link', 'Organizer', 'Amount if given'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'Report to the crowdfunding platform (e.g. GoFundMe) so they can take action.', when: 'Use to report the specific campaign.', prepare: ['Campaign URL', 'What you know'], href: 'https://www.gofundme.com/safety', label: 'GoFundMe – Safety' },
    ],
  },
  // —— Identity & benefits ——
  {
    slug: 'identity-theft',
    name: 'Identity theft',
    category: 'identity_benefits',
    story: 'When Sandra tries to file her taxes, she’s told someone already filed using her Social Security number and claimed a refund. A thief had used her stolen identity. She discovers new credit cards and accounts she never opened. Identity thieves use leaked or stolen personal data to file taxes, open accounts, or take loans in someone else’s name. Other forms include synthetic identity theft (mix of real and fake data), medical or employment identity theft, child identity theft, and account takeover of bank, credit, or retirement accounts. Thieves use leaked or stolen data from breaches, phishing, or malware; the damage can take years to undo. Reporting quickly and placing fraud alerts or freezes helps limit the harm.',
    intro: 'Someone uses your personal information to open accounts, file taxes, get medical care, or commit fraud. This includes synthetic identity theft, medical/employment/child identity theft, and account takeover. Report it and take steps to limit damage and restore your identity.',
    spotIt: ['Bills or accounts you never opened, or medical/employment records that are not yours.', 'Unexpected password resets or lockouts on your bank or retirement accounts.', 'Credit report entries for accounts or addresses you do not recognize.'],
    dos: ['Go to IdentityTheft.gov for a step-by-step recovery plan.', 'Place fraud alerts or freezes with the credit bureaus.', 'Close any accounts you did not open and report to the FTC and other agencies as directed.'],
    donts: ['Ignore bills or accounts you do not recognize.', 'Delay placing a fraud alert or freeze.', 'Assume one strange charge or letter is a mistake; check your credit report.'],
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
    story: 'A company calls Derek and promises to lower his federal student loan payments or get forgiveness for a one-time fee of $599. He pays; they do nothing and stop returning calls. The U.S. Department of Education and your servicer do not charge to apply for income-driven plans or forgiveness—anyone who does is running a scam. Legitimate help is free at StudentAid.gov and through your servicer; if someone asks for money upfront, hang up and report them.',
    intro: 'Scammers promise to lower payments, forgive loans, or "consolidate" for a fee. The U.S. Department of Education and your servicer do not charge for applying for relief. Report to the FTC and CFPB.',
    dos: ['Use StudentAid.gov and your servicer directly for relief or consolidation.', 'Save any ads, emails, or phone numbers from the scammer.', 'Report to the FTC and CFPB.'],
    donts: ['Pay for "loan forgiveness" or "consolidation" services.', 'Believe that you must pay to access income-driven plans or forgiveness.', 'Give your FSA ID or account access to a company that called you.'],
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
    story: 'A federal employee sees a contractor billing for work that was never done and a manager signing off on it. She wants to report it without retaliation. Fraud, waste, and abuse in federal programs can be reported to Inspector General hotlines and Oversight.gov—there are legal protections for whistleblowers who report in good faith. She can gather what she knows: dates, agencies, people involved, and the type of concern. Then she can use Oversight.gov to find the right place or contact the OIG for that agency and submit through the official complaint or hotline.',
    intro: 'To report fraud, waste, abuse, or retaliation in federal programs, use Oversight.gov and the right Inspector General (OIG) for the agency involved.',
    dos: ['Gather what you know: dates, agencies, people involved, and the type of concern.', 'Use Oversight.gov to find the right OIG or complaint channel.', 'Submit through the official complaint or hotline; whistleblower protections may apply.'],
    donts: ['Assume there is no way to report; OIGs and Oversight.gov exist for this.', 'Share your report publicly before submitting through official channels.', 'Ignore retaliation; report it to the appropriate OIG or OSC.'],
    steps: [
      'Gather what you know: dates, agencies, people involved, and the type of concern.',
      'Use Oversight.gov to find the right place or contact the OIG for that agency.',
      'Submit through the official complaint or hotline; your report goes to the correct oversight body.',
    ],
    reports: [
      { who: 'Oversight.gov explains where to report federal fraud, waste, abuse, or retaliation.', when: 'Use when you are not sure which OIG to contact.', prepare: ['What happened', 'Agency or program', 'Dates'], href: 'https://www.oversight.gov/where-report-fraud-waste-abuse-or-retaliation', label: 'Oversight.gov – Where to report' },
      { who: 'USA.gov helps you complain about a federal or state agency.', when: 'Use for general agency complaints or service issues.', prepare: ['Agency', 'What went wrong'], href: 'https://www.usa.gov/agency-complaints', label: 'USA.gov – Agency complaints' },
    ],
  },
  // —— Emerging & other ——
  {
    slug: 'fake-legal-threat',
    name: 'Fake legal threat or lawsuit email',
    category: 'emerging',
    story: 'You get an email claiming you are being sued or must appear in court, with a link to "court documents" or a demand to pay a "settlement" to avoid arrest. The notice is fake—real courts serve papers formally and do not demand payment by gift card or wire to "dismiss" a case. Scammers send these emails to scare people into paying or clicking a link that may steal information or install malware. If you receive one, contact the court or agency directly using contact info from their official website, not from the email.',
    intro: 'Scammers send fake legal notices, lawsuit threats, or jury duty demands to scare you into paying. Real courts do not notify by random email or demand immediate payment by gift card or wire.',
    dos: ['Verify by contacting the court or agency directly using official contact info (not from the email).', 'Save the email (headers and body) and any phone numbers.', 'Report to the FTC and IC3.'],
    donts: ['Click links in the email or pay a "settlement" to avoid arrest.', 'Assume the notice is real because it looks official.', 'Use contact information from the email; look up the court or agency yourself.'],
    steps: [
      'Do not click links or pay. Verify by contacting the court or agency directly using official contact info (not from the email).',
      'Save the email (headers and body) and any phone numbers.',
      'Report to the FTC and IC3.',
    ],
    reports: [
      { who: 'The FTC collects reports of fake legal and government threats.', when: 'Use when you received a fake lawsuit or legal threat.', prepare: ['Email or message', 'Sender', 'What they demanded'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'The FBI\'s IC3 handles internet-based impersonation and fraud.', when: 'Use when the threat came by email or online and you lost money.', prepare: ['What happened', 'Contact method'], href: 'https://www.ic3.gov/', label: 'Go to IC3' },
    ],
  },
  {
    slug: 'immigration-lawyer-notario',
    name: 'Bogus immigration lawyer or notario scam',
    category: 'emerging',
    story: 'Someone offers to "fix" immigration papers or get a work permit for a large fee. They are not a licensed attorney or accredited representative—they may be a "notario" (notary) who has no legal authority to give immigration advice. Victims pay thousands and get nothing or invalid filings that hurt their case. Only licensed attorneys or BIA-accredited representatives can give immigration legal advice. A "notario" in many countries is a lawyer, but in the U.S. a notary is not a lawyer—and cannot legally advise you on immigration. Always verify the person with your state bar or the BIA before paying.',
    intro: 'Fake immigration "consultants" or notarios charge for services they cannot legally provide. Only licensed attorneys or accredited representatives can give immigration legal advice. Report fraud to the FTC and state bar.',
    dos: ['Verify the person is a licensed attorney (state bar) or BIA-accredited representative.', 'Report to your state bar if someone pretended to be a lawyer, and to the FTC for consumer fraud.', 'Report notario fraud to your state AG and the FTC.'],
    donts: ['Pay large upfront fees for "guaranteed" immigration results.', 'Assume a "notario" can give legal advice; in the U.S. a notary is not a lawyer.', 'Use someone who is not verified with the state bar or BIA.'],
    steps: [
      'Verify the person is a licensed attorney (state bar) or a BIA-accredited representative. Do not pay large upfront fees for "guaranteed" results.',
      'Report to your state bar if someone pretended to be a lawyer, and to the FTC for consumer fraud.',
      'Report notario fraud to your state AG and the FTC.',
    ],
    reports: [
      { who: 'The FTC collects reports of immigration and notario fraud.', when: 'Use when you paid for immigration services that were fake or deceptive.', prepare: ['Name of person or business', 'Amount paid', 'What was promised'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'Your state bar association can confirm if someone is a licensed attorney and take complaints.', when: 'Use if someone claimed to be a lawyer.', prepare: ['Name', 'What they did'], href: 'https://www.americanbar.org/groups/legal_services/flh/flh-free-legal-answers/', label: 'American Bar – Find legal help' },
      { who: 'Your state Attorney General often handles notario and consumer fraud.', when: 'Use to report in your state.', prepare: ['What happened'], href: 'https://www.usa.gov/state-attorney-general', label: 'USA.gov – State AGs' },
    ],
  },
  {
    slug: 'health-cure-supplement',
    name: 'Health cure & miracle supplement scam',
    category: 'emerging',
    story: 'An ad or social media post promises a "miracle" cure for cancer, diabetes, or weight loss with a supplement or device. You pay; the product does nothing or is dangerous. Real treatments are not sold through pop-up ads with "doctors don\'t want you to know" claims. If a product could really cure a serious condition, it would be approved by the FDA and prescribed by doctors. These ads prey on hope and fear; the product often does nothing or is dangerous. Talk to your doctor before trying any new health product and report false claims to the FTC and FDA.',
    intro: 'Scammers sell unproven or fake cures, supplements, or devices that claim to treat serious conditions. Report to the FTC and FDA; real treatments are approved and prescribed by licensed providers.',
    dos: ['Talk to your doctor before trying new health products.', 'Save ads, URLs, and receipts.', 'Stop using the product if you have side effects, see a doctor, and report to the FTC and FDA.'],
    donts: ['Buy "cures" or "miracle" supplements from unknown sellers or pop-up ads.', 'Believe "doctors don\'t want you to know" claims.', 'Use unapproved products for serious conditions instead of prescribed treatment.'],
    steps: [
      'Do not buy "cures" or "miracle" supplements from unknown sellers. Talk to your doctor before trying new health products.',
      'Save ads, URLs, and receipts. Stop using the product if you have side effects and see a doctor.',
      'Report to the FTC and FDA.',
    ],
    reports: [
      { who: 'The FTC collects reports of health and supplement fraud.', when: 'Use when you were deceived or harmed by a fake cure or supplement.', prepare: ['Product name', 'Where you bought it', 'What was claimed'], href: 'https://reportfraud.ftc.gov/', label: 'FTC ReportFraud' },
      { who: 'The FDA investigates false health claims and dangerous products.', when: 'Use for fake cures, unapproved drugs, or unsafe supplements.', prepare: ['Product', 'Claims made', 'Adverse effects if any'], href: 'https://www.fda.gov/safety/report-problem-fda', label: 'FDA – Report a problem' },
    ],
  },
  {
    slug: 'ai-deepfake-scams',
    name: 'AI & deepfake scams',
    category: 'emerging',
    story: 'Karen gets a call from “her daughter”—the voice is identical, crying, saying she’s been in an accident and needs money for the hospital. Karen wires $8,000. The voice was an AI clone made from a few seconds of her daughter’s social media audio. Scammers now use deepfake voice or video to impersonate family, bosses, or public figures and pressure victims into sending money. The technology has improved so much that a short clip from social media can be enough to clone a voice. Always verify through a separate channel—call the person back on a number you know, or contact another family member—before sending money or sharing sensitive information.',
    intro: 'Scammers use AI-generated voice, video, or images to impersonate someone you know or a public figure to trick you into sending money or information. Verify through a separate channel before acting.',
    dos: ['Contact the person through a known number or account before sending money or info.', 'Save the message, call recording if legal, or any link.', 'Report to the FTC and IC3.'],
    donts: ['Send money or sensitive info based only on a call or video.', 'Assume a voice or video is real; deepfakes can be very convincing.', 'Use a callback number or link provided by the caller.'],
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
    story: 'Frank, 72, has been getting daily calls from “his bank” about a “suspicious transaction.” They’ve convinced him to move his savings to a “secure account” and have already taken $30,000. Elder fraud often combines tech-support, government-imposter, or romance schemes with repeated contact to build trust and isolate the victim. Reporting and getting support early can limit losses and protect others. Elder fraud often combines tech-support, government-imposter, or romance schemes with repeated contact to build trust and isolate the victim. If you or someone you know is 60+ and has been targeted, report to the FTC and IC3 and contact the National Elder Fraud Hotline for help.',
    intro: 'Older adults are often targeted by tech support, government impersonation, romance, and investment scams. Report to the FTC and IC3, and contact the National Elder Fraud Hotline for support.',
    dos: ['Report to the FTC and IC3 with as much detail as possible if you or someone 60+ was targeted.', 'Contact the National Elder Fraud Hotline for reporting help and resources.', 'Consider a fraud alert or credit freeze if financial info was shared.'],
    donts: ['Feel embarrassed to report; it helps others and can limit harm.', 'Wait to report; acting quickly can help recovery.', 'Leave an older adult without support; share hotline and reporting links.'],
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
