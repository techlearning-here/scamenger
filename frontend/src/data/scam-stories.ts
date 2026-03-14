/**
 * Scam story titles and categories for the Stories index page.
 * One page per story can be built incrementally; slug is used for future /stories/[slug] routes.
 */

import type { ScamCategoryId } from '@/data/scams/types';

/** Hardship/impact tag shown on story cards and pages. */
export type HardshipTag = 'major_loss' | 'emotional' | 'recovery' | 'identity' | 'moderate';

export const HARDSHIP_TAG_LABELS: Record<HardshipTag, string> = {
  major_loss: 'Major loss',
  emotional: 'Emotional impact',
  recovery: 'Recovery & lessons',
  identity: 'Identity impact',
  moderate: 'Moderate impact',
};

export interface ScamStoryEntry {
  slug: string;
  title: string;
  category: ScamCategoryId;
  /** Optional hardship tag; if omitted, derived from category. */
  hardshipTag?: HardshipTag;
}

/** Slugs of stories to show in the "Start here" / featured row (high-impact entry points). */
export const FEATURED_STORY_SLUGS: string[] = [
  'how-i-lost-12000-someone-i-never-met',
  'too-good-to-be-true-investment-life-savings',
  'pump-and-dump-fake-guru-investment-group',
  'what-i-wish-id-known-before-lost-money',
  'fake-recruiter-lost-money-before-day-one',
  'i-clicked-the-link-phishing-story',
  'scammed-twice-recovery-scam',
];

