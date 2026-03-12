import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SiteNav } from '@/components/SiteNav';

vi.mock('next/image', () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} />
  ),
}));

vi.mock('@/components/NavReportScamLink', () => ({
  NavReportScamLink: () => null,
}));

describe('SiteNav', () => {
  it('renders logo with site name and Av highlighted', () => {
    render(<SiteNav />);
    const logo = screen.getByRole('link', { name: /Scam Avenger – Home/i });
    expect(logo).toHaveAttribute('href', '/');
    expect(logo).toHaveClass('site_nav_logo');
    expect(logo).toHaveTextContent('Scam');
    expect(logo).toHaveTextContent('Av');
    expect(logo).toHaveTextContent('enger');
    const av = screen.getByText('Av');
    expect(av).toHaveClass('brand-av');
  });

  it('renders Get help dropdown trigger', () => {
    render(<SiteNav />);
    const trigger = screen.getByText('Get help').closest('button');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
  });

  it('renders Get help submenu links', () => {
    render(<SiteNav />);
    expect(screen.getByRole('menuitem', { name: 'Look up report', hidden: true })).toHaveAttribute('href', '/lookup-report');
    expect(screen.getByRole('menuitem', { name: 'Emotional support', hidden: true })).toHaveAttribute('href', '/emotional-support');
    expect(screen.getByRole('menuitem', { name: 'Immediate response', hidden: true })).toHaveAttribute('href', '/immediate-help');
  });

  it('renders main nav links in menu', () => {
    render(<SiteNav />);
    const home = screen.getByRole('link', { name: 'Home', hidden: true });
    expect(home).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'News', hidden: true })).toHaveAttribute('href', '/news');
    expect(screen.getByRole('link', { name: 'About', hidden: true })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Contact', hidden: true })).toHaveAttribute('href', '/contact');
  });

  it('toggles hamburger menu', () => {
    render(<SiteNav />);
    const menuButton = screen.getByRole('button', { name: /Open menu/i });
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main');
    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: /Close menu/i })).toBeInTheDocument();
  });
});
