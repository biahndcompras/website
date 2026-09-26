# BIA Honduras — Cinematic Scroll Enhancement

**Date:** 2026-09-25  
**Status:** Approved for implementation  
**Scope:** Extend the existing BIA scroll system without changing the brand direction.

## Source evaluation

`orbs/src/components/Hero.tsx` contributes the sticky media frame, progressive inset, border-radius transition, video scale, and text fade/translate behavior.

`orbs/src/components/CaseStudies.tsx` contributes the second sticky cinematic track: bounded panel expansion, positional offsets, internal media scale/vertical drift, and scroll-linked copy opacity. ORBS content, remote media, and solar claims are not reused.

## Hero contract

The BIA hero keeps the local coffee film as its primary medium and uses a two-cycle scroll timeline:

- Scroll progress 0–50% maps the video from frame zero to its duration.
- At the midpoint, the video returns to frame zero and starts cycle two.
- Scroll progress 50–100% maps cycle two from frame zero to its duration.
- The next Home section is not released until the second cycle is complete.
- The video remains non-autoplay and scroll-controlled; the cycle reset is deterministic and seek-safe.
- Reduced motion removes scrub/parallax and collapses the track to a single viewport.

The ORBS frame treatment is adapted as transform/motion values: inset, radius, video scale, and text fade. No layout-property animation is introduced.

## From Seed to Cup contract

The process section becomes a long sticky cinematic track on desktop, based on the CaseStudies motion grammar:

- Header remains the editorial introduction.
- A bounded process stage holds the visual slot and the seven process steps.
- Scroll progress controls panel inset/position/radius, visual scale/drift, step emphasis, and rail progress.
- Reversing scroll reverses the process state.
- Mobile uses a normal stacked layout; no sticky panel or transform may hide or overlap content.

## Reversible reveals

Origin Story and Brands each receive a reversible scroll-linked reveal:

- opacity `0 → 1 → 0`;
- y `40 → 0 → -40`;
- reduced motion keeps the content visible;
- no `whileInView once` is used for the cinematic layers.

## Layer safety

Media is always bounded by `overflow: hidden`; copy occupies its own grid column; overlays use explicit stacking and `pointer-events: none`; desktop sticky stages reserve a header-safe region; mobile disables stage positioning. Browser verification checks bounding-box intersections at 1440×900 and 390×844.

## Verification

Add pure tests for hero cycle mapping and process progress. Run unit tests, typecheck, build, the Impeccable detector, and Playwright checks for descending/ascending scroll, video cycle reset, reversible reveals, mobile fallback, reduced motion, overflow, and console errors.
