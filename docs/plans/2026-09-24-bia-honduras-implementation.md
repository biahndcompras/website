# BIA Honduras Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current Cover Architectural Labs property-configurator experience with a bilingual BIA Honduras corporate coffee and foods website, preserving the video-first scroll-scrubbed hero and editorial design language while adding origin, hubs, brands, quality, sustainability, and talent storytelling.

**Architecture:** Keep the existing React/Vite shell, `motion`, and `lenis` foundation, but separate media/motion primitives, bilingual content, page sections, and route-level pages. The Home will be a long-form editorial landing experience with a sticky scroll-scrubbed BIA film; `/careers` will be a dedicated bilingual employer-brand route. Product-specific Cover state and views will be removed rather than adapted.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, `motion`, `lenis`, Lucide React, React Router, Vitest, Playwright browser verification.

---

## Implementation principles

- Preserve the current hero interaction model: tall scroll container, sticky viewport, normalized scroll progress, video seeking, text fade/translation, and Lenis coordination.
- Do not replace the hero with a static image. A poster or background image is allowed only as a loading/error fallback.
- Keep motion restrained and readable; use `transform` and `opacity` rather than layout animation for parallax and reveals.
- Keep all user-facing copy bilingual and route-aware.
- Do not invent statistics, certifications, locations, job openings, or environmental claims.
- Move supplied media into a predictable `public/media` structure once assets are available.
- Use a single content source for labels, hubs, brands, origin regions, and careers content.
- Preserve reduced-motion and keyboard accessibility while adding the new effects.
- Validate every major slice with TypeScript, production build, and real browser interaction.

## File map

**Create:**

- `src/content/bia.ts` — typed BIA content, hubs, brands, origin regions, values, and temporary approved-claim placeholders.
- `src/i18n/translations.ts` — bilingual copy for navigation, Home, Careers, metadata, and CTA labels.
- `src/i18n/I18nProvider.tsx` — locale state, translation lookup, and `document.documentElement.lang` synchronization.
- `src/components/media/ScrollVideoHero.tsx` — reusable scroll-controlled video component with poster, fallback, reduced-motion, and error handling.
- `src/components/media/ParallaxLayer.tsx` — reusable depth/parallax wrapper based on `useScroll`, `useTransform`, and `useSpring`.
- `src/components/motion/Reveal.tsx` — reusable `whileInView` text/block reveal.
- `src/components/layout/SiteHeader.tsx` — BIA navigation and locale switcher.
- `src/components/layout/SiteFooter.tsx` — enterprise footer and legal/contact placeholders.
- `src/components/sections/BrandManifesto.tsx` — BIA Foods / coffee narrative.
- `src/components/sections/HubsSection.tsx` — four BIA Foods hubs.
- `src/components/sections/OriginStory.tsx` — Copán, Marcala, and Montecillos story.
- `src/components/sections/FromSeedToCup.tsx` — coffee process and quality journey.
- `src/components/sections/BrandsSection.tsx` — El Indio, Maya, Oro Puro, and Medalla.
- `src/components/sections/QualitySustainability.tsx` — quality, safety, farmer value chain, and culture claims.
- `src/components/sections/TalentBand.tsx` — visible Home careers CTA.
- `src/pages/CareersPage.tsx` — independent bilingual careers experience.
- `src/test/setup.ts` — Vitest browser setup if component tests need a DOM.
- `src/content/bia.test.ts` — content integrity and translation-key tests.
- `src/i18n/translations.test.ts` — bilingual key parity and locale behavior tests.

**Modify:**

- `src/App.tsx` — route shell, Lenis lifecycle, Home composition, and Careers route.
- `src/components/Hero.tsx` — replace Cover-specific content and video with the new BIA hero composition, or remove after extraction.
- `src/components/Header.tsx` — replace or retire after `SiteHeader` extraction.
- `src/index.css` — BIA palette tokens, fonts, reduced-motion rules, media fallback styles, and global accessibility states.
- `index.html` — BIA title, language, description, theme color, and metadata.
- `metadata.json` — project name, description, and capability metadata.
- `package.json` — add `react-router-dom` and test tooling if not already available.
- `README.md` — BIA development, assets, routes, and verification instructions.
- `src/types.ts` — replace property-configurator types with BIA content and locale types, or split them into `src/content/types.ts` and `src/i18n/types.ts`.

