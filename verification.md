# BIA Honduras — Verification Record

**Date:** 2026-09-25  
**Result:** PASS — Home cinematic experience plus the five corporate subpages (Nosotros, Marcas, Calidad y sostenibilidad, Talento, Contactanos) and their English aliases.  
**Workspace:** React/Vite project at the repository root (not a Git repository).

## Automated checks

```text
npm test -- --run
14 test files, 138 tests passed

npm run lint
passed (tsc --noEmit)

npm run build
passed (Vite production build, 2126 modules)

node ~/.agents/skills/impeccable/scripts/detect.mjs --json src/pages src/components src/index.css
[]
```

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

## MotionStory scrub-rate evidence

The report was that the second video "runs too fast when scrolling". Measured, the
cause was the ratio between the film length and the scroll available, not the
seeking code. Seek latency was already 12–57ms across the whole file, buffered or
not, so buffering was never the bottleneck.

| | Before | After |
|---|---|---|
| Film length | 23.06s | 23.06s |
| Seconds played by the track | 23.06s | 12s window |
| Track height | 200vh | 260vh |
| Scrollable distance @1440×900 | 900px | 1440px |
| Scroll per second of footage | 39px | 120px |
| Film seconds per 100px of scroll | 2.56s | 0.83s |
| Film seconds per wheel tick | ~2.5s | ~0.8s |

Forward scrub across the track at 144×144px steps:
`0 → 0.91 → 2.03 → 3.22 → 4.39 → 5.59 → 6.78 → 7.95 → 9.19 → 10.41 → 11.59`,
monotonic throughout. Reversing down returns
`11.74 → 10.54 → 8.82 → 6.80 → 4.85 → 2.83 → 0.83`, so the film is reversible and
never gets stuck on a frame.

The budget is enforced, not just documented. `MOTION_STORY_SCRUB_WINDOW_SECONDS`
lives in `motionStoryMedia.ts` and the track height lives in `index.css`; the
media test reads the live CSS value and asserts the combined rate stays between
`MOTION_STORY_MIN_PX_PER_SECOND` (90) and `MOTION_STORY_MAX_PX_PER_SECOND` (170).
The ceiling is the Home Hero's own 174px/sec, so this section can never outrun
the opening statement. Editing either side of the ratio without the other fails
the suite.

Unaffected by the change:

- Mobile 390px: `data-cinematic="false"`, film parked at frame 0, 0 overflow.
- Reduced motion: `data-cinematic="false"`, `data-reduced-motion="true"`, both copy
  beats at opacity 1.
- Hero: 400vh track, 15.52s, 174px/sec, unchanged.
- Home page height 19422px (~22 viewports); the longer track adds 540px.

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
