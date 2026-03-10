import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryIntro } from '@/components/CategoryIntro';

describe('CategoryIntro', () => {
  it('renders heading, intro text, and steps heading', () => {
    render(
      <CategoryIntro
        intro="Intro paragraph."
        steps={['Step one', 'Step two']}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Summary & what to do' })).toBeInTheDocument();
    expect(screen.getByText('Intro paragraph.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What to do right now' })).toBeInTheDocument();
  });

  it('renders all steps in list', () => {
    render(
      <CategoryIntro
        intro="Intro"
        steps={['First', 'Second', 'Third']}
      />,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
    const list = screen.getByRole('list', { name: undefined });
    expect(list.querySelectorAll('li')).toHaveLength(3);
  });
});
