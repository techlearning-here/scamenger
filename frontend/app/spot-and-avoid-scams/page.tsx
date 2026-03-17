import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://scamenger.com';
const defaultOgImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&h=630&auto=format&fit=crop';

export const metadata: Metadata = {
  title: 'How to Spot and Avoid Scams | Scam Avenger',
  description: 'Learn what a scam is, common warning signs, and how to protect yourself. Stop, check, and protect—plus what to do if you\'ve been targeted.',
  keywords: 'spot scams, avoid scams, scam warning signs, fraud prevention, how to spot fraud, protect yourself from scams',
  alternates: { canonical: `${siteUrl}/spot-and-avoid-scams/` },
  openGraph: {
    title: 'How to Spot and Avoid Scams | Scam Avenger',
    description: 'Learn common warning signs and how to protect yourself from scams and fraud.',
    url: `${siteUrl}/spot-and-avoid-scams/`,
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: 'Spot and avoid scams – Scam Avenger' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Spot and Avoid Scams | Scam Avenger',
    description: 'Learn common warning signs and how to protect yourself from scams.',
    images: [defaultOgImage],
  },
};

const SPOT_AVOID_HERO_IMAGE = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&h=400&q=80';

const COMMON_SIGNS: { title: string; body: string }[] = [
  {
    title: 'It\'s an amazing opportunity to make or save money',
    body: 'Scammers make you believe you\'re getting an incredible deal and pressure you to act quickly so you don\'t miss out. If it seems too good to be true, it usually is.',
  },
  {
    title: 'Someone you haven\'t met needs your help—and money',
    body: 'They use emotional or tragic stories to get you to send money. Be wary of any request for money. Don\'t send more than you can afford to lose unless you can independently confirm the story.',
  },
  {
    title: 'The message contains links or attachments',
    body: 'Don\'t click links or open attachments from emails or texts without checking. Verify the sender. When in doubt, go to the website or app yourself instead of clicking a link.',
  },
  {
    title: 'You feel pressured to act quickly',
    body: 'Scammers don\'t want you to think. They rush you by saying you\'ll miss out or that something bad will happen. Slow down and verify before you act.',
  },
  {
    title: 'They ask you to pay in unusual ways',
    body: 'Requests for payment via gift cards, prepaid cards, or cryptocurrency are huge red flags. Once sent, that money is usually gone for good.',
  },
  {
    title: 'They ask you to set up new accounts or payment IDs',
    body: 'If someone wants you to open a new bank account or payment profile to pay them (or receive payment), be very suspicious. Your bank won\'t ask you to open new accounts to "keep your money safe."',
  },
];

