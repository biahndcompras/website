# BIA Honduras

A bilingual React/Vite site for BIA Honduras, built around an editorial coffee-origin story and a scroll-scrubbed film hero.

## Run locally

**Prerequisite:** Node.js

```bash
npm install
npm run dev
```

The app is also configured for AI Studio. For a self-hosted `.env.local`, copy `.env.example` and add the required service values for your environment.

## Routes

| Spanish | English alias | Page |
|---|---|---|
| `/` | — | Home and origin story |
| `/nosotros` | `/about` | Identity, history, values |
| `/marcas` | `/brands` | El Indio, Café Maya, Oro Puro, Medalla |
| `/calidad-y-sostenibilidad` | `/quality` | Food safety, traceability, producers, territory |
| `/talento` | `/careers` | Employer brand, culture, process, openings |
| `/contactanos` | `/contact` | Editorial contact hub by audience |

Each alias is a real mounted route, so a direct visit renders the page instead of
falling through to the home redirect. Because that makes the same page reachable
at two URLs, every response writes `link[rel="canonical"]` from
`getCanonicalRoutePath` so search engines keep the Spanish path.

The app uses `BrowserRouter`. A static host must rewrite **every** unknown
application path — not only `/careers` but also `/nosotros`, `/marcas`,
`/calidad-y-sostenibilidad`, `/talento`, `/contactanos` and the English aliases —
to `index.html`. Otherwise a direct request to one of them returns the host's 404
page instead of the app.

### Vercel

`vercel.json` carries the rewrite and is required for production:

