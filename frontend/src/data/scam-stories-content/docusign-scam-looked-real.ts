import type { StoryContent } from './types';

const content: StoryContent = {
  characterIntro:
    'I was **expecting a contract** for a freelance gig, so when email arrived saying **DocuSign** had a document waiting, the timing felt right.\u2029The layout matched messages I had seen from real signings before.',
  initialPlot:
    'I clicked **View document**, landed on a flow that copied colours and buttons from the real product, and started typing **login** details before I noticed the **hostname** in the bar was wrong.\u2029I closed the tab without submitting and opened DocuSign from a bookmark instead.',
  scamExperience:
    '**Fake e-sign emails** harvest **passwords** or drop **malware**; because many people are mid-deal when they arrive, the click rate stays high.\u2029I ran a malware scan and rotated passwords after realising how close I had come.',
  victimExperience:
    'While the page loaded I was thinking about **deadlines**, not URLs—I almost treated the link like a calendar invite.',
  climax:
    'On the **real DocuSign** inbox there was **no envelope** from that sender; support confirmed **phishing** was circulating that week using the same subject lines.',
  victimPain:
    'I lost most of a day re-securing accounts and explaining to the client why I had delayed; the stress sat in my chest longer than the actual incident.',
  learningVictim:
    'I do not sign from **email links** anymore.\u2029I go to the **provider’s site** myself, log in, and open envelopes only from there.',
  learningForReaders: [
    '**Check the URL** on any “sign document” page; when in doubt, open the **official e-sign site** directly.',
    '**Forward** phishing to the provider’s abuse address and **report** to **FTC** (US) or local fraud lines.',
  ],
};

export default content;
