# BIA Honduras — Verification Record

**Date:** 2026-09-25  
**Result:** PASS — Home cinematic experience plus the five corporate subpages (Nosotros, Marcas, Calidad y sostenibilidad, Talento, Contactanos) and their English aliases.  
**Workspace:** React/Vite project at the repository root (not a Git repository).

## Automated checks

```text
npm test -- --run
15 test files, 151 tests passed

npm run lint
passed (tsc --noEmit)

npm run build
passed (Vite production build)

node ~/.agents/skills/impeccable/scripts/detect.mjs --json src/pages src/components src/index.css
[]
```

## Vercel SPA rewrite evidence

Reported on `biahonduras.vercel.app` as "the ES/EN selector does not work
properly". Reproduced against production:

| Step | Result |
|---|---|
| Load `/` | Home renders, `lang="es"`, no storage value |
| Click **EN** | `lang="en"`, `localStorage['bia-honduras-locale']="en"`, H1 becomes "From Honduras, with purpose.", nav becomes Home/About us/Brands/Quality/Talent |
| Hard reload of `/` | Still English — the selector itself is correct |
| Click **Nosotros** in-app | `/nosotros` renders "A story that begins in the land." |
| Click **EN** | `lang="en"`, storage `"en"`, H1 English |
| **Hard reload of `/nosotros`** | **`404: NOT_FOUND` — "This page doesn't exist"** |

The same sequence against `vite preview` and against a local server applying the
`vercel.json` rewrite keeps the page in English across the reload. Removing the
rewrite from that local server reproduces the 404 exactly.

Root cause: the deployment had no `vercel.json`, so Vercel answered the client
route with its own 404 instead of the app shell. In-app navigation is unaffected
because React Router never hits the network, which is why the site looked fine
while browsing and only failed on reload or a shared link. The saved locale was
intact in `localStorage` the whole time — the app simply never reloaded.

Fix: `vercel.json` with `cleanUrls` and a catch-all rewrite to `/index.html`,
locked by `src/app/vercelDeploy.test.ts`. Verified with the rewrite applied —
all ten client routes survive a direct hard load, English persists across a
reload on `/talento`, and `/media/bia-origin-hero.mp4` plus the hashed JS bundle
still return 200 with their real content types, since Vercel checks the
filesystem before applying rewrites.

## Route and metadata evidence

Every Spanish path and every English alias was visited directly in the browser.

| Route | Title | Renders | Canonical | Horizontal overflow |
|---|---|---|---|---|
| `/` | BIA Honduras \| De Honduras, con propósito | Home | `/` | 0 |
| `/nosotros` | Nosotros \| BIA Honduras | `NosotrosPage` | `/nosotros` | 0 |
| `/marcas` | Marcas \| BIA Honduras | `MarcasPage` | `/marcas` | 0 |
| `/calidad-y-sostenibilidad` | Calidad y sostenibilidad \| BIA Honduras | `CalidadPage` | itself | 0 |
| `/talento` | Talento \| BIA Honduras | `TalentoPage` | `/talento` | 0 |
| `/contactanos` | Contáctanos \| BIA Honduras | `ContactanosPage` | `/contactanos` | 0 |
| `/about` | About us \| BIA Honduras | NosotrosPage | `/nosotros` | 0 |
| `/brands` | Brands \| BIA Honduras | MarcasPage | `/marcas` | 0 |
| `/quality` | Quality & sustainability \| BIA Honduras | CalidadPage | `/calidad-y-sostenibilidad` | 0 |
| `/contact` | Contact us \| BIA Honduras | ContactanosPage | `/contactanos` | 0 |
| `/careers` | Talent \| BIA Honduras | TalentoPage | `/talento` | 0 |

`link[rel="canonical"]` is written from `getCanonicalRoutePath`, so an alias never
competes with its Spanish page in search results.

## Navigation evidence

- Primary nav (desktop + mobile): Inicio, Nosotros, Marcas, Calidad, Talento, Contacto.
- `aria-current="page"` resolves on the canonical path **and** on the alias: on
  `/careers` the Talent item is marked, because the header compares the alias id.
- The header Contact action carries `aria-current` on `/contactanos` and
  `/contact`, which is where that destination actually lives.
- No nav, footer, or page source contains the word "hub"; a DOM text scan of
  `/nosotros`, `/marcas`, `/calidad-y-sostenibilidad`, `/talento`,
  `/contactanos`, `/about` and `/contact` returns zero matches for
  `coffee hub`, `culinary hub`, `snacks hub`, `partners & food service`, `hubs`.
- Mobile menu opens, moves focus to the first link, navigates, and returns focus
  to the menu button on all five pages.
- Each page ends with a cross-link grid; verified `/marcas → /calidad-y-sostenibilidad`
  and back with the H1 correct on both legs.