/** All story titles with slug and primary category. Used by /stories index; slugs for future story pages. */
export const SCAM_STORY_ENTRIES: ScamStoryEntry[] = [
  // Romance & dating
  { slug: 'how-i-lost-12000-someone-i-never-met', title: '$12,000 gone—to someone I\'d never even met', category: 'financial' },
  { slug: 'romance-scam-lasted-two-years', title: 'Two years of "us"—then I found out who he really was', category: 'impersonation' },
  { slug: 'i-thought-we-were-getting-married', title: 'We were planning the wedding. The "fiancé" was a stranger.', category: 'impersonation' },
  { slug: 'when-love-asked-for-gift-cards', title: 'He said he loved me. Then he asked for gift cards.', category: 'financial' },
  { slug: 'catfished-fake-profile-drained-savings', title: 'The face was fake. The debt was real.', category: 'impersonation' },
  { slug: 'whatsapp-romance-cost-me-everything', title: 'A WhatsApp romance wiped out everything I had', category: 'online' },
  { slug: 'why-i-sent-money-to-stranger-i-loved-online', title: 'I sent thousands to someone I "loved"—here\'s why', category: 'financial' },
  { slug: 'military-romance-scam-deployed', title: 'He was "deployed." The only thing real was my loss.', category: 'impersonation' },
  { slug: 'i-fell-for-crypto-romance-scam', title: 'Love + crypto: how I lost both', category: 'financial' },
  { slug: 'moment-i-realised-online-partner-was-scammer', title: 'The one text that made me see the truth', category: 'impersonation' },
  // Investment, crypto & get-rich-quick
  { slug: 'too-good-to-be-true-investment-life-savings', title: 'The returns were insane. So was what happened next.', category: 'financial' },
  { slug: 'pension-into-fake-crypto-platform', title: 'I moved my pension into "crypto." The platform was a ghost.', category: 'financial' },
  { slug: 'trading-app-vanished-with-my-money', title: 'One morning the app was gone. So was my money.', category: 'financial' },
  { slug: 'double-your-bitcoin-scam', title: '"Double your Bitcoin"—I believed it', category: 'financial' },
  { slug: 'friend-recommended-fake-investment', title: 'My friend said it was a sure thing. It wasn\'t.', category: 'financial' },
  { slug: 'recovery-room-scam-came-back-for-more', title: 'They stole from me. Then offered to "get it back"—for a fee.', category: 'financial' },
  { slug: 'linkedin-opportunity-cost-50000', title: 'A LinkedIn message cost me $50,000', category: 'employment' },
  { slug: 'lost-money-cloned-broker-website', title: 'The broker site was a perfect copy. My balance wasn\'t.', category: 'financial' },
  { slug: 'pig-butchering-slowly-drained-months', title: 'Months of "gains"—then the slow bleed began', category: 'financial' },
  { slug: 'fake-celebrity-crypto-endorsements', title: 'I trusted a celebrity "endorsement." Big mistake.', category: 'financial' },
  { slug: 'whatsapp-investment-group-wasnt', title: 'The WhatsApp group wasn\'t investors—it was a trap', category: 'online' },
  { slug: 'thought-day-trading-was-being-scammed', title: 'I thought I was trading. I was the mark.', category: 'financial' },
  { slug: 'forex-scam-account-never-withdraw', title: 'My balance kept growing. Withdraw? "Technical issue."', category: 'financial' },
  { slug: 'recovery-lawyer-tried-to-scam-again', title: 'A "recovery lawyer" tried to scam me—after I\'d already been scammed', category: 'financial' },
  { slug: 'pump-and-dump-fake-guru-investment-group', title: 'The "guru" and the pump-and-dump group that cleaned me out', category: 'financial' },
  // Phishing, emails & fake links
  { slug: 'email-looked-like-from-my-bank', title: 'The email looked exactly like my bank\'s. It wasn\'t.', category: 'online' },
  { slug: 'i-clicked-the-link-phishing-story', title: 'I clicked the link. Everything changed.', category: 'online' },
  { slug: 'fake-account-suspended-email-cost-me', title: '"Your account is suspended"—I panicked and paid', category: 'online' },
  { slug: 'delivery-text-stole-card-details', title: 'A text about my delivery ended with my card drained', category: 'online' },
  { slug: 'when-amazon-asked-verify-account', title: '"Amazon" wanted me to verify. I did. They weren\'t Amazon.', category: 'online' },
  { slug: 'tax-refund-phishing-thought-irs', title: 'I thought it was the IRS. The refund was a trick.', category: 'government' },
  { slug: 'almost-gave-password-fake-microsoft-page', title: 'I was one click away from handing over my password', category: 'online' },
  { slug: 'docusign-scam-looked-real', title: 'The DocuSign looked 100% real. The link wasn\'t.', category: 'online' },
  { slug: 'fake-invoice-email-paid-scammer-mistake', title: 'I "accidentally" paid an invoice. To a scammer.', category: 'online' },
  { slug: 'spear-phishing-knew-my-name-and-boss', title: 'They knew my name and my boss\'s. I bit.', category: 'online' },
  // Job & work-from-home
  { slug: 'remote-job-asked-for-bank-details', title: 'The "remote job" wanted my bank details before I started', category: 'employment' },
  { slug: 'paid-training-kit-job-didnt-exist', title: 'I paid for a training kit. The job never existed.', category: 'employment' },
  { slug: 'fake-recruiter-lost-money-before-day-one', title: 'I lost money before I\'d even had day one', category: 'employment' },
  { slug: 'mystery-shopper-scam-easy-money', title: 'Easy money for "mystery shopping"—sounded perfect', category: 'employment' },
  { slug: 'employer-sent-fake-cheque-deposit', title: 'My "employer" sent a cheque. I deposited it. Then the nightmare started.', category: 'employment' },
  { slug: 'reshipping-scam-unwitting-parcel-mule', title: 'I thought I had a job. I was shipping for criminals.', category: 'employment' },
  { slug: 'linkedin-job-offer-too-good-to-be-true', title: 'The LinkedIn offer was dream-level. It was a scam.', category: 'employment' },
  { slug: 'almost-became-money-mule', title: 'I almost moved "company" money. It wasn\'t company money.', category: 'employment' },
  { slug: 'fake-visa-job-offer-paid-thousands-upfront', title: 'Visa + dream job—I paid thousands. Got neither.', category: 'employment' },
  { slug: 'work-from-home-scheme-wanted-my-id', title: 'Work from home—all they wanted was my ID. Red flag.', category: 'employment' },
  { slug: 'babysitting-scam-send-money-supplies-first', title: '"Send money for supplies first." The family wasn\'t real.', category: 'employment' },
  { slug: 'fake-modelling-talent-agency', title: 'The "talent agency" wanted cash before any gig', category: 'employment' },
  { slug: 'interview-asked-for-credit-card', title: 'The interview asked for my credit card. I should have run.', category: 'employment' },
  // Tech support & impersonation
  { slug: 'pop-up-computer-infected', title: 'A pop-up said my computer was infected. I believed it.', category: 'online' },
  { slug: 'i-called-number-on-screen-tech-support', title: 'I called the number on the screen. Worst call I ever made.', category: 'phone' },
  { slug: 'when-microsoft-called-fix-my-pc', title: '"Microsoft" called to "fix" my PC. They didn\'t.', category: 'phone' },
  { slug: 'fake-bank-call-got-my-one-time-codes', title: 'They called as my bank. I gave them the codes.', category: 'phone' },
  { slug: 'refund-call-emptied-my-account', title: 'They said they were refunding me. They emptied my account.', category: 'phone' },
  { slug: 'scammer-pretended-to-be-my-grandson', title: 'The voice said "Grandpa." It wasn\'t my grandson.', category: 'phone' },
  { slug: 'grandma-im-in-jail-grandparent-scam', title: '"Grandma, I\'m in jail—send money now"', category: 'phone' },
  { slug: 'hmrc-irs-called-demanding-payment', title: '"IRS" called. They threatened arrest. I paid.', category: 'government' },
  { slug: 'fake-police-law-enforcement-call', title: 'The "police" called. The warrant was fake.', category: 'government' },
  { slug: 'suspicious-activity-call-real-threat', title: 'They said my account was at risk. The call was the risk.', category: 'phone' },
  { slug: 'how-they-spoofed-my-banks-number', title: 'The caller ID showed my bank. It wasn\'t my bank.', category: 'phone' },
  { slug: 'social-security-number-suspended', title: '"Your Social Security number is suspended"—I panicked', category: 'government' },
  { slug: 'amazon-paypal-security-call-gave-access', title: 'A "security" call asked for access. I gave it.', category: 'phone' },
  // Lottery, prizes & charity
  { slug: 'i-won-lottery-i-never-entered', title: 'I "won" a lottery I\'d never even entered', category: 'prizes_charity' },
  { slug: 'prize-required-upfront-fee', title: 'I won! I just had to pay a "fee" first. I did.', category: 'prizes_charity' },
  { slug: 'fake-charity-after-disaster', title: 'I wanted to help after the disaster. The charity was fake.', category: 'prizes_charity' },
  { slug: 'youve-been-selected-sweepstakes-scam', title: '"You\'ve been selected!"—for a sweepstakes scam', category: 'prizes_charity' },
  { slug: 'fake-inheritance-notice', title: 'A stranger left me money. Or so the email said.', category: 'prizes_charity' },
  { slug: 'grant-benefit-asked-payment-first', title: 'Free grant—I just had to pay to "unlock" it', category: 'prizes_charity' },
  { slug: 'fake-celebrity-charity-fundraiser', title: 'I gave to a "celebrity" fundraiser. There was no celebrity.', category: 'prizes_charity' },
  { slug: 'pay-taxes-on-winnings-before-prize', title: 'Pay "taxes" on your winnings first. The prize never came.', category: 'prizes_charity' },
  { slug: 'cruise-holiday-winner-scam', title: 'I "won" a cruise. I paid "fees." No cruise.', category: 'prizes_charity' },
  { slug: 'donation-scam-used-real-charity-name', title: 'They used a real charity\'s name. The money didn\'t go there.', category: 'prizes_charity' },
  // Housing & rental
  { slug: 'paid-deposit-flat-wasnt-for-rent', title: 'I paid the deposit. The flat wasn\'t for rent.', category: 'housing' },
  { slug: 'landlord-in-another-country', title: 'The "landlord" was always "in another country"', category: 'housing' },
  { slug: 'fake-listing-keys-never-arrived', title: 'I paid. The keys never came. The listing was fake.', category: 'housing' },
  { slug: 'lost-deposit-rental-scam', title: 'My deposit vanished—and so did the "landlord"', category: 'housing' },
  { slug: 'owner-asked-wire-transfer-only', title: 'Wire transfer only. No viewings. I sent the money.', category: 'housing' },
  { slug: 'vacation-rental-property-didnt-exist', title: 'We showed up. The "vacation rental" didn\'t exist.', category: 'housing' },
  { slug: 'roommate-scam-paid-upfront-room-taken', title: 'I paid for the room upfront. Someone else was already there.', category: 'housing' },
  { slug: 'fake-real-estate-agent', title: 'The "agent" took my deposit and disappeared', category: 'housing' },
  { slug: 'listing-used-someone-elses-photos', title: 'The photos were someone else\'s home. I found out too late.', category: 'housing' },
  { slug: 'rent-to-own-paid-never-got-deed', title: 'Rent-to-own: I paid for years. The deed never came.', category: 'housing' },
  // Government, tax & benefits
  { slug: 'irs-hmrc-call-threatened-arrest', title: '"Pay now or we arrest you." It wasn\'t the tax office.', category: 'government' },
  { slug: 'i-paid-back-taxes-to-scammer', title: 'I paid "back taxes" to someone who wasn\'t the IRS', category: 'government' },
  { slug: 'fake-benefit-grant-pay-fee-unlock', title: 'My "grant" was ready—I just had to pay to unlock it', category: 'government' },
  { slug: 'visa-cancelled-unless-you-pay', title: '"Your visa is cancelled unless you pay now"', category: 'government' },
  { slug: 'scammers-pretended-social-security', title: 'They said they were from Social Security. They weren\'t.', category: 'government' },
  { slug: 'fake-jury-duty-court-fine', title: 'I got a "jury duty" notice. The court had never heard of it.', category: 'government' },
  { slug: 'refund-from-tax-office-took-more', title: 'They offered a refund. They took more than I had.', category: 'government' },
  { slug: 'immigration-scam-forms-that-are-free', title: 'I paid for government forms. They\'re free.', category: 'government' },
  { slug: 'official-letter-that-wasnt', title: 'The letter looked official. Every word was a lie.', category: 'government' },
  // Identity theft & benefits
  { slug: 'someone-opened-accounts-in-my-name', title: 'Accounts I never opened—in my name', category: 'identity_benefits' },
  { slug: 'identity-stolen-after-data-breach', title: 'After the breach, someone became "me"', category: 'identity_benefits' },
  { slug: 'fake-credit-fix-made-things-worse', title: 'I paid to fix my credit. It got worse.', category: 'identity_benefits' },
  { slug: 'medical-identity-theft', title: 'Someone used my identity at the hospital', category: 'identity_benefits' },
  { slug: 'someone-filed-tax-return-in-my-name', title: 'A tax return was filed in my name. Not by me.', category: 'identity_benefits' },
  { slug: 'fake-benefits-advisor-wanted-ni-number', title: 'The "benefits advisor" wanted my NI number. I gave it.', category: 'identity_benefits' },
  { slug: 'found-out-ssn-was-being-misused', title: 'I found out my SSN was being used—by someone else', category: 'identity_benefits' },
  { slug: 'verify-identity-site-stole-it', title: 'I went to "verify" my identity. The site stole it.', category: 'identity_benefits' },
  // Shopping, fake sites & marketplaces
  { slug: 'ordered-phone-got-empty-box', title: 'I ordered a phone. The box was empty.', category: 'online' },
  { slug: 'website-looked-like-real-brand', title: 'The site looked like the real brand. It wasn\'t.', category: 'online' },
  { slug: 'lost-money-fake-concert-ticket-site', title: 'I bought concert tickets. The site was fake. No tickets.', category: 'online' },
  { slug: 'puppy-pet-scam-animal-never-came', title: 'I paid for a puppy. The "breeder" vanished.', category: 'online' },
  { slug: 'fake-designer-goods-cautionary-tale', title: 'The "designer" bag was a convincing fake', category: 'online' },
  { slug: 'facebook-marketplace-deal-went-wrong', title: 'The Marketplace deal seemed legit. It wasn\'t.', category: 'online' },
  { slug: 'seller-asked-payment-outside-app', title: 'Pay outside the app, they said. I did. I lost.', category: 'online' },
  { slug: 'thought-buying-car-it-was-scam', title: 'I thought I was buying a car. I was buying a lesson.', category: 'online' },
  { slug: 'subscription-trap-couldnt-cancel', title: 'I tried to cancel. They made it impossible.', category: 'online' },
  { slug: 'free-trial-charged-me-for-year', title: 'Free trial—then they charged me for a full year', category: 'online' },
  { slug: 'fake-antivirus-software-was-malware', title: 'I installed "antivirus." It was the virus.', category: 'online' },
  { slug: 'counterfeit-goods-my-story', title: 'The deal was too good. The goods were fake.', category: 'online' },
  // WhatsApp, Telegram, social & messaging
  { slug: 'whatsapp-message-from-my-boss', title: 'A WhatsApp from "my boss" cost me thousands', category: 'online' },
  { slug: 'telegram-crypto-group-drained-wallet', title: 'I joined a Telegram "crypto group." They drained my wallet.', category: 'online' },
  { slug: 'fake-friend-request-real-loss', title: 'One friend request. Real money gone.', category: 'online' },
  { slug: 'dm-promised-easy-money', title: 'A DM promised easy money. Delivered the opposite.', category: 'online' },
  { slug: 'friend-asked-receive-and-send-money', title: '"Can you receive this and send it on?" It wasn\'t a friend.', category: 'online' },
  { slug: 'instagram-brand-deal-wanted-bank-details', title: 'An Instagram "brand deal" wanted my bank details first', category: 'online' },
  { slug: 'discord-giveaway-was-scam', title: 'I "won" a Discord giveaway. I lost money.', category: 'online' },
  { slug: 'scammed-via-linkedin', title: 'LinkedIn felt safe. The scam didn\'t.', category: 'online' },
  { slug: 'facebook-friend-hard-luck-story', title: 'A new "friend" had a sob story. I sent money.', category: 'online' },
  { slug: 'whatsapp-wrong-number-investment-fraud', title: 'A "wrong number" on WhatsApp led to investment fraud', category: 'online' },
  // Elder fraud & family
  { slug: 'how-my-parent-was-targeted', title: 'My parent was targeted. Here\'s what our family learned.', category: 'other' },
  { slug: 'elderly-relative-sent-gift-cards-stranger', title: 'My relative sent gift cards to a stranger. We found out too late.', category: 'financial' },
  { slug: 'grandchild-in-trouble-call-almost-believed', title: 'We almost sent money. The "grandchild" was a scammer.', category: 'phone' },
  { slug: 'romance-scam-older-adults-what-we-learned', title: 'Older adults and romance scams: what we wish we\'d known', category: 'impersonation' },
  { slug: 'helped-parent-after-tech-support-scam', title: 'After the tech support scam: how we got our parent back on track', category: 'other' },
  { slug: 'inheritance-scam-targeting-seniors', title: 'They said there was an inheritance. There wasn\'t.', category: 'prizes_charity' },
  { slug: 'medication-health-scam-targeted-family', title: 'A "health" scam targeted my family. Here\'s what happened.', category: 'other' },
  { slug: 'financial-advisor-wasnt-who-they-said', title: 'The "financial advisor" had a different identity—and my money', category: 'financial' },
  // Recovery, second scams & lessons
  { slug: 'scammed-twice-recovery-scam', title: 'I was scammed. Then someone offered to "recover" my money.', category: 'financial' },
  { slug: 'how-i-reported-it-what-happened-next', title: 'I reported it. Here\'s what actually happened next.', category: 'other' },
  { slug: 'what-i-wish-id-known-before-lost-money', title: 'What I wish I\'d known before I lost a cent', category: 'other' },
  { slug: 'signs-i-missed-looking-back-at-scam', title: 'Looking back: the red flags I missed', category: 'other' },
  { slug: 'how-i-got-part-of-money-back', title: 'I got some of it back. Here\'s how.', category: 'other' },
  { slug: 'why-i-report-scams-now', title: 'I report every scam now. Here\'s why.', category: 'other' },
  { slug: 'what-family-did-after-we-realised-scammed', title: 'We realised we\'d been scammed. This is what we did.', category: 'other' },
  { slug: 'lawyer-recovery-agent-wanted-more-money', title: 'A "recovery agent" wanted more money. I said no.', category: 'financial' },
  { slug: 'how-i-rebuilt-after-major-loss', title: 'After the loss: how I put the pieces back together', category: 'other' },
  { slug: 'what-i-tell-others-about-this-scam', title: 'What I tell everyone about this scam now', category: 'other' },
  // Emerging & other
  { slug: 'deepfake-ai-voice-scam', title: 'The voice was my relative\'s. The call wasn\'t.', category: 'emerging' },
  { slug: 'qr-code-fake-payment-page', title: 'I scanned the QR code. It wasn\'t a payment page—it was a trap.', category: 'emerging' },
  { slug: 'ai-bot-convinced-me-to-pay', title: 'A "bot" talked me into paying. I did.', category: 'emerging' },
  { slug: 'fake-app-in-store-looked-legitimate', title: 'The app was in the store. It was still fake.', category: 'emerging' },
  { slug: 'crypto-support-took-my-keys', title: '"Support" asked for my keys. I handed them over.', category: 'financial' },
  { slug: 'romance-scam-used-video-calls', title: 'We had video calls. The person was still a scammer.', category: 'impersonation' },
  { slug: 'job-scam-used-real-company-name', title: 'They used a real company\'s name. The job was fake.', category: 'employment' },
  { slug: 'scammer-used-my-social-media-against-me', title: 'They used my own posts to make me trust them', category: 'online' },
  { slug: 'verification-loop-never-ended', title: 'Verify, verify, verify—the loop never stopped', category: 'online' },
  { slug: 'rental-scam-real-property-address', title: 'The address was real. The landlord wasn\'t.', category: 'housing' },
  { slug: 'fake-government-grant-via-text', title: 'A text said I\'d won a "government grant." I hadn\'t.', category: 'government' },
  { slug: 'refund-asked-for-screen-share', title: 'They offered a refund—if I shared my screen. I did.', category: 'online' },
  { slug: 'customer-support-was-the-scammer', title: 'I called "customer support." The scammer answered.', category: 'online' },
  { slug: 'qr-code-parking-meter-paid-wrong-place', title: 'I scanned the parking QR code. My payment went to a scammer.', category: 'emerging' },
  { slug: 'update-payment-text-not-from-bank', title: '"Update your payment details"—the text wasn\'t from my bank', category: 'phone' },
];

