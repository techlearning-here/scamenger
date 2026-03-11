# Multi-country support (#3b)

Scam Avenger supports **localized reporting authorities and help links** for multiple countries and regions. Users can choose their country to see official reporting links and support resources for their region.

## Supported countries and regions

| Region | Code | Where it appears |
|--------|------|------------------|
| United States | US | Default; full scam guides under /us/ |
| United Kingdom | GB | Help now, Report form, Emotional support |
| Canada | CA | Help now, Report form, Emotional support |
| Australia | AU | Help now, Report form, Emotional support |
| India | IN | Help now, Report form, Emotional support |
| European Union | EU | Help now, Report form, Emotional support (EU-level links) |
| Germany | DE | Help now, Report form, Emotional support |
| France | FR | Help now, Report form, Emotional support |
| Nigeria | NG | Help now, Report form, Emotional support |
| Philippines | PH | Help now, Report form, Emotional support |
| South Africa | ZA | Help now, Report form, Emotional support |
| Other / Unknown | OTHER | Fallback links |

## Where the country selector appears

1. **Report a scam form** (`/report/`) – Required "Country of scam origin" dropdown. Pre-filled from browser locale when possible.
2. **Need help now?** (`/help-now/`) – "Change country / region" dropdown. Shows official reporting links for the selected country (FTC/IC3 for US, Action Fraud for UK, Scamwatch for AU, etc.).
3. **Emotional support** (`/emotional-support/`) – Same country dropdown. Shows mental health and scam-victim support links for the selected country.
4. **Home page** – Mission block explains supported regions and links to Need help now? and Report a scam. Popular guides section notes that US guides are shown and points to Need help now? for other regions.

## Data and behaviour

- **Country options** are defined in `frontend/src/data/reports/countries.ts` (`COUNTRY_OPTIONS`). The same list is used for the report form, help-now, emotional-support, and admin report display.
- **Help links** per country are in `frontend/src/data/help-now.ts` (`HELP_LINKS_BY_COUNTRY`). Each entry includes official reporting portals (e.g. FTC, IC3, Action Fraud, Scamwatch, National Cyber Crime Portal for India, European Consumer Centres for EU).
- **Emotional support** sections per country are in `frontend/src/data/emotional-support.ts` (`getSupportSectionsForCountry`). Covers mental health/crisis and scam-victim support.
- **Report submissions** store `country_origin` as a string (e.g. `US`, `GB`, `EU`). No server-side allowlist; any value from the frontend dropdown is accepted.
- **Locale detection** (`getCountryFromLocale()`) pre-fills country from `navigator.language` / `navigator.languages` when it matches a supported code (e.g. `en-GB` → GB). EU is not inferred from locale; users select it manually.

## Adding a new country

1. Add `{ value: 'XX', label: 'Country Name' }` to `COUNTRY_OPTIONS` in `frontend/src/data/reports/countries.ts`.
2. Add a `XX` entry to `HELP_LINKS_BY_COUNTRY` in `frontend/src/data/help-now.ts` with official reporting links.
3. Add `XX_SECTIONS` and include `XX` in `SUPPORT_SECTIONS_BY_COUNTRY` in `frontend/src/data/emotional-support.ts` for mental health and victim support links.
4. Optionally add `XX` to the home page "Official reporting links and support for …" sentence in `frontend/app/page.tsx`.

No backend or database changes are required for new countries.
