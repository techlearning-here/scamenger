# How to Get Google AdSense IDs for This Project

This guide explains how to obtain the values for `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT_TOP`, `NEXT_PUBLIC_ADSENSE_SLOT_MAIN`, and `NEXT_PUBLIC_ADSENSE_SLOT_MID` from Google AdSense.

---

## Site verification: which method to choose

When AdSense asks you to **Select verification method**, you’ll see:

| Method | What it is | Best for this project |
|--------|------------|------------------------|
| **AdSense code snippet** | A `<script>` tag that loads AdSense. | Use if you prefer one snippet for both verification and ads. Once you add `NEXT_PUBLIC_ADSENSE_CLIENT` and deploy, the app already injects this script, so verification may succeed without extra steps. |
| **Ads.txt snippet** | A line in a file at `https://yourdomain.com/ads.txt` that authorizes Google to sell ads on your site. | Use **after** verification if AdSense asks for it (often required for payment). See [Ads.txt](#4-ads-txt-optional-after-approval) below. |
| **Meta tag** | A `<meta name="google-site-verification" content="...">` in your site’s `<head>`. | **Recommended.** Easiest with Next.js: add the code to env and the app puts the tag in the layout. No extra files. |

**Recommendation:** Choose **Meta tag**. Google will show you a meta tag like:

```html
<meta name="google-site-verification" content="AbCdEfGhIjKlMnOpQrStUvWxYz1234567890" />
```

Copy only the **content** value (the long string). Then either:

- Add it to `.env.local` (and your host’s env) as:
  ```bash
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
  ```
  The app will output the meta tag in the root layout. Redeploy and click **Verify** in AdSense.

- Or add it in code: in `app/layout.tsx`, set `metadata.verification.google` to that string (see layout file).

After you add the meta tag and deploy, go back to AdSense and click **Verify**.

---

## Prerequisites

- A Google account
- Your site live and compliant with [AdSense program policies](https://support.google.com/adsense/answer/48182)
- AdSense account approved for your site (sign up at [google.com/adsense](https://www.google.com/adsense/))

---

## 1. Get your Publisher ID (`NEXT_PUBLIC_ADSENSE_CLIENT`)

The **publisher ID** (also called **client ID**) is the `ca-pub-XXXXXXXXXXXXXXXX` value. It is the same for your whole account.

### Steps

1. Go to [Google AdSense](https://www.google.com/adsense/) and sign in.
2. Click **Account** (gear icon or “Account” in the left menu).
3. Open **Account information** (or **Settings** → **Account**).
4. Find **Publisher ID**. It looks like: `ca-pub-1234567890123456`.

### Use in this project

- Set in `.env` or `.env.local`:
  ```bash
  NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
  ```
- Replace `1234567890123456` with your actual publisher ID.

---

## 2. Create ad units and get slot IDs

**Slot IDs** come from **ad units**. Each ad unit has a numeric slot ID (e.g. `1234567890`). You need at least one ad unit; you can use one for all placements or create separate units for top, main, and mid.

### Option A: One ad unit (simplest)

1. In AdSense, go to **Ads** → **By ad unit** (or **Ad units**).
2. Click **Display ads** (or **Create ad unit**).
3. Choose **Display ads** (or “Display”).
4. Set a name, e.g. `Scam Avenger – Display`.
5. Choose size/type (e.g. **Responsive**).
6. Create the ad unit.
7. Open the new ad unit and find the **Ad unit ID** (numeric, e.g. `1234567890`).

Use this **same** ID for all three env vars:

```bash
NEXT_PUBLIC_ADSENSE_SLOT_TOP=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_MAIN=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_MID=1234567890
```

Or leave `NEXT_PUBLIC_ADSENSE_SLOT_TOP` and `NEXT_PUBLIC_ADSENSE_SLOT_MID` unset; the app will fall back to the main slot.

### Option B: Separate ad units (for reporting and optimization)

Create three display ad units and use one ID per placement.

| Env variable | Placement in the app | Suggested ad unit name |
|--------------|----------------------|-------------------------|
| `NEXT_PUBLIC_ADSENSE_SLOT_TOP` | Below header (top) | e.g. “Scam Avenger – Top” |
| `NEXT_PUBLIC_ADSENSE_SLOT_MAIN` | Below content, above footer | e.g. “Scam Avenger – Main” |
| `NEXT_PUBLIC_ADSENSE_SLOT_MID` | Mid-content on story/scam pages | e.g. “Scam Avenger – Mid” |

**Steps for each unit**

1. **Ads** → **By ad unit** → **Display ads** (or **Create ad unit**).
2. Choose **Display ads**.
3. Name it (e.g. “Scam Avenger – Top”).
4. Type: **Responsive** (recommended).
5. Create and copy the **Ad unit ID** (numeric).

Then in `.env`:

```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
NEXT_PUBLIC_ADSENSE_SLOT_TOP=1111111111
NEXT_PUBLIC_ADSENSE_SLOT_MAIN=2222222222
NEXT_PUBLIC_ADSENSE_SLOT_MID=3333333333
```

Use your real publisher ID and the three ad unit IDs you created.

---

## 3. Where the slot IDs appear in the app

| Env variable | Where ads show |
|--------------|----------------|
| `NEXT_PUBLIC_ADSENSE_SLOT_TOP` | Below the site header on non-index pages. |
| `NEXT_PUBLIC_ADSENSE_SLOT_MAIN` | Above the footer on non-index pages. |
| `NEXT_PUBLIC_ADSENSE_SLOT_MID` | In the middle of long content (story pages and US scam guide pages). |

Ads are **not** shown on: home (`/`), tools index (`/tools/`), books index (`/tools/books/`), or stories index (`/stories/`).

---

## 4. Ads.txt (optional, after approval)

**Ads.txt** is a file at `https://yourdomain.com/ads.txt` that declares which ad networks are allowed to sell inventory on your site. AdSense may ask you to add it after verification.

1. In AdSense, go to **Account** → **Settings** → **Ads.txt** (or look for the “Get your ads.txt snippet” / “Ads.txt” section).
2. Google will show a line like:
   ```text
   google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
   ```
3. In this Next.js app, create a file `app/ads.txt` (or use a route that returns plain text). For a static line, you can use a route:

   - **Option A:** Create `app/ads.txt/route.ts` that returns the line (so the URL is `/ads.txt`).
   - **Option B:** Put the content in `public/ads.txt` so it is served at `/ads.txt`.

   For Option B, create `frontend/public/ads.txt` with exactly the line Google gives you (and nothing else unless you add more networks later).

4. Deploy and confirm `https://yourdomain.com/ads.txt` returns that line.

---

## 5. Finding the IDs in the AdSense code snippet (alternative)

When you create an ad unit, AdSense can show a code snippet like:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="9876543210"
     ...></ins>
```

- **Publisher ID** = value of `client=` or `data-ad-client=` → `ca-pub-1234567890123456` → use for `NEXT_PUBLIC_ADSENSE_CLIENT`.
- **Slot ID** = value of `data-ad-slot=` → `9876543210` → use for the corresponding `NEXT_PUBLIC_ADSENSE_SLOT_*` (top, main, or mid).

---

## 6. Example `.env` / `.env.local`

Minimum (one ad unit for all placements):

```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
NEXT_PUBLIC_ADSENSE_SLOT_MAIN=1234567890
```

Full (three separate units):

```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
NEXT_PUBLIC_ADSENSE_SLOT_TOP=1111111111
NEXT_PUBLIC_ADSENSE_SLOT_MAIN=2222222222
NEXT_PUBLIC_ADSENSE_SLOT_MID=3333333333
```

---

## 7. Checklist

- [ ] **Site verification** done (meta tag recommended: set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and deploy, then click Verify in AdSense).
- [ ] AdSense account approved for your domain.
- [ ] Publisher ID (`ca-pub-...`) set as `NEXT_PUBLIC_ADSENSE_CLIENT`.
- [ ] At least one ad unit created and its ID set as `NEXT_PUBLIC_ADSENSE_SLOT_MAIN`.
- [ ] (Optional) Separate units for top/mid and IDs set in `NEXT_PUBLIC_ADSENSE_SLOT_TOP` and `NEXT_PUBLIC_ADSENSE_SLOT_MID`.
- [ ] Env vars added in `.env.local` (local) or in your host’s env config (e.g. Vercel) and app restarted/redeployed.

---

## 8. Useful links

- [AdSense Help – Get started](https://support.google.com/adsense/answer/7477845)
- [AdSense – Create ad units](https://support.google.com/adsense/answer/9183569)
- [AdSense program policies](https://support.google.com/adsense/answer/48182)

Google’s UI may change; if a menu or label is different, look for “Account” / “Publisher ID” and “Ads” / “Ad units” / “Ad unit ID” in the current AdSense interface.
