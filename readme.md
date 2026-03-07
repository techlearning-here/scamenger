directory site that teaches people how and where to report scams and corruption is much safer and very useful.

name of the site : scamenger.com (“Scam Avenger”)
What your site could do
Explain common scam types and then link people to the correct official reporting channels (for example, USA.gov “where to report a scam” for U.S. scams).
​

Help people find the right place to report online fraud (like IC3 for internet crime, or the FTC/CFPB for consumer issues).

Help with corruption/government issues by pointing to Inspector General hotlines and complaint portals (for example, USA.gov government agency complaints and OIG pages).

Example sections for your directory
You might structure it like this (starting with the U.S.):

“If you were scammed online”: explain basics, then link to IC3, FTC, state Attorney General.

“If it involves banks, credit cards, or loans”: link to CFPB complaint portal and relevant bank regulators.
​

“If someone pretends to be the IRS or Treasury”: link to IRS phishing address and Treasury scam reporting page.

“If it involves federal or state government corruption”: link to USA.gov’s pages on agency complaints and Inspector General hotlines.

Why this is lower risk
You are mostly aggregating and explaining links to official government and trusted sites instead of hosting accusations or “reviews” about specific people.

You can focus on education (“what to do if…”, “what info to collect before reporting”) and always send users to the official complaint form for the actual report.

build a U.S.‑focused directory site safely because you’ll just explain and link to official reporting channels, not collect accusations yourself.

Core idea for the U.S. site
Your site can answer: “I saw X type of scam or corruption – where do I report it, and what info should I have ready?”

Key agencies you’ll point to:

FTC – ReportFraud.ftc.gov for most consumer scams and bad business practices.

IC3 (FBI) for internet and online crime (phishing, online shopping fraud, crypto scams, etc.).

CFPB complaint portal for problems with banks, credit cards, loans, mortgage, etc.
​

USA.gov scam directory as a general “router” if people are unsure where to go.
​

Oversight.gov and specific Inspector General hotlines for federal corruption/waste.

Suggested page structure
You can start very simple with 4–5 main pages.

1. Home – “How to report scams in the USA”
2–3 short sections:

“Step 1 – Make sure you are safe” (tell them to stop contact and protect accounts).

“Step 2 – Collect details” (dates, amounts, phone numbers, URLs, screenshots).

“Step 3 – Use the right official form” with links out by category (see below).

2. Page: Online and phone scams
Explain common online/phone scams and then link:

Report general fraud: FTC ReportFraud.

Report internet crime: IC3.

Report phone/text scams (robocalls, spoofing): FCC complaints and USA.gov phone scam page.

3. Page: Financial and banking scams
For issues with bank accounts, cards, loans, debt collectors:

File a complaint with CFPB.
​

Check OCC/Fed/FDIC fraud resources and call local police/FBI if money was stolen.

You can list typical examples (fake bank texts, Zelle/transfer scams) and then send them to those links.

4. Page: Government impersonation and tax scams
IRS or Treasury impersonation: link to IRS phishing reporting and Treasury scam reporting.

Other “government imposter” scams: point back to FTC and IC3, and mention National Elder Fraud Hotline for older victims.

5. Page: Corruption, fraud, and waste in government
Focus on how to report to the right government body:

General federal waste/fraud/abuse: Oversight.gov where to report.
​

DOJ‑related issues or misconduct: DOJ OIG hotline.
​

Other agencies (HUD, OPM, USAID, etc.): link to a short list of key OIG hotlines (HUD OIG, OPM OIG, USAID OIG) and then to Oversight.gov for the rest.

Complaints about a federal or state agency in general: link to USA.gov “complain about a government agency”.
​

You can add a clear note that your site does not take reports, it only helps people find official channels.

Quick content template you can reuse
For each category page, you can repeat a simple structure:

“What this page is for” – 1–2 sentences.

“What to do right now” – short list (stop talking to scammer, save evidence, contact bank/police if needed).

“Where to report” – list 2–4 official links with one‑line explanations (who they are, what they do with reports)

You can position your site as a simple, friendly “front door” that explains options and then sends people to the right official U.S. channels.

## SEO and search engines

- **Sitemap:** The site generates a sitemap at `https://scamenger.com/sitemap-index.xml` (referenced in `public/robots.txt`). Submit this URL in [Google Search Console](https://search.google.com/search-console) (Sitemaps) and in Bing Webmaster Tools so search engines can discover and index your pages.
- **Canonical URLs:** Main pages (home, about, news, category pages, scam detail pages) use canonical links to avoid duplicate-content issues.
- **Internal links:** The homepage has a “Popular reporting guides” block; each category page lists scam types in that category with links to the detail pages. This helps crawlers and users find content.

For more ideas on **aggregating content from external sites** (RSS feeds, alerts, statistics), see [docs/aggregation-ideas.md](docs/aggregation-ideas.md).

## Refreshing the build every 2 days (news)

The **News** page pulls FTC/IC3/CFPB RSS at **build time**. To refresh news on your GitHub Pages site every 2 days:

1. **Use GitHub Actions for Pages.** In repo **Settings → Pages**, set Source to **GitHub Actions** (and ensure you have a workflow that deploys to GitHub Pages on push, e.g. as in DEPLOY.md).

2. **Scheduled workflow.** The workflow in `.github/workflows/scheduled-build.yml` runs on a cron every 2 days and on manual trigger. It builds the site (so news is refreshed) and deploys the result to GitHub Pages, so your live site updates with fresh news without a push.

Site role and positioning
Your site does not take reports; it explains “if X happened, here’s who you contact and what info to bring,” then links to official portals like USA.gov’s scam tool and IC3.

You cover both scams and corruption by routing people to consumer agencies (FTC, CFPB, FCC, etc.) and to Inspector General hotlines and complaint pages.

Key U.S. pages to link
You can organize your directory around these main “destinations”:

General scam routing: USA.gov “Where to report a scam”.
​

Online / internet crime: IC3 – FBI Internet Crime Complaint Center.
​

Consumer/business scams: FTC ReportFraud / IdentityTheft.gov and identity theft help.

Financial products (banks, cards, loans): CFPB complaint portal.
​

Phone/text scams and robocalls: FCC consumer complaints and USA.gov phone scam complaint page.

Tax / IRS / Treasury scams: IRS phishing reporting and Treasury scam attempts page.

Government agency problems (service complaints): USA.gov “complain about a government agency”.
​

Federal fraud, waste, abuse, corruption: Oversight.gov “where to report fraud, waste, abuse, or retaliation” and specific OIG hotlines (DOJ OIG, USAID OIG, Treasury OIG, etc.).

Simple content pattern for each directory entry
For each of these, your site can use a short, repeatable block:

Who they are: One line like “The FTC collects reports of scams and shares them with law enforcement.”

When to use it: One line like “Use this if you lost money to a scammer or someone tried to trick you into sending money or personal info.”

What to prepare: List items like dates, amounts, phone numbers/email, screenshots, and how you paid.

Link / button: “Go to official site to report” that opens the agency’s page in a new tab.

Example table for your homepage
You could have a simple table like this on the U.S. homepage:

Situation	Where to go (official)
Situation	Where to go (official)
Online scam, phishing, hacked account	IC3 – FBI internet crime
Fake business, shopping scam, fraud calls	FTC ReportFraud
Bank / card / loan problem or scam	CFPB complaint
IRS or Treasury‑looking email / call	IRS phishing
Problem with a government agency	USA.gov agency complaints
Corruption / waste inside federal programs	Oversight.gov where to report