**Delete after replacement:**

- `src/components/Configurator.tsx`
- `src/components/Feasibility.tsx`
- `src/components/Gallery.tsx`
- `src/components/InquireModal.tsx`
- `src/components/LoadingScreen.tsx` or replace it with a BIA-specific transition component if the approved visual language requires it.
- Cover-specific SVG logo blocks in `Header.tsx`, `LoadingScreen.tsx`, and `App.tsx`.

Do not delete source files until all new routes and sections compile and the old navigation is no longer referenced.

---

### Task 1: Establish the BIA content contract

**Files:**
- Create: `src/content/bia.ts`
- Create: `src/content/bia.test.ts`
- Modify: `src/types.ts`
- Modify: `package.json`

**Step 1: Write the failing content integrity test**

Test that the BIA content contract contains the four hubs and four named coffee brands, and that every media item has an `alt` value or is explicitly marked decorative.

```ts
it('defines the four BIA Foods hubs and core coffee brands', () => {
  expect(biaContent.hubs.map((hub) => hub.id)).toEqual([
    'coffee',
    'culinary',
    'snacks',
    'partners-food-service',
  ]);
  expect(biaContent.brands.map((brand) => brand.id)).toEqual([
    'el-indio',
    'cafe-maya',
    'oro-puro',
    'medalla',
  ]);
});
```

**Step 2: Run the test and verify it fails**

Run:

```bash
npm test -- --run src/content/bia.test.ts
```

Expected: FAIL because `src/content/bia.ts` does not exist.

**Step 3: Implement the typed content model**

Define types for:

- `Locale = 'es' | 'en'`
- `BiaHub`
- `CoffeeBrand`
- `OriginRegion`
- `ValueProposition`
- `ProcessStep`
- `MediaAsset`
- `CareersArea`

Keep approved prose separate from unverified metrics. Add a `status: 'approved' | 'placeholder'` field for claims that still need BIA sign-off.

**Step 4: Add the supplied narrative as provisional bilingual content**

Populate the content from the user-provided BIA description. Do not add invented numbers, certifications, locations, or job openings. Use explicit `placeholder` status for contact details, openings, and any metric that is not supplied.

**Step 5: Run the test and typecheck**

Run:

```bash
npm test -- --run src/content/bia.test.ts
npm run lint
```

Expected: PASS and no TypeScript errors.

**Step 6: Checkpoint**

If the directory is later initialized as a Git repository, commit:

```bash
git add src/content src/types.ts package.json
git commit -m "feat: establish BIA content contract"
```

---

### Task 2: Add bilingual locale state without losing the current experience

**Files:**
- Create: `src/i18n/translations.ts`
- Create: `src/i18n/I18nProvider.tsx`
- Create: `src/i18n/translations.test.ts`
- Modify: `src/App.tsx`

**Step 1: Write the failing key-parity test**

```ts
it('keeps Spanish and English translation keys aligned', () => {
  expect(Object.keys(translations.es).sort()).toEqual(
    Object.keys(translations.en).sort(),
  );
});
```

Add a second test asserting that changing the locale updates the document language and that an unknown key falls back to English rather than rendering `undefined`.

**Step 2: Run the tests and verify they fail**

Run:

```bash
npm test -- --run src/i18n/translations.test.ts
```

Expected: FAIL because the translation files and provider do not exist.

**Step 3: Implement the translation structure**

Create nested or flat keys for:

- navigation
- common CTA labels
- Home hero
- Home sections
- Careers
- footer
- accessibility labels
- fallback media messages

Keep content keys separate from data IDs so changing copy does not break routing or tests.

**Step 4: Implement `I18nProvider`**

Persist the selected locale in `localStorage` under a BIA-specific key. Default to Spanish for the initial route, update `document.documentElement.lang`, and preserve the current route and scroll position when switching language.

**Step 5: Run the tests and typecheck**

Run:

```bash
npm test -- --run src/i18n/translations.test.ts
npm run lint
```

Expected: PASS.

**Step 6: Checkpoint**

Commit when Git is available:

