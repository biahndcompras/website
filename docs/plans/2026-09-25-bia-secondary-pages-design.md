# BIA Honduras — Secondary Pages Design

**Date:** 2026-09-25  
**Status:** Approved for implementation

## Product architecture

Add independent corporate pages around the existing Home and employer-brand experience. Do not introduce hubs as a user-facing concept at this stage. Spanish is the canonical language; English aliases mirror the same page.

| Spanish | English alias | Purpose |
|---|---|---|
| `/nosotros` | `/about` | Identity, history, purpose, values, Grupo Mariposa relationship |
| `/marcas` | `/brands` | El Indio, Café Maya, Oro Puro, Medalla |
| `/calidad-y-sostenibilidad` | `/quality` | Food safety, traceability, producers, origin, standards |
| `/talento` | `/careers` | Employer brand, culture, growth, hiring process, opportunities |
| `/contactanos` | `/contact` | Editorial contact hub by audience |

`/careers` remains a valid route; `/talento` becomes the canonical Spanish route.

## Content truth

Only supplied facts may appear as approved. Office addresses, phone numbers, metrics, certifications, current openings, and press contacts remain explicit placeholders until BIA supplies them. No hubs terminology appears in navigation, page copy, or links.

## Shared experience

Reuse `SiteHeader`, `SiteFooter`, `I18nProvider`, `Reveal`, `ParallaxLayer`, and the current media/fallback system. Secondary pages get a shared editorial page frame with a bounded media slot, bilingual metadata, safe focus states, reduced-motion fallback, and no horizontal overflow. Mobile pages use normal document flow.

## Page composition

- **Nosotros:** narrative hero, company identity, history, purpose/values, timeline placeholders, cross-links.
- **Marcas:** family hero, four editorial brand rows, shared coffee story, quality/contact CTAs. No individual brand routes yet.
- **Calidad:** origin/safety hero, standards, traceability, producer value chain, territory, culture, contact CTA.
- **Talento:** employer hero, why BIA, culture, growth, role families, process, openings placeholder, FAQ.
- **Contactanos:** editorial contact hero, audience routing, office/social placeholders, no fake form submission.

## Verification

Route and translation parity tests, content contract tests, all unit/type/build checks, Impeccable detector, and Playwright verification for `/`, all Spanish routes, English aliases, language switching, anchors, mobile widths, reduced motion, no overflow, and no console errors.
