import type { StoryContent } from './types';

const content: StoryContent = {
  characterIntro:
    'I was **waiting for a tax refund** and checking email often, so when a message said the IRS had money for me and I should claim it through a link, it felt timely—not suspicious.',
  initialPlot:
    'The layout copied government wording and listed a refund amount that sounded plausible. I clicked, entered personal and bank details, and waited for a deposit that never came. Instead, alerts for new accounts started.',
  scamExperience:
    '**Tax-refund phishing** steals credentials to file fake returns or drain accounts. Real agencies do not email or text "claim your refund" links. I lost **time and money** cleaning up identity theft.',
  victimExperience:
    'Expecting money made the message feel relevant. I did not want to miss a deadline, so I clicked without typing the URL myself.',
  climax:
    'A phone agent on the official line read their policy aloud: they do not initiate refund claims by email. Hearing the rule from a human, not a blog, killed the last hope that the message had been real.',
  victimPain:
    'Stress and shame stacked while I froze accounts and filed affidavits. Reporting gave me a checklist when my brain wanted to shut down.',
  learningVictim:
    'I only use tax sites I navigate myself from .gov addresses I bookmark. I wish I had paused at the first link.',
  learningForReaders: [
    '**IRS and tax agencies** do not email or text refund links—use official **.gov** sites.',
    '**Report** tax phishing to the IRS and FTC.',
  ],
};

export default content;
