# BIA Honduras — Revised Cinematic Layout

**Date:** 2026-09-25  
**Status:** Approved — supersedes the previous ORBS integration plan

## Decision

Do not merge the two ORBS Hero templates into the BIA Hero or From Seed to Cup. Restore the BIA Hero to its established behavior and use the ORBS motion grammars in separate, purpose-specific sections.

## Final layout

1. BIA Hero: existing local coffee film, sticky scroll scrub, established BIA copy and frame. No ORBS Hero frame/two-cycle treatment.
2. From Seed to Cup: existing editorial process layout, without the CaseStudies-derived stage.
3. New `MotionStory` section between Brands and Quality: local UHD coffee film (`23.06s`) as the primary visual, adapted from the second ORBS Hero's sticky track and cinematic frame treatment.
4. CTA within/after MotionStory: adapted from ORBS CaseStudies, with the right visual expanding as the scroll advances.
5. Quality/Sustainability: explicit non-overlapping grid and bounded visual slot; no absolute visual may cover the title.

## Media

- Hero: `public/media/bia-origin-hero.mp4` (existing 15.52s local film).
- New section: normalized web derivative of `src/assets/17190655-uhd_3840_2160_24fps.mp4`, preserving the selected 23.06s coffee footage without shipping a 72MB 4K browser asset.

## Responsive/accessibility contract

- Desktop cinematic tracks use bounded sticky stages and safe header offsets.
- Mobile uses normal document flow; no content is hidden behind video or panels.
- Reduced motion disables scrub, sticky cinematic motion, and parallax while keeping all copy/actions visible.
- Every visual has explicit overflow, stacking, and safe-area rules; browser bounding-box checks are required.

## Verification

Add tests for media contracts and CTA progress, run all unit/type/build checks, run the Impeccable detector, and use Playwright to verify original Hero behavior, new video section, CTA expansion, Quality non-overlap, reverse scroll, mobile fallback, reduced motion, locale switching, and console cleanliness.
