import type { StoryContent } from './types';

const content: StoryContent = {
  characterIntro:
    'At work a **browser pop-up** said my **Microsoft account** would be locked unless I **verified now**.\u2029I was mid-deadline and did not want email or Teams cut off, so I almost treated the window like an IT ticket.',
  initialPlot:
    'The page copied the **real login layout**—logo, colours, password field—and I had my cursor in the box before I noticed the address bar did not match what our handbook shows.\u2029I closed the tab, opened a new window, and typed **microsoft.com** myself; there was **no security alert** on the real account.',
  scamExperience:
    'That pop-up was **phishing**: steal the password, then use **email and work logins** for fraud or further break-ins.\u2029I reported the URL to IT and ran a scan; nothing was taken because I never submitted the form.',
  victimExperience:
    'In the moment I was more afraid of **losing access** during a meeting than of a fake page—I almost skipped the step of checking the URL.',
  climax:
    'The real portal showed a clean account and our IT desk confirmed **they had not pushed that warning**; the fake site was taken down from the block list a day later.',
  victimPain:
    'No money went missing, but I was shaken by how close I came; I changed the password anyway and still double-check the address bar on every login.',
  learningVictim:
    'I never type passwords on pages I reached through a **pop-up** or **link**.\u2029I use a **typed URL** or a **saved bookmark** every time.',
  learningForReaders: [
    '**Never enter passwords** on pages opened from pop-ups, ads, or unexpected links.',
    '**Report** phishing to **IT** (at work) and to **consumer fraud** channels for personal accounts.',
  ],
};

export default content;
