'use client';

import dynamic from 'next/dynamic';
import type { ScamCategoryId } from '@/data/scams/types';

interface Topic {
  name: string;
  path: string;
  category: string;
  slug: string;
  categoryId: ScamCategoryId;
}

interface CountryTopicsClientLazyProps {
  usScamTopics: Topic[];
}

const CountryTopicsClient = dynamic(
  () => import('./CountryTopicsClient').then((m) => ({ default: m.CountryTopicsClient })),
  { ssr: false }
);

/**
 * Client wrapper that lazy-loads CountryTopicsClient with ssr: false.
 * Used from the Server Component homepage to avoid "ssr: false not allowed in Server Components" error.
 */
export function CountryTopicsClientLazy({ usScamTopics }: CountryTopicsClientLazyProps) {
  return <CountryTopicsClient usScamTopics={usScamTopics} />;
}
