import type { StoryContent } from './types';

const content: StoryContent = {
  characterIntro:
    'At a neighbourhood café I scanned the **QR code** on the table tent to pay my tab and tip. The checkout skin looked like a familiar processor, so I completed the charge and only thought about it again when the owner walked over asking if I had paid in cash.',
  initialPlot:
    'They still used paper menus and their real QR lived behind the counter; someone had slapped a sticker over the tent overnight. My receipt email used a domain I did not recognise, but I shrugged until the staff showed me the laminated code they actually owned.',
  scamExperience:
    '**QR swapping** is physical phishing: a cheap sticker routes tips and tabs to a cloned payment page. The merchant helped me file a police report, and security footage later showed someone replacing codes along the strip after closing.',
  victimExperience:
    'Post-pandemic habit made me scan without thinking, and I assumed table tents were as trustworthy as the espresso machine. I did not preview the URL because I was rushing to catch a train.',
  climax:
    'When I compared the URL in my banking app to the café\'s real domain, the mismatch was obvious in hindsight. The owner\'s confirmation that their code never lived on that tent was the moment I understood I had tipped a stranger.',
  victimPain:
    'I lost about **forty pounds** and spent evenings feeling foolish every time I ate out afterward. Small businesses suffered the same suspicion I carried, which was an unfair side effect of one sticker.',
  learningVictim:
    'I now ask staff "is this your code?" before I pay a big tab and read the domain like an email link. I wish I had taken two seconds to match the merchant name.',
  learningForReaders: [
    '**Businesses**: mount QR codes behind glass or laminate tamper-evident prints; audit tables daily.',
  ],
};

export default content;
