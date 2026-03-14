import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToolsClient } from './ToolsClient';

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: () => null }),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

describe('ToolsClient', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
  });

  it('renders print button with accessible label', () => {
    render(<ToolsClient countryFromUrl="US" />);
    const printBtn = screen.getByRole('button', { name: /Print tool list/i });
    expect(printBtn).toBeInTheDocument();
  });

  it('renders jump links section', () => {
    render(<ToolsClient countryFromUrl="US" />);
    const nav = screen.getByRole('navigation', { name: /Jump to section/i });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveTextContent(/Jump to:/i);
  });

  it('renders filter by tag controls', () => {
    render(<ToolsClient countryFromUrl="US" />);
    expect(screen.getByText(/Show tools with tag:/i)).toBeInTheDocument();
    const select = screen.getByRole('combobox', { name: /Filter tools by tag/i });
    expect(select).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Prevent/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Free/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /For victims/i })).toBeInTheDocument();
  });

  it('renders tool count for country', () => {
    render(<ToolsClient countryFromUrl="US" />);
    expect(screen.getByText(/tools for United States/i)).toBeInTheDocument();
  });

  it('renders Report a scam to Scam Avenger with Scamenger.com site name', () => {
    render(<ToolsClient countryFromUrl="US" />);
    const link = screen.getByRole('link', { name: /Report a scam to Scam Avenger/i });
    expect(link).toHaveAttribute('href', '/report/');
    expect(screen.getByText('Scamenger.com')).toBeInTheDocument();
  });

  it('renders device and account protection section with four guide links', () => {
    render(<ToolsClient countryFromUrl="US" />);
    expect(screen.getByRole('heading', { name: /Protect yourself from hackers/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Protect your phone/i })).toHaveAttribute('href', '/tools/protect-phone/');
    expect(screen.getByRole('link', { name: /Protect your laptop/i })).toHaveAttribute('href', '/tools/protect-laptop/');
    expect(screen.getByRole('link', { name: /Protect your bank account/i })).toHaveAttribute('href', '/tools/protect-bank-account/');
    expect(screen.getByRole('link', { name: /Protect your credit card/i })).toHaveAttribute('href', '/tools/protect-credit-card/');
  });

  it('renders books card in device-protection section with link to books page', () => {
    render(<ToolsClient countryFromUrl="US" />);
    expect(screen.getByRole('heading', { name: /Protect yourself from hackers/i })).toBeInTheDocument();
    const booksLink = screen.getByRole('link', { name: /Books.*free websites/i });
    expect(booksLink).toHaveAttribute('href', '/tools/books/');
  });
});
