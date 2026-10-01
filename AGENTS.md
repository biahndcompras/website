# AGENTS.md

Bilingual (ES/EN) corporate site for BIA Honduras. React 19 · Vite · React Router 7 · Motion · Lenis · Tailwind 4 · Vitest.

**Read `STATE.md` first** for project status and outstanding work. `verification.md` holds measured evidence.

## Commands

```bash
npm test -- --run    # 164 tests. Without --run, vitest watches.
npm run lint         # tsc --noEmit
npm run build
npm run dev -- --port 3400   # 3000 is hardcoded in the script and often taken
```

Single test file: `npx vitest --run src/content/secondaryPages.test.ts`

Mechanical UI detector (path is machine-specific — verify it exists before citing it):
```bash
node ~/.agents/skills/impeccable/scripts/detect.mjs --json src/pages src/components src/index.css
```

## Testing model — there is no DOM

Vitest runs `environment: 'node'`. No jsdom, no testing-library, no playwright, no `@types/react` in `package.json`.

So tests are **source and CSS contract tests**, not rendering tests:
- Pure functions (`heroMedia.ts`, `motionStoryMedia.ts`, `processVisuals.ts`).
- Source-text assertions — read a `.tsx` and assert on its string content.
- **Layout contracts read the real stylesheet** via `src/test/cssContract.ts`
  (`CssContract`, `parseCss`, `readSource`, `splitTracks`). This is the mechanism
  that keeps a layout invariant true against the actual CSS.

Two consequences:
- **`<Fragment key={id}>` instead of `key` on a component.** Without
  `@types/react` there are no JSX intrinsic attributes, so `key` on a custom
  component is a type error: `Property 'key' does not exist on type Props`.
  Existing code uses `Fragment` for exactly this reason. Don't "fix" it.
- `tsconfig.json` has no `strict`. Don't assume strict-null or exhaustive
  checking — verify a change actually compiles rather than inferring safety.

**Green tests are not evidence of correct behaviour.** Verify in a browser before
claiming something works. This repo has a history of tests passing over genuinely
broken things — a frozen video, a broken production deploy. See "Known traps".

## Content truth — the most important rule

**Never invent facts.** Metrics, certifications, standards, addresses, history
dates, vacancies, contact details. Everything unapproved lives in
`src/content/secondaryPages.ts` with `status: 'placeholder'` and a `pending` note
that renders visibly on the page via `SecondaryPendingNote`
(`data-content-status="placeholder"`).

To promote a placeholder: set `status: 'approved'` and fill the value. The note
disappears on its own.

`secondaryPageMetrics` is `[]` on purpose. `/contactanos` has no `<form>`,
`mailto:`, or `tel:` — a form appears only when a real destination exists.
Tests enforce this.

## The two videos are independent — do not unify them

| | Hero | MotionStory (2nd video) |
|---|---|---|
| File | `bia-origin-hero.mp4` (15.52s) | `bia-motion-story.mp4` (23.06s) |
| Track | `h-[400vh]` in `ScrollVideoHero.tsx` | `260vh` in `index.css` |
| Transport | **seek** — `currentTime` per scroll frame | **playback** — native play at `playbackRate` 0.25–0.5 |
| `preload` | `metadata` | `auto` |

- **The Hero is not to be modified without evidence it is the cause.** It was
  explicitly restored once already. `git diff 62cab51 HEAD -- src/components/media/heroMedia.ts src/components/media/ScrollVideoHero.tsx src/components/Hero.tsx`
  must stay empty.
- MotionStory must **play, not seek**. With `preload="metadata"` only ~4.7s of
  23s was buffered, so every seek past it had to download before painting and the
  film froze. If you see a "static video" bug, suspect buffering before logic.
- `playbackRate` never goes below 0.25 — Safari rejects values under 0.5 on some
  sources. That floor is technical, not stylistic.
- Playback stops via `IntersectionObserver` on the track, **not** scroll
  progress: progress reads `0` both "before the section" and "at the track start",
  so a progress check keeps decoding frames nobody can see.

## Ratios are split across two files — edit both or fail the suite

The scrub rate is `scrollablePx / scrubWindowSeconds`. Its two halves live in
different files:

