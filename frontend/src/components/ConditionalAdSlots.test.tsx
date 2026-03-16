import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ConditionalAdTop, ConditionalAdBottom } from '@/components/ConditionalAdSlots';
import { usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('ConditionalAdSlots', () => {
  it('renders nothing when pathname is null (SSR-safe)', () => {
    vi.mocked(usePathname).mockReturnValue(null as unknown as string);
    const { container } = render(
      <>
        <ConditionalAdTop client="ca-pub-x" slot="123" />
        <ConditionalAdBottom client="ca-pub-x" slot="123" />
      </>
    );
    expect(container.querySelector('.ad_container')).not.toBeInTheDocument();
    expect(container.querySelector('.adsbygoogle')).not.toBeInTheDocument();
  });

  it('renders nothing on no-ads path (homepage)', () => {
    vi.mocked(usePathname).mockReturnValue('/');
    const { container } = render(
      <>
        <ConditionalAdTop client="ca-pub-x" slot="123" />
        <ConditionalAdBottom client="ca-pub-x" slot="123" />
      </>
    );
    expect(container.querySelector('.ad_container')).not.toBeInTheDocument();
  });

  it('renders ad slots on a non-excluded path', () => {
    vi.mocked(usePathname).mockReturnValue('/us/scams/phishing/');
    render(
      <>
        <ConditionalAdTop client="ca-pub-x" slot="123" />
        <ConditionalAdBottom client="ca-pub-x" slot="456" />
      </>
    );
    const containers = document.querySelectorAll('.ad_container');
    expect(containers.length).toBe(2);
    const ins = document.querySelectorAll('.adsbygoogle');
    expect(ins.length).toBe(2);
    expect(ins[0]).toHaveAttribute('data-ad-client', 'ca-pub-x');
    expect(ins[0]).toHaveAttribute('data-ad-slot', '123');
    expect(ins[1]).toHaveAttribute('data-ad-slot', '456');
  });

  it('renders nothing for /stories/ and /tools/', () => {
    for (const path of ['/stories/', '/stories', '/tools/', '/tools']) {
      vi.mocked(usePathname).mockReturnValue(path);
      const { container } = render(
        <ConditionalAdTop client="ca-pub-x" slot="123" />
      );
      expect(container.querySelector('.ad_container')).not.toBeInTheDocument();
    }
  });
});
