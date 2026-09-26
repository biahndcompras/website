# BIA Honduras Cinematic Scroll Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the BIA hero complete a deterministic two-cycle scroll film before releasing the Home, and add a cinematic From Seed to Cup track plus reversible Origin/Brands scroll reveals without overlap or accessibility regressions.

**Architecture:** Extend the existing `heroMedia` pure helper and `ScrollVideoHero` with a two-cycle timeline. Extract a reusable reversible scroll reveal and refactor `FromSeedToCup` into a desktop sticky stage with a mobile static fallback. Keep all content and media local to the BIA project; copy only motion behavior from `/orbs`.

**Tech Stack:** React 19, TypeScript, Motion, Lenis, Tailwind CSS 4, Vitest, Playwright.

---

### Task 1: Hero two-cycle timeline

**Files:**
- Modify: `src/components/media/heroMedia.ts`
- Modify: `src/components/media/heroMedia.test.ts`
- Modify: `src/components/media/ScrollVideoHero.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/index.css`

**Step 1: Write failing cycle tests**

Cover progress `0`, `0.25`, `0.5`, `0.75`, `1`, reverse mapping, finite duration, and reset time. Assert the returned cycle, normalized cycle progress, and video time are deterministic and clamped.

**Step 2: Run the focused test**

```bash
npm test -- --run src/components/media/heroMedia.test.ts
```

Expected: FAIL until the cycle mapper exists.

**Step 3: Implement the pure cycle mapper**

Return `{ cycle: 1 | 2, cycleProgress, videoTime }` for two equal scroll cycles. Map a boundary to frame zero and clamp every value to `[0, 1]` and `[0, duration]`.

**Step 4: Integrate the mapper into `ScrollVideoHero`**

Use the mapper for both downward and upward scroll. Preserve the pending-seek queue. Reset to frame zero at the cycle boundary without triggering a false error state. Expose cycle metadata as data attributes and render-state values.

**Step 5: Add the ORBS-inspired frame motion**

Use `motion` style values for inset, radius, and video scale. Keep text transforms/opacity bound to the cycle. Use the same deterministic cycle for reverse scrolling.

**Step 6: Add reduced-motion fallback**

When reduced motion is active, use a single viewport, keep the first frame visible, disable scrub and frame transforms, and keep all copy/controls accessible.

**Step 7: Verify**

```bash
npm test -- --run src/components/media/heroMedia.test.ts
npm run lint
npm run build
```

**Step 8: Browser-check the hero**

Verify video `currentTime` through both cycles, reset at midpoint, sticky release only at the end, and no overlap at desktop/mobile.

---

### Task 2: From Seed to Cup cinematic stage

**Files:**
- Create: `src/components/sections/ProcessCinematicStage.tsx`
- Modify: `src/components/sections/FromSeedToCup.tsx`
- Modify: `src/index.css`
- Create: `src/components/sections/FromSeedToCup.test.ts`

**Step 1: Write failing pure progress tests**

Test seven-step progress mapping, reverse mapping, clamping, and the active-step index. Keep the helper independent of DOM/media.

**Step 2: Run the focused test**

```bash
npm test -- --run src/components/sections/FromSeedToCup.test.ts
```

Expected: FAIL because the process progress helper/stage does not exist.

**Step 3: Implement the progress helper and stage**

Adapt the CaseStudies panel grammar: a bounded sticky stage, panel inset/position/radius, visual scale/vertical drift, rail scale, and step emphasis. Use `biaContent.processSteps` and the existing bilingual copy. Keep the media slot decorative and bounded.

**Step 4: Implement responsive fallback**

Use a media-query hook or CSS state to disable sticky positioning and absolute panel geometry below the desktop breakpoint. Render all process steps in normal flow, with no hidden or overlapped content.

**Step 5: Replace the existing flat From Seed layout**

Keep the section ID and header copy. Mount the cinematic stage below it. Ensure reverse scroll restores the same active step and visual state.

**Step 6: Verify**

```bash
npm test -- --run src/components/sections/FromSeedToCup.test.ts
npm run lint
npm run build
```

**Step 7: Browser-check desktop and mobile**

Measure stage bounds, panel bounds, text bounds, and buttons. Scroll down and up; verify the process reverses and the mobile fallback has no horizontal overflow.

---

### Task 3: Reversible Origin and Brands reveals

**Files:**
- Create: `src/components/motion/ScrollReveal.tsx`
- Create: `src/components/motion/ScrollReveal.test.ts`
- Modify: `src/components/sections/OriginStory.tsx`
- Modify: `src/components/sections/BrandsSection.tsx`
- Modify: `src/index.css`

**Step 1: Write failing tests**

Test a pure progress-to-visibility mapper: entering, center, leaving, reverse direction, clamping, and reduced-motion fallback.

**Step 2: Run the focused test**

```bash
npm test -- --run src/components/motion/ScrollReveal.test.ts
```

Expected: FAIL until the mapper exists.

**Step 3: Implement `ScrollReveal`**

Use `useScroll` with a target and `useTransform`/`useSpring`. Use opacity `0 → 1 → 0` and y `40 → 0 → -40`; no layout properties. Reduced motion returns visible/static values.

**Step 4: Integrate into Origin and Brands**

Wrap the visual/cinematic layers that need reversible presence. Keep semantic headings, labels, and links outside opacity-zero wrappers so keyboard users can always reach them.

**Step 5: Verify**

```bash
npm test -- --run src/components/motion/ScrollReveal.test.ts
npm run lint
npm run build
```

**Step 6: Browser-check reversibility**

Scroll Origin and Brands down, back up, and through reduced motion. Confirm the layers reappear and no text becomes permanently hidden.

---

### Task 4: Full regression and adversarial QA

**Files:**
- Modify: any files with verified defects
- Update: `verification.md`

**Step 1: Run all gates**

```bash
npm test -- --run
npm run lint
npm run build
node /Users/ecalderonl/.agents/skills/impeccable/scripts/detect.mjs --json src/pages src/components src/index.css
```

**Step 2: Browser verification**

Check `/` and `/careers` at 1440×900 and 390×844:

- hero cycle midpoint reset;
- sticky release after second cycle;
- process stage reverse scroll;
- Origin/Brands reversible reveals;
- reduced motion;
- no overlap or horizontal overflow;
- no console errors;
- locale switching and anchors remain intact.

**Step 3: Run the project-specific validator**

Use `.agents/skills/validate/SKILL.md` and record findings. Critical or medium findings must be corrected before closure.

**Step 4: Update evidence**

Write exact commands, observations, and any blocked approved-media inputs to `verification.md`.