- `MOTION_STORY_SCRUB_WINDOW_SECONDS` (12) in `src/components/media/motionStoryMedia.ts`
- track height (`260vh`) in `src/index.css`

`motionStoryMedia.test.ts` reads the live CSS and asserts the combined rate stays
in `MOTION_STORY_MIN/MAX_PX_PER_SECOND` (90/170). Change one without the other
and the suite fails — that is intentional.

Same pattern in `src/components/layout/SecondaryPageShell.test.ts`: layout
invariants are asserted against the stylesheet, not against component props.

## Known traps

- **Production 404s on every client route** until Vercel redeploys after any
  change to `vercel.json`. In-app navigation always looks fine because React
  Router never hits the network — this reads as a routing or locale bug when it
  is neither. Check a hard reload of a subpage first.
  **Last checked 2026-10-01: still 404** — verify with
  `curl -s -o /dev/null -w '%{http_code}' https://biahonduras.vercel.app/nosotros`
  before assuming it is fixed. Note the local Vercel CLI is authenticated as
  `biamxai-2610s-projects`, which does **not** own that domain, so the CLI cannot
  trigger the redeploy. See STATE.md §7.1.
- **A "language selector broken" report is usually not the selector.** The
  persisted locale lives in `localStorage['bia-honduras-locale']` and survives
  reloads. If it appears to reset, the app probably never reloaded.
- `dev` script hardcodes `--port=3000`; pass `--port 3400` if 3000 is taken.
- The working copy is on a removable volume, so the filesystem scatters `._*`
  AppleDouble files everywhere. They are gitignored; don't try to commit or
  delete them individually. **`vitest.config.ts` now excludes `**/._*`** because a
  sidecar beside a new test file (e.g. `src/._palette.test.ts`) is a binary stub
  that matches the test glob and kills esbuild with `Unexpected "\x00"`, failing
  a test *file* while every test itself passes.
- **`page.screenshot({ clip })` clips in DOCUMENT coordinates, not viewport
  ones.** Pairing it with `getBoundingClientRect()` mixes scroll positions and
  invents contrast failures. Call `page.screenshot()` with no `clip` so the image
  maps 1:1 to the viewport.
- **This browser silently rejects CSS gradients in `ctx.fillStyle`.** An audit
  that rebuilds a background on a canvas sees no gradient at all and reports the
  page background. Sample real screenshot pixels instead.
- **Contrast audits need `prefers-reduced-motion: reduce`.** Without it, reveal
  animations are sampled mid-transition and light text reads as sitting on a
  light background.
- **`tsc` and the test suite cannot see CSS.** A bulk rename once collapsed
  `--bia-blue`, `--bia-blue-light` and `--bia-blue-deep` into one token (a
  `\b` word boundary also matches before the `-` in `--bia-blue-light`), leaving
  two custom properties undefined. Every `var()` of the missing name became an
  invalid declaration silently inheriting, across 50 rules, with all tests green.
  `src/palette.test.ts` asserts the palette contract against the real stylesheet —
  read it before changing any colour token.
- `orbs/`, `assets/`, and `src/assets/` (~137MB) are **gitignored legacy**.
  Nothing imports from them; all served media comes from `public/media/`. Do not
  re-add them to git, and do not "fix" a missing import by reaching into them.
- `.agents/skills/validate/SKILL.md` is an adversarial-QA checklist. It is
  **stale in two specific ways** and its remaining items are still useful:
  - It describes a Hero "scroll cycle" and restart. The Hero is a single scrub
    with no cycle — that was removed.
  - It describes an "ORBS motion grammar". MotionStory reuses the grammar, not
    the code or assets.
  Trust the code over the skill.

## Content and copy

All user-facing strings live in `src/i18n/translations.ts` (Home, careers, shared)
or `src/content/secondaryPages.ts` (subpages). Parity tests enforce both locales
exist for every key. Spanish is canonical; English aliases mirror it.

No page, nav, or footer may mention the **hubs**. That was a product decision.
The Home still has its pre-existing hubs section — removing it is a decision, not
a bug fix, so do not remove it unprompted.
