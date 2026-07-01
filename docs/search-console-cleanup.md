# Search Console Cleanup

Canonical host: `https://www.vols4vets.com`

Vols4Vets is now focused on veteran resource routing. Old screen utility, screensaver, flashlight, color test, dead pixel and monitor test content should be removed from Google results.

## Bad URL Patterns To Remove

- `/screen-flashlight`
- `/dvd-screensaver`
- `/glitch-screen`
- `/guides/how-to-clean-your-screen-safely`
- `/guides/how-to-use-a-white-screen-for-video-calls`
- `/guides/dead-pixel-vs-stuck-pixel`
- `/guides/best-screen-colors-for-focus`
- `/guides/how-to-check-backlight-bleed`
- Any indexed URL containing ScreenTools, screen flashlight, screensaver, glitch screen, white screen, black screen, red screen, blue screen, green screen, dead pixel, stuck pixel, backlight bleed, monitor test, screen color, visual effect, color utility or flashlight utility.

## Removed Or Disabled Routes

These routes now redirect to `/removed-utility-content`, which is marked `noindex,nofollow`:

- `/screen-flashlight`
- `/dvd-screensaver`
- `/glitch-screen`
- `/guides/how-to-clean-your-screen-safely`
- `/guides/how-to-use-a-white-screen-for-video-calls`
- `/guides/dead-pixel-vs-stuck-pixel`
- `/guides/best-screen-colors-for-focus`
- `/guides/how-to-check-backlight-bleed`

## Sitemap Resubmission

1. Deploy the cleanup branch.
2. Open Google Search Console for `https://www.vols4vets.com`.
3. Go to Sitemaps.
4. Submit `https://www.vols4vets.com/sitemap.xml`.
5. Confirm the sitemap only includes veteran-resource, search, triage and trust pages.

## Search Console Removals

1. In Search Console, open Removals.
2. Use Temporary removals for the bad URL patterns above.
3. Remove exact URLs that still appear in indexing reports.
4. Check Page indexing after Google recrawls.

Search Console removals are temporary unless the pages are removed, redirected, noindexed or returned as 410. Vercel static redirects do not provide a simple route-level 410 here, so the cleanup page is noindexed and bad URLs are removed from the sitemap.

## Manual Steps Mason Must Complete

- Submit the updated sitemap.
- Request temporary removals for any indexed bad utility URLs.
- Inspect a sample of old utility URLs after deployment.
- Watch Page indexing for old ScreenTools or utility titles.
- Confirm Google-selected canonicals use `https://www.vols4vets.com`.

## Vercel Checks Mason May Need

- Confirm `www.vols4vets.com` is the primary production domain.
- Confirm old utility redirects deploy from `vercel.json`.
- Confirm no older project or domain alias is still serving ScreenTools content.
- If Vercel supports a cleaner 410 response in the chosen deployment setup later, replace the temporary redirects with 410 Gone responses.
