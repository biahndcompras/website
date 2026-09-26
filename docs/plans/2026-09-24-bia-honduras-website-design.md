# BIA Honduras — Website Redesign

**Date:** 2026-09-24  
**Status:** Approved direction — ready for implementation planning  
**Scope:** Replace the current Cover Architectural Labs property-configurator experience with the BIA Honduras corporate coffee and foods experience while preserving the established editorial design language and scroll-driven motion profile.

## Product intent

BIA Honduras should be presented as the Honduran pillar of BIA Foods: an enterprise food company rooted in coffee, with a clear origin story, a quality and food-safety system, a network of iconic brands, and a visible employer brand.

The site must:

- Tell the coffee story from origin and local producers to processing, quality, brands, distribution, and consumers.
- Communicate BIA Foods through its four hubs: Coffee Hub, Culinary Hub, Snacks Hub, and Partners & Food Service.
- Explain the value of working at BIA and attract talent.
- Remain clean, modern, warm, elegant, premium, and enterprise-ready.
- Be bilingual in Spanish and English, with a language switch that does not create a separate visual system.
- Keep the current video-first hero behavior: full-screen video, sticky viewport, scroll-controlled playback, text transitions, and parallax.
- Add new `motion` and scroll effects without making the experience noisy, fragile, or unreadable.

## Current implementation context

The project is a React 19 + Vite + TypeScript application using Tailwind CSS, `motion`, `lenis`, and Lucide icons. The current experience is a Cover Architectural Labs property configurator with a remote architectural video, a 400vh scroll container, sticky hero, video scrubbing, architectural copy, local image assets, tab-based views, localStorage persistence, and a property-feasibility simulator.

The redesign should preserve the useful motion primitives and layout discipline, but replace the product model and content. The existing property-configurator state, types, and views should be retired or replaced rather than left as unrelated product behavior.

## Design direction

**Working concept:** “From Honduras, With Purpose” / “De Honduras, con propósito.”

The visual direction is editorial corporate storytelling: deep elegant blues, warm ivory, restrained coffee/copper accents, small green-mountain notes for sustainability, precise typography, generous whitespace, flat structure, minimal rounded corners, and almost no decorative card UI.

The memorable device is the transition between origin, process, and people through layered scroll choreography. The interface should feel like a premium documentary or brand film rather than a generic product landing page.

### Palette

- Deep navy / mineral blue: primary surfaces and text.
- BIA blue: primary action and navigation accent.
- Warm ivory: light section background.
- Coffee / copper: origin and processing accent.
- Mountain green: sustainability and producer-origin accent.
- Neutral slate: supporting text and dividers.

Exact brand hex values must be confirmed against the supplied BIA identity materials before token lock.

### Typography

Replace the current generic Public Sans pairing with a bilingual-safe editorial system selected from available project assets and licensing. A refined display face for major statements should be paired with a highly legible sans serif for body copy and UI. The system must support Spanish diacritics, English, large fluid headings, and accessible mobile sizing.

## Information architecture

### Home

1. **Hero / Origin Film**
   - Full-screen BIA video, replacing the current architectural house video.
   - Sticky hero and scroll-controlled video scrub remain.
   - Spanish/English headline, short supporting copy, and two restrained CTAs: explore the story and join BIA.
   - Small scroll cue and content metadata.
2. **Brand manifesto**
   - BIA Honduras as the national pillar of BIA Foods.
   - Coffee as the entry point into a wider food ecosystem.
3. **BIA in one view**
   - Four hubs with concise enterprise descriptions and visual treatment.
4. **Coffee origin**
   - Copán, Marcala, and Montecillos.
   - Local coffee farmers, landscape, beans, and traceability.
5. **From seed to cup**
   - Harvest, processing, roasting, grinding, quality, and distribution.
6. **BIA brands**
   - Café El Indio, Café Maya, Oro Puro, and Medalla.
7. **Beyond coffee**
   - Culinary, Snacks, and Partners & Food Service.
