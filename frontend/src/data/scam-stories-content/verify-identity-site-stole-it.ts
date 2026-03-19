import type { StoryContent } from './types';

const content: StoryContent = {
  characterIntro:
    'I was in line for coffee when a text said the bank would **lock my account** unless I verified before branches closed. I had just paid with that card, so losing access felt plausible—and I **tapped the link** while I waited.',
  initialPlot:
    'The page asked for passport photos, a selfie with ID, and the last four of my Social. The **URL was one character off** the real bank, invisible on a bright phone screen. I uploaded everything, grabbed my drink, and went back to work thinking I had solved it.',
  scamExperience:
    'That evening password-reset emails hit accounts I never touched. I called the bank, froze what I could, and stared at ceilings wondering where those **ID images** would surface next.',
  victimExperience:
    'I told myself speed meant I was ahead of fraud—that a frozen account would hurt more than a five-minute form—so I broke my own rule about SMS links on purpose.',
  climax:
    'The next day an agent on the **number from my card** said they had not sent any verification text. On a laptop the phishing domain typo was obvious in seconds; that tiny character had hinged everything after it.',
  victimPain:
    'I froze credit and left alerts on because I could not know who held the photos; checking statements felt like an extension of that same anxious week, only slower.',
  learningVictim:
    'I verify only inside the **bank app** or on URLs I type in a fresh tab. A screenshot of the text plus one outbound call would have prevented the whole spiral.',
  learningForReaders: [
    '**Never upload ID** through links from SMS or email.',
    '**Report phishing** to your bank and groups such as **APWG**.',
  ],
};

export default content;