export default function SpotAndAvoidScamsPage() {
  return (
    <div className="spot-avoid-page">
      <nav className="back" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="back-sep"> / </span>
        <span>Spot and avoid scams</span>
      </nav>

      <header className="spot-avoid-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SPOT_AVOID_HERO_IMAGE}
          alt=""
          width={1200}
          height={400}
          className="spot-avoid-hero-img"
        />
        <div className="spot-avoid-hero-overlay">
          <h1 id="spot-avoid-heading" className="spot-avoid-hero-title">
            Help to spot and avoid scams
          </h1>
          <p className="spot-avoid-hero-tagline">
            Learn the warning signs and how to protect yourself—before you act.
          </p>
        </div>
      </header>

      <div className="spot-avoid-intro">
        <p className="spot-avoid-intro-lead">
          Scams work because they look like the real thing, and scammers often contact you when you&apos;re busy or not expecting it. Criminals use new technology, new products, and major events to create believable stories that pressure you into giving money or personal details.
        </p>
        <p>
          Always <strong>stop and check</strong> before you act. Scammers rely on you missing warning signs because you&apos;re in a hurry, don&apos;t want to miss a &quot;great deal,&quot; or because the message seems to come from someone you trust.
        </p>
      </div>

      <nav className="spot-avoid-toc" aria-label="On this page">
        <ul className="spot-avoid-toc-list">
          <li><a href="#what-is-a-scam">What is a scam?</a></li>
          <li><a href="#common-signs">Common signs of a scam</a></li>
          <li><a href="#follow-up-scams">Watch out for follow-up scams</a></li>
          <li><a href="#stop-check-protect">Stop – Check – Protect</a></li>
        </ul>
      </nav>

      <section className="spot-avoid-section spot-avoid-what-is" aria-labelledby="what-is-a-scam">
        <h2 id="what-is-a-scam" className="spot-avoid-section-title">What is a scam?</h2>
        <p className="spot-avoid-what-is-intro">
          Scams are economic crimes run by people who are often organised and sophisticated.
        </p>
        <div className="spot-avoid-definition-boxes">
          <div className="spot-avoid-def-box spot-avoid-def-is">
            <p>
              <strong className="spot-avoid-def-is-phrase" style={{ color: '#b50909' }}>A scam is</strong> when someone deceives you into giving money or personal/financial details so they can steal from you.
            </p>
          </div>
          <div className="spot-avoid-def-box spot-avoid-def-not">
            <p>
              <strong className="spot-avoid-def-not-phrase" style={{ color: '#b50909' }}>A scam is not</strong> someone hacking your device, buying something poor quality, or simply overpaying. Not every bad experience is a scam—consumer law may apply. But deliberate trickery for money or details is a scam.
            </p>
          </div>
        </div>
      </section>

      <section className="spot-avoid-section" aria-labelledby="common-signs">
        <h2 id="common-signs" className="spot-avoid-section-title">Common signs of a scam</h2>
        <p className="spot-avoid-section-intro">It can be hard to spot a scam, but these warning signs can help:</p>
        <div className="spot-avoid-accordion">
          {COMMON_SIGNS.map((sign, index) => (
            <details key={index} className="spot-avoid-accordion-item">
              <summary className="spot-avoid-accordion-summary">
                <span className="spot-avoid-accordion-icon" aria-hidden="true" />
                <span className="spot-avoid-accordion-title">{sign.title}</span>
              </summary>
              <div className="spot-avoid-accordion-content">
                <p className="spot-avoid-sign-body">{sign.body}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="spot-avoid-section spot-avoid-follow-up" aria-labelledby="follow-up-scams">
        <h2 id="follow-up-scams" className="spot-avoid-section-title">Watch out for follow-up scams</h2>
        <p>
          If scammers have already taken your money or details, they often try again. Sadly, many victims are targeted more than once. Be especially careful if someone contacts you offering to &quot;help you get your money back&quot;—that can be another scam. If you&apos;ve been affected, follow our <Link href="/immediate-help/">Immediate response (0–24 hours)</Link> steps and get <Link href="/emotional-support/">emotional support</Link> if you need it. <Link href="/report/">Report the scam</Link> and see <Link href="/help-now/">Need help now?</Link> for official links by country.
        </p>
      </section>

      <section className="spot-avoid-actions" aria-labelledby="stop-check-protect">
        <h2 id="stop-check-protect" className="spot-avoid-actions-title">Stop – Check – Protect</h2>
        <div className="spot-avoid-actions-grid" role="list">
          <div className="spot-avoid-action-card" role="listitem">
            <div className="spot-avoid-action-header">
              <span className="spot-avoid-action-icon" aria-hidden="true">🛑</span>
              <strong className="spot-avoid-action-heading" role="heading" aria-level={3}>Stop</strong>
            </div>
            <p>Don&apos;t give money or personal information to anyone if you&apos;re unsure.</p>
          </div>
          <div className="spot-avoid-action-card" role="listitem">
            <div className="spot-avoid-action-header">
              <span className="spot-avoid-action-icon" aria-hidden="true">🔍</span>
              <strong className="spot-avoid-action-heading" role="heading" aria-level={3}>Check</strong>
            </div>
            <p>Ask yourself: could this message or call be fake?</p>
          </div>
          <div className="spot-avoid-action-card" role="listitem">
            <div className="spot-avoid-action-header">
              <span className="spot-avoid-action-icon" aria-hidden="true">🛡️</span>
              <strong className="spot-avoid-action-heading" role="heading" aria-level={3}>Protect</strong>
            </div>
            <p>Act quickly if a scammer has your money—contact your bank and <Link href="/report/">report the scam</Link>. Use <Link href="/help-now/">Need help now?</Link> for official reporting links.</p>
          </div>
        </div>
      </section>

      <div className="spot-avoid-related">
        <p className="spot-avoid-related-heading">Next steps</p>
        <p>
          <Link href="/stories/">Read real scam stories</Link> to learn from others&apos; experiences, or <Link href="/tools/">explore our tools</Link> to protect your devices and accounts.
        </p>
      </div>
    </div>
  );
}
