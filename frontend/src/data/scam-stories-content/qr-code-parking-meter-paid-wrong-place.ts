import type { StoryContent } from './types';

const content: StoryContent = {
  characterIntro:
    'I scanned a **QR code** on a city parking meter because the sign said mobile pay was fastest. The page copied the municipal logo and fine print well enough that I entered card details without a second thought.',
  initialPlot:
    'A sticker had been layered over the real city code; my receipt email was gibberish, but I ignored it until a tow notice arrived. I had paid **crooks**, not the meter, so the city still showed my spot as unpaid.',
  scamExperience:
    '**QR jacking** routes payments to fake gateways while the real authority sees nothing. I lost **roughly two hundred dollars** to the fake portal and another **three hundred** in tow and ticket fees before I understood what happened.',
  victimExperience:
    'I trusted infrastructure I walk past every day and let convenience override caution. I did not compare the URL to the city site because the graphic design looked official enough.',
  climax:
    'Parking enforcement showed photos of their authentic QR under the sticker I peeled away. Seeing the real code hidden beneath fraud felt violating and made the scam concrete in a way emails never had.',
  victimPain:
    'The double cost wrecked my budget for the month and cost a full day retrieving the car. I replayed the thirty-second scan more than the money.',
  learningVictim:
    'I now download the **official parking app** from the city store listing or pay at a kiosk after reading signage, and I inspect stickers for edges or mismatched lamination. I wish I had matched the domain to the government site first.',
  learningForReaders: [
    'If a **QR** asks for crypto or odd data, stop—use the app your city publishes.',
  ],
};

export default content;