## Layout evidence

Bounding-box sweep at 320, 390, 540, 768, 900, 1024, 1180 and 1440px across all
five pages: zero elements crossing the right edge, zero inner overflow on
non-clipping boxes, zero document horizontal overflow.

Long-word containment is asserted in the stylesheet contract: every secondary
title sets `overflow-wrap`, media slots are the only clipping boxes, and no
`.secondary-*` rule sizes anything in `vw`.

## Motion and accessibility evidence

- Every focusable element on `/contactanos` shows a 3px visible outline in tab
  order: skip link → brand → 5 nav items → ES/EN → Contact → hero CTAs.
- The in-page "Más información" anchor lands its target 104px from the top, below
  the 81px fixed header, so the heading is never covered.
- Reduced motion: with `prefers-reduced-motion: reduce`, 0 headings or paragraphs
  are left faded and 0 carry a residual transform; 29 components report
  `data-reduced-motion="true"`.
- Exactly one `h1` per page; every `<section>` has `aria-labelledby` or
  `aria-label`; no link renders as `undefined`, `NaN`, or `#`.
- Language switch on `/nosotros` keeps the path, swaps the H1 to English, updates
  the document title to `About us | BIA Honduras`, and persists to
  `localStorage['bia-honduras-locale'] = 'en'`.

## Responsive evidence

Sweep across 12 widths (320, 360, 390, 414, 540, 768, 834, 1024, 1180, 1280,
1440, 1920) on `/` and all five subpages.

| Measure | Before | After | Target |
|---|---|---|---|
| Document horizontal overflow | 0 | 0 | 0 |
| Smallest tap target, ≤768px | 15px | 38px | ≥24px (WCAG 2.5.8) |
| Smallest tap target, 1024–1440px | 15px | 15px | inline text link, exempt |
| Smallest readable text, ≤768px | 7.68px | 9.28px | wordmark subline only |
| Smallest readable text, desktop | 7.68px | 8.96px | wordmark subline only |

Fixes applied at `max-width: 768px`:

- `.site-footer__group a`, `.site-footer__text-link`, `.site-footer__action-link`,
  `.home-text-link` and `.secondary-link--compact` grow a real hit area with
  `min-height: 2.75rem` while keeping their typography. The header language
  switcher goes to `min-width`/`min-height: 2.75rem`.
- `.home-media-slot__meta` rises from 0.57rem to 0.66rem so the pending-media
  captions are readable instead of 9.1px.
- `.bia-lockup__secondary` rises to 0.68rem on mobile and 0.56rem on desktop; it
  is a placeholder wordmark that the official logo replaces.
- The footer list gap tightens to `0.15rem` so the taller links do not inflate
  the footer.

The remaining 9.28px item is the `aria-hidden` `SEED / CUP` stage label inside
the process visual, which is decorative ink rather than reading copy.

Decorative elements that cross the right edge — `.home-manifesto__visual-word`,
`.home-media-slot__field-line`, `.process-cinematic__visual-rings` — are all
`aria-hidden="true"` and clipped by their `.home-media-slot` ancestor
(`overflow: hidden`). They bleed by design and never widen the document.

The `.home-section__title` vertical `scrollHeight > clientHeight` reading at
1920px is the display-serif descender exceeding a `line-height: 0.96` box. The
computed `overflow` is `visible`, so nothing is clipped; it is not a defect.

Cinematic collapse on the Home:

| Breakpoint | Process stage | MotionStory |
|---|---|---|
| 390px | `position: relative`, 1602px natural flow | `data-cinematic="false"`, plain flow |
| 768px | `position: sticky`, 4507px track | `data-cinematic="false"`, plain flow |
| 1024px | `position: sticky`, 4430px track | `data-cinematic="true"`, 200vh track |

The Hero keeps its 400vh scrub track at every width by design.

## Content truth evidence

- No page ships a `<form>`, a `mailto:`, a `tel:`, or an unapproved contact
  value. `/contactanos` states plainly that no online form is published yet.
- Pending facts render as visible notes with `data-content-status="placeholder"`:
  11 on Nosotros, 4 on Marcas, 3 on Calidad, 4 on Talento, 4 on Contáctanos.
- `talentOpenings.count` is `null` and `historyMoments[*].period` is `null`; the
  timeline prints "Fecha por confirmar con BIA" instead of a date.
- `secondaryPageMetrics` is an empty array, so no metric can leak into the copy.
- Value and talent-area rows use their own per-entry description rather than one
  repeated sentence.

## Home regression evidence

- Hero: local `bia-origin-hero.mp4`, `readyState 4`, 15.52s, `400vh` track, no
  cycle metadata.
- Scroll scrub: `scrollY 900 → t 5.17`, `1800 → 10.33`, `2700 → 15.50`, clamped at
  the end.
