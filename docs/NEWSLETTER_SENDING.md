# Newsletter sending (15n8)

How to **compose and send** the Scam Avenger newsletter. Start with manual send via your email provider; automate digests later.

---

## 1. Export subscribers

1. Log in to **Admin** at `/z7k2m9/`.
2. Open the **Newsletter** tab.
3. Click **Export subscribers (CSV)**. A file `newsletter-subscribers.csv` downloads.

The CSV includes:

- `email`, `name`, `unsubscribe_token`, `topic`, `frequency`, `consent_at`, `created_at`

Use `unsubscribe_token` in every email so recipients can one-click unsubscribe (required by law).

---

## 2. Unsubscribe link in every email

Every newsletter email **must** include an unsubscribe link. Use this URL pattern:

```
{SITE_URL}/newsletter/unsubscribe?token={unsubscribe_token}
```

Replace `{SITE_URL}` with your site (e.g. `https://scamenger.com`) and `{unsubscribe_token}` with the value from the CSV for that row. When the user clicks, they are marked unsubscribed in the database.

If you use an email provider (Resend, Mailchimp, etc.), you can:

- **Merge tag**: Map the provider’s “unsubscribe” or “custom field” to the column that contains the full URL, e.g.  
  `https://scamenger.com/newsletter/unsubscribe?token={{ unsubscribe_token }}`.
- Or build the URL in the provider using a merge field for `unsubscribe_token`.

---

## 3. Sending via your provider

### Option A: Resend, Mailchimp, ConvertKit, etc.

1. **Create an audience/list** (if you don’t already have one).
2. **Import the CSV** (upload or paste). Map columns to the provider’s fields (email, name, etc.). Add a custom field for `unsubscribe_token` if the provider supports it.
3. **Compose** your email in the provider’s UI. Use the content checklist in **docs/NEWSLETTER_CONTENT.md** (digest: stories, guides, recent reports, etc.).
4. **Insert the unsubscribe link** in the footer using the token (see §2).
5. **Send** (or schedule).

### Option B: In-app send (future)

A future admin screen could call a provider API (e.g. Resend) to send to the list without leaving the site. You would set `RESEND_API_KEY` and a “From” address in env, then use the same export data to build the recipient list and send. For now, use Option A.

---

## 4. Who to send to (topic & frequency)

The CSV includes `topic` and `frequency` (if migration 003 is applied):

- **topic**: `alerts` | `guides` | `digest` | `all`
- **frequency**: `weekly` | `monthly` | `important_only`

When sending:

- **Digest** (weekly/monthly round-up): Filter to `topic` in (`digest`, `all`) and `frequency` in (`weekly` or `monthly` as appropriate).
- **One-off alert**: Filter to `topic` in (`alerts`, `guides`, `all`) and optionally `frequency = important_only` for “alert-only” subscribers.

You can filter in a spreadsheet or in your provider’s segments after import.

---

## 5. Content to include

See **docs/NEWSLETTER_CONTENT.md** for:

- What to send (digest vs one-off alert).
- Where content comes from (stories, guides, recent reports, etc.).
- Checklist for building a digest (stories, guides, recent report stories, books, footer with unsubscribe).

Recent report stories summary is available from **GET /api/reports/recent** (see NEWSLETTER_CONTENT.md).

---

## 6. Summary

| Step | Action |
|------|--------|
| Export | Admin → Newsletter → Export subscribers (CSV). |
| Unsubscribe | Put `{siteUrl}/newsletter/unsubscribe?token={unsubscribe_token}` in every email. |
| Compose | Use NEWSLETTER_CONTENT.md checklist; pull recent reports from `/api/reports/recent` if needed. |
| Send | Import CSV into Resend/Mailchimp/etc.; compose; add unsubscribe link; send or schedule. |

This completes **15n8 – Admin / sending** (compose and send via provider UI; export from admin).