const DEFAULT_RELATED_LIMIT = 4;

/** Default hardship tag by category when entry.hardshipTag is not set. */
const DEFAULT_HARDSHIP_BY_CATEGORY: Record<ScamCategoryId, HardshipTag> = {
  financial: 'major_loss',
  impersonation: 'emotional',
  employment: 'moderate',
  housing: 'major_loss',
  prizes_charity: 'moderate',
  identity_benefits: 'identity',
  government: 'moderate',
  emerging: 'moderate',
  other: 'recovery',
  online: 'moderate',
  phone: 'moderate',
};

/**
 * Returns the hardship tag for a story (explicit or category-based default).
 */
export function getHardshipTag(entry: ScamStoryEntry): HardshipTag {
  if (entry.hardshipTag) return entry.hardshipTag;
  return DEFAULT_HARDSHIP_BY_CATEGORY[entry.category];
}

/**
 * Returns related story entries (same category first, then others), excluding the given slug.
 */
export function getRelatedStories(
  currentSlug: string,
  category: ScamCategoryId,
  limit: number = DEFAULT_RELATED_LIMIT
): ScamStoryEntry[] {
  const sameCategory = SCAM_STORY_ENTRIES.filter(
    (e) => e.slug !== currentSlug && e.category === category
  );
  const other = SCAM_STORY_ENTRIES.filter(
    (e) => e.slug !== currentSlug && e.category !== category
  );
  const combined = [...sameCategory, ...other];
  return combined.slice(0, limit);
}
