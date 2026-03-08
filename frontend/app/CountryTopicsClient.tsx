'use client';

import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'scam-avenger-country';

interface Topic {
  name: string;
  path: string;
  category: string;
}

interface CountryPage {
  name: string;
  topics: Topic[];
}

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

function CountrySelect({ countryPages }: { countryPages: Record<string, CountryPage> }) {
  const [selected, setSelected] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

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

  useEffect(() => {
    const value = selected;
    const country = countryPages[value];
    const wrap = wrapRef.current;
    const tbody = tbodyRef.current;
    if (!wrap || !tbody) return;
    if (!country) {
      wrap.hidden = true;
      return;
    }
    tbody.innerHTML = '';
    country.topics.forEach((topic, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="sn-cell">${index + 1}</td>
        <td><a href="${topic.path}">${topic.name}</a></td>
        <td class="category-cell">${topic.category}</td>
        <td><a href="${topic.path}" class="action-link">View details</a></td>
      `;
      tbody.appendChild(tr);
    });
    wrap.hidden = false;
  }, [selected, countryPages]);

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
      <div id="topics-wrap" className="topics-wrap" ref={wrapRef} hidden>
        <h3>Types of scams by category</h3>
        <div className="table-wrap">
          <table className="topics-table" id="topics-table">
            <thead>
              <tr>
                <th className="sn-col">#</th>
                <th>Scam type</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="topics-body" ref={tbodyRef} />
          </table>
        </div>
      </div>
    </section>
  );
}