```bash
git add src/i18n src/App.tsx
 git commit -m "feat: add bilingual BIA locale state"
```

---

### Task 3: Extract reusable scroll and media primitives

**Files:**
- Create: `src/components/media/ScrollVideoHero.tsx`
- Create: `src/components/media/ParallaxLayer.tsx`
- Create: `src/components/motion/Reveal.tsx`
- Modify: `src/components/Hero.tsx`

**Step 1: Preserve the current hero behavior as an explicit contract**

Document and test the following behaviors:

- The hero scroll container is taller than the viewport.
- The video viewport is sticky.
- Scroll progress maps to `0..1`.
- Text opacity and Y transforms are derived from progress.
- Video seeking is serialized with a pending time to avoid overlapping seeks.
- The video resets to the beginning after loading.

**Step 2: Implement `ScrollVideoHero`**

Use a prop-driven media contract:

```ts
interface ScrollVideoHeroProps {
  videoSrc: string;
  posterSrc?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}
```

The component should:

- use `preload="metadata"` or an equivalent deliberate preload strategy;
- use `playsInline`, `muted`, and a non-looping video;
- listen for `loadeddata`, `seeked`, and `error`;
- show the poster or a blue fallback surface when media is unavailable;
- avoid a visible image hero when the video is available;
- expose progress and scroll state to its children through CSS variables or render props;
- skip scrubbing when `prefers-reduced-motion: reduce` is active.

**Step 3: Implement `ParallaxLayer`**

Use `useScroll({ target, offset })`, `useTransform`, and `useSpring` to translate only a wrapper around media or decorative layers. Clamp the range to a small distance so it reads as depth, not movement detached from the composition.

**Step 4: Implement `Reveal`**

Provide predictable variants for opacity and Y translation, with `once: true`, a readable viewport margin, and a reduced-motion fallback.

**Step 5: Migrate the old Hero implementation to the new primitives**

Remove the remote architectural video URL and all Cover-specific copy. Keep the current 400vh/sticky/scrub structure unless visual verification proves a different height is necessary.

**Step 6: Run typecheck and build**

Run:

```bash
npm run lint
npm run build
```

Expected: no type errors and a successful Vite production build.

**Step 7: Verify the media contract in a browser**

Use the browser-debugging skill to confirm video start, poster/fallback, scroll scrub, and reduced-motion behavior on desktop and mobile widths.

**Step 8: Checkpoint**

Commit when Git is available:

```bash
git add src/components/media src/components/motion src/components/Hero.tsx
 git commit -m "feat: preserve scroll-scrubbed hero motion primitives"
```

---

### Task 4: Replace the app shell, header, footer, and loading transition

**Files:**
- Create: `src/components/layout/SiteHeader.tsx`
- Create: `src/components/layout/SiteFooter.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css`
- Delete or retire: `src/components/Header.tsx`, `src/components/LoadingScreen.tsx`

**Step 1: Remove Cover-specific product state from `App.tsx`**

Remove:

- property configurator state;
- feasibility state;
- saved configuration localStorage keys;
- property inquiry modal state;
- Cover metadata and footer copy.

Keep the Lenis lifecycle but centralize it so route changes resize and reset scroll correctly.

**Step 2: Build the BIA header**

Implement:

- BIA logo slot using the approved logo asset or a clearly marked temporary text lockup;
- bilingual navigation;
- Home, Story/Hubs, Careers, and Contact/Explore actions;
- locale switcher;
- mobile menu with focus-visible states and Escape-to-close behavior;
- header color/background adaptation for light and dark hero sections.

**Step 3: Build the BIA footer**

Include:

- BIA Foods and BIA Honduras context;
- hubs;
- brands;
- careers link;
- contact placeholder;
- legal links;
- language switcher or locale access;
- no fabricated addresses, phone numbers, or certifications.

**Step 4: Adapt the loading transition**

Reuse the pixel/dissolve idea only if it matches the established profile. Replace Cover logo and percentage copy with BIA identity and a shorter, branded transition. Ensure it does not block interaction longer than necessary and is skipped when reduced motion is requested.

**Step 5: Run lint and build**

Run:

```bash
npm run lint
npm run build
```

