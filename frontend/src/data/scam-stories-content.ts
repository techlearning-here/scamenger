/**
 * Full story content for scam experience pages.
 * All content is stored in the frontend; no backend/CMS. Structure follows docs/SCAM_STORIES_STRUCTURE_for_Writer.md.
 */

export interface StoryContent {
  characterIntro: string;
  initialPlot: string;
  scamExperience: string;
  victimExperience: string;
  victimPain: string;
  climax: string;
  learningVictim: string;
  /** Actionable takeaways: bullets or short paragraphs. */
  learningForReaders: string[];
}

const STORY_CONTENT: Record<string, StoryContent> = {
  'pump-and-dump-fake-guru-investment-group': {
    characterIntro:
      'I was in my 30s, working full-time but **worried about money and retirement**. I wasn’t looking for a get-rich-quick scheme—I just wanted to **grow my savings** with someone who seemed to know what they were doing.',
    initialPlot:
      'I found a **“trading guru” or “professor”** on social media—someone who presented as an expert educator. He had a **big following**, posted screenshots of **huge gains**, and ran a **private group** where members shared “signals” and tips. It felt like a real community. I joined the group, watched for a few weeks, and when people kept posting about profits, I thought: **why not put in a small amount and see?**',
    scamExperience:
      'The group admins pointed us to a specific “broker” or “platform” and told us exactly when to buy. At first my balance went up—I was relieved and excited. When I wanted to withdraw, they said I had to pay “tax” or “fees” first, or that I needed to add more to “unlock” the withdrawal. I paid. Then they asked for more. The **guru or professor** and the group kept saying **the next trade would fix everything**. They even told me to bring my friends and relatives into this “golden opportunity.”',
    victimExperience:
      'I told myself I was **being smart**—following people who seemed to have a system. When my first “gain” showed on the screen, I felt **hopeful**. Part of me wondered why they needed us to use that one platform, but I didn’t want to seem paranoid or miss out. I was **embarrassed to ask anyone in real life** because I didn’t want to hear it was a scam.',
    victimPain:
      'I lost **a large chunk of my savings**. Worse was **the shame**—I couldn’t tell my family or friends. I felt **stupid and angry at myself**. It took me **months to report** because I was so ashamed. My confidence in investing—and in strangers online—**is still damaged**.',
    climax:
      'One day they sold all the pumped-up stock and I lost all my investment—value went to 0. The **guru\u2019s or professor\u2019s** account went quiet. The group chat filled with people asking where their money was, and then **the group was deleted or we were all removed**. I Googled the platform name and his name and found **warnings and reports**. That’s when I knew. It was a pump-and-dump scam and a fake community designed to clean us out.',
    learningVictim:
      'I now know: if someone directs you to one specific platform and tells you exactly when to buy, it’s not education—it’s a setup. I wish I’d checked the platform with my bank or a regulator before sending a single dollar.',
    learningForReaders: [
      'Watch for: **“gurus” or “professors”** (or anyone posing as an expert educator) and groups that push one platform, “signals” that everyone follows at once, and any pressure to pay “tax” or “fees” before you can withdraw.',
      '**Never invest** through a link or platform recommended only in a private group or by an influencer. **Check with your bank or a financial regulator** if a firm is legitimate.',
      'If you’ve lost money, **report it to the FTC or your local authority**.',
    ],
  },
  'lpg-payment-pending-link-phone-hijacked': {
    characterIntro:
      'I work in an office and manage our household—bills, supplies, and making sure we don\u2019t run out of essentials. With **news of LPG shortages** everywhere, I was already anxious about keeping the gas supply going. I wasn\u2019t looking for trouble—I just wanted to **pay what was due** so our supply wouldn\u2019t get cut.',
    initialPlot:
      'I got a message saying my **LPG payment was pending** and that supply would be stopped if I didn\u2019t pay immediately. It looked like it could be from the gas agency or distributor. With all the talk of shortages, **I didn\u2019t want to risk a lapse**. I clicked the link in the message.',
    scamExperience:
      'The message had a link to complete the payment or update KYC—phrases like **\u201cLPG KYC pending\u201d**, **\u201cAadhaar link pending for LPG cylinder\u201d**, or **\u201cImmediate payment required to continue LPG supply.\u201d**',
    victimExperience:
      'I told myself it was **the right thing to do**—clear the pending payment before the supply stopped. I felt **rushed** because of the shortage news and didn\u2019t want to seem careless. Part of me wondered if I should verify first, but **I was afraid of delay**. I didn\u2019t want to bother anyone at the distributor; the message seemed official enough.',
    climax:
      'After I clicked, **my phone was hijacked**—I couldn\u2019t use it normally. Unauthorized payment withdrawal requests started hitting my bank account. My **WhatsApp was hacked** too. I had no control. When I realized my **phone was no longer mine** and saw the withdrawal requests, I went to the police. At the station I found **many similar complaints**—others had received the same kind of messages and clicked. The fraudsters had been sending those fake LPG and KYC links to thousands. That\u2019s when I knew it was a **coordinated scam** using the gas shortage to create panic and steal from people.',
    victimPain:
      '**Money from my bank account was gone**—taken by unauthorized withdrawals—and I spent days trying to secure my phone and WhatsApp. The **stress and shame** were huge—I felt stupid for clicking. Reporting and dealing with the bank and police was exhausting. I still get anxious when I get any message about payments or KYC.',
    learningVictim:
      'I now know: **no real gas company or government body will ask you to pay or link Aadhaar via a link in SMS or WhatsApp**. I wish I\u2019d checked only through the official distributor or government portal before doing anything. Scammers use current events—like gas shortages—to make their messages feel urgent and real.',
    learningForReaders: [
      '**Never click links** in SMS, WhatsApp, or email about \u201cLPG payment pending,\u201d \u201cLPG KYC pending,\u201d \u201cAadhaar link for LPG,\u201d or \u201cimmediate payment to continue supply.\u201d These are common scam messages in India.',
      '**Verify only through official channels**: your known LPG distributor, the official government or company website, or a phone number you look up yourself—not from the message.',
      'If you clicked and suspect your device or accounts are compromised, **contact your bank immediately**, secure your WhatsApp (e.g. deactivate and recover), and **report to the police**. Share awareness with family and colleagues.',
    ],
  },
};

/**
 * Returns full story content for a slug, or null if only the listing/title exists.
 */
export function getStoryContent(slug: string): StoryContent | null {
  return STORY_CONTENT[slug] ?? null;
}