8. **Quality, safety, and sustainability**
   - International food-safety standards, responsible value chain, local producers, and Great Place to Work culture.
9. **People / Talent band**
   - Visible employer-brand statement, selected culture highlights, areas of talent, and link to the independent careers experience.
10. **Footer**
    - BIA Foods / BIA Honduras context, hubs, brands, careers, contact, legal, and language access.

### Careers / Talent page

Route: `/careers` with a bilingual alias or language-aware content strategy.

Sections:

- Careers hero using real BIA people or workplace footage.
- “Life at BIA” narrative.
- Values and ways of working.
- Talent areas and role families.
- Selected stories or team moments.
- Hiring process.
- FAQ.
- CTA to current openings.

The careers page must feel editorial and human, not like a generic ATS template.

## Motion system

### Hero

Preserve the current architectural motion model at a product level:

- `400vh` scroll container with sticky viewport.
- `useScroll`, `useTransform`, `useSpring`, and `lenis` remain the motion foundation.
- Video playback is seeked from normalized scroll progress with protection against overlapping seeks.
- Add a poster/fallback state for slow networks, unsupported video, reduced motion, and mobile autoplay restrictions.
- Hero copy fades and translates as the film progresses.
- Add a second visual layer for subtle depth: film grain, color veil, or low-opacity image/video texture only if it supports readability.

### New scroll effects

- Origin landscape layers move at different speeds.
- Producer and process images use restrained counter-parallax.
- Section labels and copy reveal with `whileInView` and small vertical offsets.
- Brand and hub transitions use slow horizontal movement, not abrupt carousel behavior.
- CTA and link microanimations use transform and opacity only.
- Preserve reduced-motion behavior and keyboard focus visibility.
- Avoid parallax that causes layout shifting, horizontal overflow, or unreadable text.

## Content and language

Content is authored in Spanish and English. The language switch must update navigation, labels, headings, body copy, CTAs, and document metadata without reloading the experience or losing the current scroll state.

Do not invent certifications, statistics, office locations, job openings, or sustainability claims. Claims must be either supplied by BIA or clearly marked as placeholders. The provided description establishes the company narrative and brand list, but exact legal copy, statistics, contact details, and careers listings still need source material.

## Technical migration

- Replace the Cover metadata, title, and brand identity in `index.html` and `metadata.json`.
- Remove property configurator, lot feasibility, saved configuration, and property inquiry models.
- Introduce a BIA content model for hubs, brands, origin regions, values, stories, and careers.
- Split the current large `Hero.tsx` into reusable motion/video components and BIA content sections.
- Keep assets local where possible; use remote media only as a deliberate fallback until final files are supplied.
- Keep Lenis lifecycle management in one place and make its behavior responsive to loading and route changes.
- Add explicit `prefers-reduced-motion` handling and video error/fallback states.
- Preserve existing useful accessibility affordances while replacing IDs, labels, and copy.
- Update `README.md` with the new run and content-asset workflow.

## Assets required from BIA

- Official BIA / BIA Foods logo and brand guidelines.
- Final hero video, plus horizontal and mobile-safe crops or a poster frame.
- Real footage or photography for origin regions, producers, facilities, roasting, quality, brands, products, and employees.
- Approved product/brand images and any usage restrictions.
- Careers content, role families, process, contact details, and current openings.
- Approved bilingual copy or a review process for translation.

## Verification target

Before feature closure:

- TypeScript and production build pass.
- Browser verification covers desktop and mobile widths.
- Hero video starts or presents its fallback correctly.
- Scroll scrubbing remains smooth and does not seek incorrectly.
- Navigation and language switching work without losing the experience.
- All required Home and Careers sections are reachable and responsive.
- Reduced-motion mode remains usable.
- No Cover/property-configurator copy, routes, metadata, or fake claims remain in the shipped BIA experience.
- No console errors, broken media, horizontal overflow, or inaccessible interactive controls.