Expected: PASS.

**Step 6: Browser-check shell behavior**

Verify fixed header, mobile menu, locale switch, Home route, and Careers route at desktop and mobile widths.

---

### Task 5: Add React routing and the independent Careers page

**Files:**
- Modify: `package.json`
- Modify: `src/App.tsx`
- Create: `src/pages/CareersPage.tsx`
- Create: `src/components/sections/CareersHero.tsx`
- Create: `src/components/sections/CareersValues.tsx`
- Create: `src/components/sections/CareersAreas.tsx`
- Create: `src/components/sections/CareersProcess.tsx`

**Step 1: Add routing dependency and route tests if needed**

Add `react-router-dom`. Configure the route map:

- `/` → Home
- `/careers` → CareersPage

If static hosting does not provide SPA fallback, use the deployment rewrite required by the host and document it.

**Step 2: Implement the Careers page shell**

Build a dedicated route with its own page-level metadata and shared `SiteHeader` / `SiteFooter`.

**Step 3: Implement Careers sections**

Use real supplied content for:

- Life at BIA;
- culture and values;
- role families;
- team stories;
- hiring process;
- FAQ;
- current openings.

Render `Not accepting applications yet` or a localized equivalent when openings are not supplied; do not fabricate vacancies.

**Step 4: Add the Home-to-Careers handoff**

The `TalentBand` on Home must link directly to `/careers`, preserve the selected locale, and use a clear “View opportunities” CTA.

**Step 5: Run lint, build, and route smoke tests**

Run:

```bash
npm run lint
npm run build
```

Expected: PASS and both routes generated without runtime errors.

**Step 6: Browser-check both routes**

Use Playwright to navigate to `/`, switch language, navigate to `/careers`, switch language again, use browser back/forward, and verify no scroll or content loss.

---

### Task 6: Build the Home narrative sections

**Files:**
- Create: `src/components/sections/BrandManifesto.tsx`
- Create: `src/components/sections/HubsSection.tsx`
- Create: `src/components/sections/OriginStory.tsx`
- Create: `src/components/sections/FromSeedToCup.tsx`
- Create: `src/components/sections/BrandsSection.tsx`
- Create: `src/components/sections/QualitySustainability.tsx`
- Create: `src/components/sections/TalentBand.tsx`
- Modify: `src/App.tsx`

**Step 1: Implement the brand manifesto**

Use a two-column editorial layout with a restrained scroll reveal. Make the coffee proposition understandable in the first viewport after the hero.

**Step 2: Implement the four hubs**

Use a horizontal or asymmetric layout that does not feel like four equal generic cards. Each hub needs a short bilingual title, description, and supplied visual if available.

**Step 3: Implement the origin story**

Build the Copán, Marcala, and Montecillos story with real images/video and restrained parallax. Avoid unsupported claims about farmer programs, volumes, or impact.

**Step 4: Implement the seed-to-cup journey**

Use a vertical process narrative with scroll-linked progress or layered media. Keep labels short and scan-friendly.

**Step 5: Implement the brands section**

Present El Indio, Maya, Oro Puro, and Medalla with approved product imagery, restrained brand treatments, and a consistent bilingual introduction.

**Step 6: Implement quality and sustainability**

Present the user-provided themes: local producer value chain, international food-safety standards, and Great Place to Work culture. Mark unapproved wording for review.

**Step 7: Implement the visible talent band**

Create a high-contrast but calm section with:

- a human-centered statement;
- three to five role-family examples;
- a link to `/careers`;
- one secondary link to the company story or contact.

**Step 8: Run typecheck/build and scan for Cover leftovers**

Run:

```bash
npm run lint
npm run build
rg -n "Cover|ADU|prefabricat|Lot Feasibility|California|cover-labs" src index.html metadata.json README.md
```

Expected: no shipped BIA page references the old product. Any intentionally retained historical file should be removed from the runtime import graph.

---

### Task 7: Move and normalize the supplied media assets

**Files:**
- Create/modify: `public/media/` asset paths
- Modify: `src/content/bia.ts`
- Modify: `src/index.css`
- Modify: `README.md`

**Step 1: Inventory supplied assets**

