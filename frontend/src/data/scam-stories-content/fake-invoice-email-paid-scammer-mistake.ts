import type { StoryContent } from './types';

const content: StoryContent = {
  characterIntro:
    'I run a small business and **pay invoices from email** every week, so when a message arrived from a supplier’s name with an **invoice** and **new bank details**, I queued it for payment like any other.',
  initialPlot:
    'The layout matched past threads; the note said their **account had changed** after a merger.\u2029I wired **thousands** the same afternoon because the due date was tight and I did not want to hold up their cash flow.',
  scamExperience:
    '**Business email compromise** and **fake invoice** scams impersonate real vendors; the money landed in a **criminal account**.\u2029The real supplier never changed banks—they had not sent the email.',
  victimExperience:
    'While I authorised the transfer I told myself calling would slow the month-end close; verifying by phone felt old-fashioned compared to the familiar signature block.',
  climax:
    'The supplier’s accounts team replied to my “payment sent” note with confusion; when we compared headers, the **sender domain** was one character off.',
  victimPain:
    'Recovering the funds through the bank was uncertain; I had to tell my **accountant** and absorb the hit to cash flow while disputes ran.',
  learningVictim:
    'Any **change of bank details** gets a **callback** on a **number I look up myself**—never the phone line in the email.',
  learningForReaders: [
    '**Confirm payment changes** out of band with **known contacts**.',
    '**Report** to your bank and **law enforcement** fraud units; tighten **email** authentication for your domain.',
  ],
};

export default content;
