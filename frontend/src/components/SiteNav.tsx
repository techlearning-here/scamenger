'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavReportScamLink } from '@/components/NavReportScamLink';

/**
 * Main site navigation with logo, links, and mobile hamburger menu.
 * "Get help" groups: Look up report, Emotional support, Immediate response.
 */
export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) setHelpOpen(false);
  }, [menuOpen]);

  useEffect(() => {
    if (!helpOpen) return;
    const close = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [helpOpen]);

  return (
    <nav className="site_nav" aria-label="Main">
      <div className="site_nav_mobile_header">
        <Link href="/" className="site_nav_logo" aria-label="Scam Avenger – Home">
          <Image src="/icon.png" alt="" width={40} height={40} className="site_nav_logo_img" />
          <span className="site_nav_logo_text">Scam <span className="brand-av">Av</span>enger</span>
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
        <div className="site_nav_dropdown" ref={helpRef}>
          <button
            type="button"
            className="site_nav_dropdown_trigger"
            aria-expanded={helpOpen}
            aria-haspopup="true"
            aria-controls="site_nav_get_help_menu"
            id="site_nav_get_help_trigger"
            onClick={(e) => {
              e.stopPropagation();
              setHelpOpen((o) => !o);
            }}
          >
            Get help
            <span className="site_nav_dropdown_icon" aria-hidden="true">▾</span>
          </button>
          <div
            id="site_nav_get_help_menu"
            className="site_nav_dropdown_menu"
            role="menu"
            aria-labelledby="site_nav_get_help_trigger"
            data-open={helpOpen}
          >
            <Link href="/lookup-report/" role="menuitem">Look up report</Link>
            <Link href="/emotional-support/" role="menuitem">Emotional support</Link>
            <Link href="/immediate-help/" role="menuitem">Immediate response</Link>
          </div>
        </div>
        <Link href="/tools/">Tools</Link>
        <Link href="/news/">News</Link>
        <Link href="/about/">About</Link>
        <Link href="/contact/">Contact</Link>
        <NavReportScamLink />
      </div>
    </nav>
  );
}
