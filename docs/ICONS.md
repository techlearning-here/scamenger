# Favicon and app icons

This document describes how **Scam Avenger** uses favicon and app icons, where the files live, and how to change them.

---

## What these icons are for

| Use | File(s) | Where it shows |
|-----|--------|----------------|
| **Favicon** | `icon.png` | Browser tab, bookmarks, history |
| **Apple touch icon** | `apple-icon.png` | Home screen when users “Add to Home Screen” on iOS/macOS |
| **favicon.ico** | `app/favicon.ico` | Fallback favicon (Next.js auto-detects). |
| **PWA / manifest icons** | `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png` | Used by `manifest.json` for “Add to Home Screen” and install prompts. |
| **Schema/SEO** | Same icon URL | Structured data (e.g. `logo` in JSON-LD) |

---

## Where the files live

Icons are kept in **two places** so both Next.js and direct URLs work:

| Location | Purpose |
|----------|--------|
| **`frontend/app/icon.png`** | Next.js App Router uses this as the default favicon (auto-generated `<link>` tags). |
| **`frontend/app/apple-icon.png`** | Next.js uses this for the Apple touch icon. |
| **`frontend/public/icon.png`** | Served at `/icon.png`; used by `metadata.icons` and when the browser requests the favicon URL. |
| **`frontend/public/apple-icon.png`** | Served at `/apple-icon.png` for the Apple touch icon link. |
| **`frontend/app/favicon.ico`** | Optional ICO fallback; Next.js uses it if present. |
| **`frontend/public/web-app-manifest-192x192.png`** | PWA icon 192×192 (referenced in `manifest.json`). |
| **`frontend/public/web-app-manifest-512x512.png`** | PWA icon 512×512 (referenced in `manifest.json`). |
| **`frontend/public/manifest.json`** | Web app manifest; linked via `metadata.manifest`. |

**Layout configuration** (`frontend/app/layout.tsx`):

- `metadata.icons`: `icon: '/icon.png'`, `apple: '/apple-icon.png'`
- `metadata.manifest`: `'/manifest.json'`
- JSON-LD `logo` points to `${siteUrl}/icon.png`

---

## How to replace the icons

1. **Prepare your image(s)**  
   Use a square image. Recommended sizes (see below): e.g. 32×32 or 48×48 for favicon, 180×180 for Apple touch.

2. **Replace the files** (keep the same names):
   - Replace **`frontend/app/icon.png`** with your new favicon.
   - Replace **`frontend/app/apple-icon.png`** with your new Apple icon (can be the same image).
   - Replace **`frontend/public/icon.png`** with the same file as `app/icon.png`.
   - Replace **`frontend/public/apple-icon.png`** with the same file as `app/apple-icon.png`.

   From the repo root you can do:
   ```bash
   cp /path/to/your/icon.png frontend/app/icon.png
   cp /path/to/your/icon.png frontend/app/apple-icon.png
   cp frontend/app/icon.png frontend/public/icon.png
   cp frontend/app/apple-icon.png frontend/public/apple-icon.png
   ```

3. **Redeploy / restart**  
   Restart the dev server or redeploy (e.g. Vercel). Browsers often cache favicons; use a hard refresh (e.g. Cmd+Shift+R) or clear cache if the old icon still appears.

---

## Recommended sizes and format

- **Favicon (`icon.png`)**: 32×32 or 48×48 px. PNG is fine; small file size helps (e.g. &lt; 50 KB).
- **Apple touch icon (`apple-icon.png`)**: 180×180 px (Apple’s recommended size for “Add to Home Screen”). Can be the same design as the favicon at higher resolution.

Using oversized images (e.g. 1 MB) works but slows down loading; resizing to the sizes above is recommended.

---

## Source folders (optional)

Icons can be refreshed from two source folders:

| Source folder | Contents | Copied to |
|---------------|----------|-----------|
| **`favicon-for-app`** | `icon1.png`, `apple-icon.png`, `favicon.ico` | `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`, and same PNGs to `public/`. |
| **`favicon-for-public`** | `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png` | `public/web-app-manifest-192x192.png`, `public/web-app-manifest-512x512.png`. |

To refresh from those folders (run from repo root):

```bash
cp /path/to/favicon-for-app/icon1.png frontend/app/icon.png
cp /path/to/favicon-for-app/apple-icon.png frontend/app/apple-icon.png
cp /path/to/favicon-for-app/favicon.ico frontend/app/favicon.ico
cp frontend/app/icon.png frontend/public/icon.png
cp frontend/app/apple-icon.png frontend/public/apple-icon.png
cp /path/to/favicon-for-public/web-app-manifest-192x192.png frontend/public/
cp /path/to/favicon-for-public/web-app-manifest-512x512.png frontend/public/
```

---

## Optional: other formats

- **SVG favicon**: You can use an SVG instead of PNG for the favicon. Add `frontend/app/icon.svg` and set `metadata.icons.icon` to `'/icon.svg'`. Ensure `public/icon.svg` exists if you reference it by URL.
- **`favicon.ico`**: For maximum compatibility, some projects also add `frontend/app/favicon.ico` (e.g. 16×16 and 32×32 in one ICO). Next.js will use it if present; you can keep PNG as well and let the browser choose.
- **`public/favicon.svg`**: The repo may still contain `frontend/public/favicon.svg`. It is not used by the current layout; the active favicon is `icon.png` as set in `app/layout.tsx`. You can remove or keep it for reference.

---

## Summary

| Task | Action |
|------|--------|
| Change the site icon | Replace `app/icon.png`, `app/apple-icon.png`, and the same files in `public/`. |
| Point to a different URL | Update `metadata.icons` and the JSON-LD `logo` in `frontend/app/layout.tsx`. |
| Add a new format (e.g. SVG) | Add the file under `app/` (and optionally `public/`), then update `metadata.icons` in `layout.tsx`. |
