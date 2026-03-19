import type { StoryContent } from './types';

const content: StoryContent = {
  characterIntro:
    'I was in line for coffee when a text said the bank would **lock my account** unless I **verified my identity** before the branch closed; I had just paid with that card, so I **tapped the link** while I waited because losing access that night felt plausible.',
  initialPlot:
    'The page asked for my **passport**, a **selfie with the ID**, and the last four digits of my **Social Security number**.\u2029The **URL was one character off** the real bank, which I did not spot on a small screen in daylight.\u2029I uploaded everything, pocketed my drink, and went back to work thinking the problem was solved.',
  scamExperience:
    'That evening **password-reset emails** arrived from services I use, none triggered by me, so I called the bank and stayed on hold through dinner—freezing what I could and changing passwords while I thought about where those **ID images** might go next.',
  victimExperience:
    'That same morning, before any of that, I had told myself that moving fast meant **I was ahead of fraud** and that a **frozen account** would be worse than a five-minute form—so I broke the rule about SMS links on purpose, not by accident.',
  climax:
    'The next day I dialled the **number on the back of the card**; the agent said **they had not sent any verification SMS**.\u2029On my laptop the phishing link showed the **typo in the domain** in a second—small, and the hinge for everything that followed.',
  victimPain:
    'I **froze my credit** and left alerts on because I could not know who had the photos; for months, checking statements felt like an extension of that same week, only slower.',
  learningVictim:
    'I only verify in the **bank’s app** or on a **URL I type myself** in a new tab.\u2029A screenshot of the text and one outbound call would have avoided the whole spiral.',
  learningForReaders: [
    '**Never upload ID** through links delivered by **SMS or email**.',
    '**Report phishing** to your bank and to organisations such as **APWG**.',
  ],
};

export default content;
