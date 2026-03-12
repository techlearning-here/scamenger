'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavReportScamLink } from '@/components/NavReportScamLink';

/**
 * Main site navigation with logo, links, and mobile hamburger menu.
 */
export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="site_nav" aria-label="Main">
      <div className="site_nav_mobile_header">
        <Link href="/" className="site_nav_logo" aria-label="Scam Avenger – Home">
          <Image src="/icon.png" alt="" width={40} height={40} className="site_nav_logo_img" />
          <span className="site_nav_logo_text">Scam Avenger</span>
        </Link>
        <button
          type="button"
          className="site_nav_toggle"
          aria-expanded={menuOpen}
          aria-controls="site_nav_menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="site_nav_toggle_bar" />
          <span className="site_nav_toggle_bar" />
          <span className="site_nav_toggle_bar" />
        </button>
      </div>
      <div
        id="site_nav_menu"
        className="site_nav_menu"
        data-open={menuOpen}
        hidden={!menuOpen}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) setMenuOpen(false);
        }}
      >
        <Link href="/">Home</Link>
        <Link href="/lookup-report/">Look up report</Link>
        <Link href="/emotional-support/">Emotional support</Link>
        <Link href="/news/">News</Link>
        <Link href="/about/">About</Link>
        <Link href="/contact/">Contact</Link>
        <NavReportScamLink />
      </div>
    </nav>
  );
}