- Process track: 7 steps, active index advances 2 → 3 → 5 → 6 and reverses
  6 → 5 → 4 on scroll up.
- MotionStory: local `bia-motion-story.mp4`, scrubbed to 11.59s of its 12s window.
- Quality: title right edge sits 72px clear of the media column; 0 overflow.
- Console: 0 errors and 0 warnings across all eight routes (only Vite and React
  DevTools info messages).

## MotionStory transport evidence

Two separate defects were reported on the second video. The first attempt fixed
the wrong one.

**Defect 1 — "runs too fast when scrolling".** The film was 23.06s mapped across
a 200vh track, which left only 900px of scrollable distance at 1440×900. That is
39px of scroll per second of footage, about 2.5s of film skipped per wheel tick.
The Hero, which felt right, runs at 174px/sec.

**Defect 2 — "the video stays static".** The first fix raised the rate to
120px/sec by lengthening the track and capping the window. That made the pacing
acceptable but did not address the freeze. Measured cause: the element carried
`preload="metadata"`, so only 4.67s of the 23.06s clip was buffered. Every seek
past that point had to download its segment before a frame could be presented.
Measured seek cost ranged 12–97ms even after warming, and a slow drag painted the
same frame repeatedly.

### Fix: play the film, let scroll trim it

Seeking is gone. The film plays natively at a reduced rate and scroll decides how
much of it is on screen, so the browser keeps decoding real frames and there is
never a download wait between scroll input and visible motion.

| | Seeking | Native playback |
|---|---|---|
| `preload` | `metadata` | `auto` |
| Buffered | 4.67s of 23.06s | 17.9s and climbing |
| `readyState` | 1 | 4 |
| Transport | paused, `currentTime` per frame | playing, rate 0.5 |
| Distinct frames in 45 rAF with scroll still | 40 of 60 | **45 of 45** |
| `paused` during the section | true | false |

The decisive measurement: with scroll held completely still, the film now
advances 0.37s across 45 frames and paints 45 distinct frames. Before, it
repeated frames while the browser chased the network.

Scroll keeps full authority. A 0.35s tolerance means continuous scrolling is
never fought; a deliberate jump across the section snaps the film into place.
Scrubbing the track forward gives `1.07 → 2.60 → 4.07 → 5.45 → 7.11 → 8.43 →
9.94 → 11.43`, always playing, never exceeding the 12s window, with the rate
easing 0.25 → 0.5 → 0.25 at the track ends.

An `IntersectionObserver` on the track stops playback when the stage leaves the
viewport. Progress alone cannot decide this: it reads 0 both "before the section"
and "at the start of the track", so a progress check would keep decoding frames
nobody can see. Measured: inside the section playing at 5.56s; scrolled up
`paused: true, t: 0`; returned playing at 3.23s; scrolled past the end
`paused: true, t: 0`.

### Guarded by tests

- The rate is always in `[0.25, 1]` — below real time so frames decode, and
  inside the band Safari accepts (it refuses some rates under 0.5).
- The rate eases in and out rather than stepping.
- Invalid progress never yields a negative or non-finite rate.
- The 90–170px/sec scrub budget from the first fix is retained, computed from the
  live CSS track height, so the pacing cannot regress while the transport changes.

### The Hero was not modified

```
git diff 62cab51 HEAD -- src/components/media/heroMedia.ts \
  src/components/media/ScrollVideoHero.tsx src/components/Hero.tsx
(empty — byte-identical to the initial commit)
```

Verified at runtime: Hero track 3600px (`h-[400vh]`), `bia-origin-hero.mp4`,
15.52s, `preload="metadata"`, `paused`, seek scrub
`scrollY 900 → 5.17s`, `1800 → 10.33s`, `2700 → 15.50s`. Identical to before.

### Unaffected

- Reduced motion: `data-cinematic="false"`, `currentTime` 0 → 0 over 1.5s, static.
- Mobile 390px: `paused: true`, `t: 0`, 0 overflow.
- All six routes: 0 horizontal overflow, exactly one `h1` each.

## Media record

- Hero: `public/media/bia-origin-hero.mp4` — 15.52s, 1920×1080.
- MotionStory: `public/media/bia-motion-story.mp4` — 23.06s, 1920×1080 web
  derivative of the supplied UHD coffee footage.
- Posters: `bia-origin-poster.jpg`, `bia-motion-story-poster.jpg`.
- No remote architectural media is used.

## Remaining approval inputs

- Official BIA logo and brand guidelines.
- Final approved photography for the abstract media slots on the subpages.
- History dates, brand product copy, quality standards, and certifications.
- Contact channels: email, phone, office address, social accounts, press contact.
- Careers openings and the destination for applications.
- Legal pages (Privacidad, Términos) remain labelled placeholders.

These are content handoff items, not runtime failures.
