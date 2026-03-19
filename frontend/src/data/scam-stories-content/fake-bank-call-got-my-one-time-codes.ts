import type { StoryContent } from './types';

const content: StoryContent = {
  characterIntro:
    'A caller said they were **my bank’s fraud team**, named a few real merchants from my statement, and warned that a **bogus transfer** was in progress unless I **verified** immediately.\u2029**Caller ID** showed a number I thought I recognised.',
  initialPlot:
    'They stayed on the line while texts arrived with **one-time codes** and asked me to **read each code aloud** so they could “block the transaction.”\u2029I complied until my app showed **new payees** and outgoing wires I had not set up.',
  scamExperience:
    '**Vishing** plus **spoofed numbers** plus **OTP codes** lets criminals pass **strong authentication** from the victim’s own device.\u2029**Real banks** do not ask you to **dictate SMS or app codes** to a caller.',
  victimExperience:
    'While the call ran I was afraid every second of delay would **empty the account**; hanging up felt riskier than cooperating.',
  climax:
    'I hung up, dialled the **number on my card** from a second phone, and the agent said **no fraud alert** had been opened and **no colleague** had contacted me—that minute the other line went dead.',
  victimPain:
    'Recovering **savings** took affidavits and weeks of stress; I felt foolish for trusting the ID display until I learned how cheap **spoofing** is.',
  learningVictim:
    'I **never** give **OTPs** to inbound callers.\u2029I **hang up** and call the bank on a **number I look up** myself.',
  learningForReaders: [
    '**Banks** will not ask for your **full password** or **one-time codes** over the phone.',
    '**Report** vishing to your bank and **FTC** (US) or local fraud lines.',
  ],
};

export default content;
