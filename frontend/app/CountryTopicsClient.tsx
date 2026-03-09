'use client';

import { useEffect, useRef, useState } from 'react';
import type { ScamCategoryId } from '@/data/scams/types';
import { SCAM_CATEGORY_ICONS } from '@/data/scams/icons';
import { SCAM_CATEGORY_LABELS } from '@/data/scams/types';
import { ScamCard } from '@/components/ScamCard';

const STORAGE_KEY = 'scam-avenger-country';

interface Topic {
  name: string;
  path: string;
  category: string;
  slug: string;
  categoryId: ScamCategoryId;
}

interface CountryPage {
  name: string;
  topics: Topic[];
}

const CATEGORY_ORDER: ScamCategoryId[] = [
  'online', 'phone', 'financial', 'impersonation', 'employment', 'housing',
  'prizes_charity', 'identity_benefits', 'government', 'emerging', 'other',
];

export function CountryTopicsClient({
  usScamTopics,
}: {
  usScamTopics: Topic[];
}) {
  const [mounted, setMounted] = useState(false);
  const countryPages: Record<string, CountryPage> = {
    us: { name: 'United States', topics: usScamTopics },
  };

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <CountrySelect countryPages={countryPages} />
  );
}

function groupTopicsByCategory(topics: Topic[]): { categoryId: ScamCategoryId; label: string; icon: string; topics: Topic[] }[] {
  const byCategory = new Map<ScamCategoryId, Topic[]>();
  for (const t of topics) {
    const list = byCategory.get(t.categoryId) ?? [];
    list.push(t);
    byCategory.set(t.categoryId, list);
  }
  const orderIndex = Object.fromEntries(CATEGORY_ORDER.map((c, i) => [c, i]));
  return CATEGORY_ORDER
    .filter((id) => byCategory.has(id))
    .map((categoryId) => ({
      categoryId,
      label: SCAM_CATEGORY_LABELS[categoryId],
      icon: SCAM_CATEGORY_ICONS[categoryId],
      topics: byCategory.get(categoryId)!,
    }));
}

function CountrySelect({ countryPages }: { countryPages: Record<string, CountryPage> }) {
  const [selected, setSelected] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = (() => {
      try {
        return typeof window !== 'undefined' ? window.sessionStorage?.getItem(STORAGE_KEY) : null;
      } catch {
        return null;
      }
    })();
    if (saved && countryPages[saved]) setSelected(saved);
  }, [countryPages]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    try {
      if (value) sessionStorage.setItem(STORAGE_KEY, value);
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const country = selected ? countryPages[selected] : null;
  const groups = country ? groupTopicsByCategory(country.topics) : [];

  return (
    <section className="country-section">
      <h2>Choose your country</h2>
      <p>Select a country to see types of scams. Click a scam type to see its details and find where to report.</p>
      <label htmlFor="country-select" className="sr-only">Country</label>
      <select
        id="country-select"
        className="country-select"
        aria-label="Select country"
        value={selected}
        onChange={handleChange}
      >
        <option value="">-- Select a country --</option>
        <option value="us">United States</option>
      </select>
      <div id="topics-wrap" className="topics-wrap" ref={wrapRef} hidden={!country}>
        <h3>Types of scams by category</h3>
        {groups.map(({ categoryId, label, icon, topics: categoryTopics }) => (
          <div key={categoryId} className="topics-category-block">
            <h4 className="topics-category-heading">
              <span className="topics-category-icon" aria-hidden="true">{icon}</span>
              {label}
            </h4>
            <ul className="scam-cards-grid">
              {categoryTopics.map((topic) => (
                <ScamCard
                  key={topic.slug}
                  slug={topic.slug}
                  name={topic.name}
                  category={topic.categoryId}
                  href={topic.path}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
