# Facebook Page posts: only you see them?

If posts from Scamenger appear on your Scam Avenger Facebook Page when you're logged in, but **other people don't see them**, it's usually due to **Page settings**, not the app.

## What we do in code

The backend sends **`published: true`** when posting to the Page feed so that each post is created as a **published**, public post. So from the API side, new posts are not created as drafts or "only me".

## What to check in Meta

1. **Page is published**
   - In **Meta Business Suite** (or Facebook.com → your Page) go to **Settings**.
   - Under **General**, ensure the Page is **Published**. If it's **Unpublished**, only Page admins see the Page and its posts.

2. **Page restrictions**
   - In **Settings → General → Page restrictions**, check:
     - **Country restrictions**: If you restricted the Page to certain countries, people outside those countries won't see it.
     - **Age restrictions**: If set, only people who meet the age limit will see the Page and posts.

3. **Default post audience**
   - In **Settings → General → Audience and visibility** (or similar), confirm the default audience for new posts is **Public** (or your intended audience), not "Only me" or "Admins only".

4. **Individual post visibility**
   - For posts already published, open a post and check the audience (e.g. globe = Public). If it was accidentally set to "Only me" or "Admins", change it to Public.

After changing any of these, new posts from Scamenger should be visible to everyone (subject to the Page's country/age settings). Existing posts may need their visibility updated manually if they were created with a restricted default.
