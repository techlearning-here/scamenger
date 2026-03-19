import type { StoryContent } from './types';

const content: StoryContent = {
  characterIntro:
    'A **Discord DM** arrived from an account that matched a **moderator’s** name and avatar, saying I had **won a GPU** in a server giveaway and should **connect my wallet** to claim.\u2029I was active in that community and wanted to believe the win was real.',
  initialPlot:
    'The link opened a clean page that asked me to **sign a transaction** to “approve the NFT drop.”\u2029I confirmed it in my browser wallet; within one block **about three thousand dollars** in tokens left the account through permissions I had granted.',
  scamExperience:
    '**Fake mod DMs** and **wallet drainer** sites are common on Discord; the contract behind a friendly button can include **unlimited token approval**.\u2029Revoking access later stops new drains but does not return what already moved.',
  victimExperience:
    'While I clicked through, jargon on the screen looked like normal Web3 flow, and I did not read the **contract name** in the explorer until a developer friend translated it the next day.',
  climax:
    'That friend pasted the **transaction** into an explorer, pointed at a function I had ignored, and showed **setApprovalForAll**—meaning the scam contract could move balances I thought were still mine.',
  victimPain:
    'I moderated channels on that server myself, so trusting a spoofed mod stung; I posted a warning publicly and stepped back from trading for a while.',
  learningVictim:
    'I **never sign** transactions from **DM links**; **real giveaways** are announced in **verified channels**, and I use a **hardware wallet** for anything beyond play money.',
  learningForReaders: [
    '**Treat Discord DMs** about **crypto prizes** as **fake** unless confirmed in an **official announcement**.',
    '**Review** wallet prompts carefully; **revoke** suspicious approvals via trusted tools and **report** the server mods.',
  ],
};

export default content;