```json
{
  "cleanUrls": true,
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Without the rewrite, in-app navigation still works — the router never touches
the network — so the site looks healthy while you click around. The failure only
appears on a hard reload or a shared link, where the host answers the client
route with its own 404. That is easy to misread as a language bug: switching to
English, then reloading, appears to "reset" the site, when the app never loaded
at all. `src/app/vercelDeploy.test.ts` locks the config so it cannot go missing.

Note that `rewrites` runs after the static filesystem check, so `/media/*.mp4`
and the hashed JS/CSS bundles are still served as files.

### Content truth on the subpages

`src/content/secondaryPages.ts` is the single source of copy for the five
subpages. Anything BIA has not approved is stored with `status: 'placeholder'`
and an explicit `pending` note, which the UI renders as a visible
`data-content-status="placeholder"` line rather than hiding it or inventing a
value. Concretely:

- `contactChannels[*].value` is `null`; no email, phone, or address is published.
- `historyMoments[*].period` is `null`; the timeline prints "Fecha por confirmar
  con BIA" instead of a date.
- `talentOpenings.count` is `null`; the openings section states plainly that no
  applications are being accepted.
- `secondaryPageMetrics` is an empty array, so no metric can leak into the copy.
- `/contactanos` ships no `<form>`, `mailto:`, or `tel:`. A form appears only
  once a real destination (inbox, CRM, endpoint) exists.

To promote a placeholder, change its `status` to `approved` and fill in the
value; the pending note stops rendering on its own.

## Local hero media

The Home hero uses the supplied coffee-origin film, not a legacy remote architectural film or unrelated architectural imagery.

The default media contract is:

- `public/media/bia-origin-hero.mp4` — 10,167,462 bytes (9.7 MB), 15.52 seconds, 1920×1080, H.264, yuv420p, 25 fps.
- `public/media/bia-origin-poster.jpg` — 83,058 bytes, 1600×900 JPEG, extracted from the intentional frame at 7.5 seconds.

The smaller supplied source was selected after inspection:

- `src/assets/video1.mp4` — 10,166,619 bytes, 15.52 seconds, 1920×1080, H.264, 25 fps.
- `src/assets/17190655-uhd_3840_2160_24fps.mp4` — 72,752,757 bytes, 23.06 seconds, 3840×2160, H.264, 23.98 fps. The larger film was not needed for the desktop-first hero and would add an unnecessary ~69 MB source asset.

The normalized MP4 keeps the selected video stream, drops non-video metadata, and enables fast-start playback. The poster is a lightweight loading/error fallback; the video remains the primary hero when it is available.

### Environment overrides

No environment variables are required when the local defaults are deployed. To use an approved replacement or a remote asset, set these Vite variables in `.env.local` (or the deployment environment):

```bash
VITE_BIA_HERO_VIDEO_URL="/media/bia-origin-hero.mp4"
VITE_BIA_HERO_POSTER_URL="/media/bia-origin-poster.jpg"
```

Both values are trimmed. An empty value falls back to the corresponding local default. Set both variables when deploying a matched replacement pair.

## Home MotionStory section

`MotionStorySection` is an independent section mounted between Brands and Quality. It reuses the ORBS motion grammar — a long scroll track with a sticky stage, a bounded frame that insets and rounds, film scale/drift, and copy that fades and translates with scroll — but it shares no code, component, or asset with the BIA Hero. The two hero templates stay separate by design.

Media contract:

- `public/media/bia-motion-story.mp4` — 13,423,586 bytes (12.8 MB), 23.06 seconds, 1920×1080, H.264, yuv420p, 23.98 fps.
- `public/media/bia-motion-story-poster.jpg` — 79,766 bytes, 1600×900 JPEG, the approved coffee frame.

This is the normalized web derivative of `src/assets/17190655-uhd_3840_2160_24fps.mp4` (72,752,757 bytes, 23.06 seconds, 3840×2160). The full 23.06 seconds are preserved, but the 4K master is not shipped to browsers as a ~69 MB source. The video is the primary medium; the poster is only a loading/fallback layer.

Behavior contract:

- Desktop (≥1024px) and motion allowed: 260vh track, sticky stage pinned below the fixed header, scrubbed film, animated frame bounds, cross-fading copy.
- The copy is two beats that cross-fade so at least one is always readable across the whole track. The stage never opens or closes on empty copy.
- The CTA block keeps a fixed copy column beside a bounded right visual that grows with `transform: scale()` only. Copy, link, and focus ring are never dimmed, moved, or covered; the link points at the existing `#bia-process` anchor.
- Below 1024px, or with `prefers-reduced-motion: reduce`, the section is a plain document flow: video, both copy beats, and the CTA in order, with no sticky geometry, no scrub, and no overflow.
- The section and its scroll track must never set `overflow`. An overflow ancestor becomes the sticky scrollport and silently disables the stage. Overflow is confined to the stage, the film frame, and the CTA cells. `data-cinematic` on the section is the single flag shared by the CSS geometry and the scroll transforms.

### Scrub rate

The supplied film is 23.06s, but the track does not play all of it. Two numbers
control the pace, and they live in different files, so both are asserted
together in `motionStoryMedia.test.ts`:

- `MOTION_STORY_SCRUB_WINDOW_SECONDS` (12) in `src/components/media/motionStoryMedia.ts`
  caps how much of the film the track plays. A replacement clip shorter than the
  window is still used whole, so it can never be truncated.
- The track height (260vh) in `src/index.css` sets how much scroll carries it.

Together they set the **scrub rate**: pixels of scroll per second of footage. At a
900px viewport the stage is sticky for one viewport, leaving 1440px of scroll
for 12s of film — 120px per second, or 0.83s of footage per 100px of scroll.

This matters. The section originally ran a 200vh track against the full 23.06s
film, which left 900px of scroll for 23s: 39px per second, so one wheel tick
skipped about 2.5s of footage and the film read as sprinting. The Home Hero, which
felt right, sits at 174px per second (400vh / 15.52s).

`MOTION_STORY_MIN_PX_PER_SECOND` (90) and `MOTION_STORY_MAX_PX_PER_SECOND` (170)
bracket the acceptable band, below the Hero so this stays a supporting beat
rather than the opening statement. The test computes the rate from the live CSS
value, so editing either side of the ratio without the other fails the build.

To retune: change the window for a gentler pace without lengthening the page, or
the track height for the same. Keep the asserted rate between the bounds.

Optional overrides:

```bash
VITE_BIA_MOTION_STORY_VIDEO_URL="/media/bia-motion-story.mp4"
VITE_BIA_MOTION_STORY_POSTER_URL="/media/bia-motion-story-poster.jpg"
```

### Replacing the media

1. Confirm usage rights and place the approved replacement under `public/media/` (or provide a deliberate remote URL).
2. Normalize a browser-compatible H.264 MP4. For example:

   ```bash
   ffmpeg -i path/to/replacement.mp4 \
     -map 0:v:0 -an -map_metadata -1 \
     -c:v libx264 -pix_fmt yuv420p -movflags +faststart \
     public/media/bia-origin-hero.mp4
   ```

3. Create a poster from a representative, approved frame, for example at `7.5` seconds:

   ```bash
   ffmpeg -ss 7.5 -i public/media/bia-origin-hero.mp4 \
     -frames:v 1 -vf 'scale=1600:900:flags=lanczos' -q:v 4 \
     public/media/bia-origin-poster.jpg
   ```

4. Update `VITE_BIA_HERO_VIDEO_URL` and `VITE_BIA_HERO_POSTER_URL` if the replacement should not use the documented local paths. Do not point the hero at an unrelated or unapproved asset.
5. Inspect the result and run the checks below before publishing.

## Verification

```bash
npm test -- --run
npm run lint
npm run build
```

The focused media tests check the override resolvers, the real local MP4/JPEG files, and the BIA content media inventory. The MotionStory tests additionally lock the progress/clamping contract, the "copy is never absent" invariant, the section mount order, and the independence of the new section from the Hero.

`src/pages/secondaryPages.test.ts` and `src/components/layout/SecondaryPageShell.test.ts`
cover the subpages: route and alias registration, canonical resolution, the
"no hubs anywhere" rule, the per-page content contract, and a stylesheet layout
contract (shrinkable grid tracks, breakable titles, clipping confined to media
slots, no `vw` sizing). `src/test/cssContract.ts` holds the shared flat-CSS
reader those layout assertions use.