Record each asset as video, poster, product, origin, people, or facility. Check usage rights and identify the best hero crop.

**Step 2: Normalize the hero media**

Create:

- `public/media/bia-origin-hero.mp4`
- `public/media/bia-origin-hero.webm` if available
- `public/media/bia-origin-poster.jpg`
- responsive image variants where needed

Use a lower-resolution mobile source only if it is supplied or deliberately generated; do not create artificial low-quality media from a single source without approval.

**Step 3: Add `sizes`, dimensions, and alt text**

Prevent layout shift for images and provide meaningful alt text for real people, places, products, and processes. Mark purely atmospheric layers as decorative.

**Step 4: Verify media failure paths**

Simulate a missing video source and confirm that the poster/fallback surface remains visually intentional and does not reveal an empty black box.

**Step 5: Commit when Git is available**

```bash
git add public/media src/content/bia.ts src/index.css README.md
 git commit -m "feat: add BIA origin media and asset documentation"
```

---

### Task 8: Add final metadata, accessibility, and reduced-motion behavior

**Files:**
- Modify: `index.html`
- Modify: `src/index.css`
- Modify: `src/App.tsx`
- Modify: `src/components/layout/SiteHeader.tsx`
- Modify: `src/components/media/ScrollVideoHero.tsx`

**Step 1: Update document metadata**

Set the title, description, language, theme color, and social metadata to BIA Honduras. Use approved copy only.

**Step 2: Add global focus and selection styles**

Ensure all interactive elements have visible focus states, adequate touch targets, and no selection suppression that harms usability.

**Step 3: Add reduced-motion behavior**

When `prefers-reduced-motion: reduce` is active:

- do not scrub the video based on scroll;
- show the first frame or a still fallback;
- remove large Y transforms and horizontal parallax;
- preserve opacity-based transitions or disable them as appropriate;
- keep the page fully navigable without animation.

**Step 4: Add responsive and overflow protections**

Verify sticky elements, parallax layers, and horizontal brand treatments do not create horizontal scrollbars at narrow widths.

**Step 5: Run the full static verification**

```bash
npm run lint
npm run build
```

---

### Task 9: End-to-end browser verification and adversarial QA

**Files:**
- Modify: any files with defects found during verification
- Test: browser flow for `/` and `/careers`

**Step 1: Start the app**

```bash
npm run dev
```

**Step 2: Verify desktop Home flow**

Using the browser-debugging skill / Playwright:

- load `/`;
- confirm the BIA hero video or fallback is visible;
- scroll through the full hero and confirm the video progress follows scroll without jumps;
- confirm copy remains readable at every phase;
- navigate through all Home sections;
- switch ES → EN and confirm all required copy changes;
- open the mobile menu at a narrow viewport.

**Step 3: Verify Careers flow**

- navigate from the Home talent band;
- confirm the URL is `/careers`;
- verify the page has its own hero and narrative;
- switch locale;
- use browser back/forward;
- verify no Cover/property-configurator content appears.

**Step 4: Verify reduced motion and media failure**

- emulate reduced motion;
- confirm the experience is usable without scrub/parallax;
- block the hero video response and confirm the poster/fallback state is intentional.

**Step 5: Adversarial defect scan**

Check specifically for:

- video seek races when scrolling quickly;
- duplicate Lenis instances under React StrictMode;
- mobile browser autoplay rejection;
- language switch losing scroll position;
- header covering anchor targets;
- parallax causing horizontal overflow;
- alt text drift or missing focus states;
- fake claims or stale Cover copy;
- broken image paths and console errors.

**Step 6: Final build and status report**

```bash
npm run lint
npm run build
```

Report the tested routes, viewport sizes, media fallback result, reduced-motion result, and any remaining blocked content/assets. Do not claim feature completion until critical findings are fixed.

## Execution order

1. Content contract and bilingual state.
2. Reusable media/motion primitives.
3. Shell/header/footer.
4. Home sections.
5. Careers route.
6. Supplied media normalization.
7. Metadata/accessibility.
8. Full browser and adversarial QA.

The current workspace is not initialized as a Git repository, so the plan’s commit checkpoints are optional until Git metadata is available. No implementation should remove the old Cover files until the new Home and Careers routes are independently verified.
