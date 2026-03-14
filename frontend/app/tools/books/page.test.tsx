import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ToolsBooksPage from './page';
import { BOOK_ENTRIES, WEBSITE_ENTRIES } from '@/data/books';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe('Tools books page', () => {
  it('renders books section with at least one book title and seller domain', () => {
    render(<ToolsBooksPage />);
    const firstBook = BOOK_ENTRIES[0];
    expect(screen.getByText(firstBook.title)).toBeInTheDocument();
    const amazonLinks = screen.getAllByText(/View on amazon\.com →/);
    expect(amazonLinks.length).toBeGreaterThan(0);
  });

  it('renders all book titles from data', () => {
    render(<ToolsBooksPage />);
    for (const book of BOOK_ENTRIES) {
      expect(screen.getByText(book.title)).toBeInTheDocument();
    }
  });

  it('renders Free websites section with site names and domains', () => {
    render(<ToolsBooksPage />);
    expect(screen.getByRole('heading', { name: /Free websites & tools/i })).toBeInTheDocument();
    const educationSite = WEBSITE_ENTRIES.find((s) => s.category === 'education-tools');
    expect(educationSite).toBeDefined();
    expect(screen.getByText(educationSite!.name)).toBeInTheDocument();
  });

  it('renders jump links to Books and Free websites', () => {
    render(<ToolsBooksPage />);
    const jumpNav = screen.getByRole('navigation', { name: /Jump to section/i });
    expect(jumpNav).toBeInTheDocument();
    expect(jumpNav.querySelector('a[href="#books-heading"]')).toHaveTextContent('Books');
    expect(jumpNav.querySelector('a[href="#websites-heading"]')).toHaveTextContent(/Free websites/);
  });
});
