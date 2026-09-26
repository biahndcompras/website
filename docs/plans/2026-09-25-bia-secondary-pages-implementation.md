# BIA Honduras Secondary Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add bilingual corporate subpages for Nosotros, Marcas, Calidad y sostenibilidad, Talento, and Contactanos while keeping the existing Home, cinematic motion, and employer-brand experience stable.

**Architecture:** Extend the current React Router map with canonical Spanish routes and English aliases. Keep content in typed bilingual modules, reuse the shared header/footer/i18n/motion primitives, and build each page as a route-level composition rather than one oversized component. No backend form or invented contact data is introduced.

**Tech Stack:** React 19, TypeScript, React Router, Tailwind CSS 4, Motion, Lenis, Vitest, Playwright.

---

### Task 1: Route, content, and translation foundation

**Files:**
- Modify: `src/app/routes.ts`
- Modify: `src/app/routes.test.ts`
- Modify: `src/components/layout/siteNavigation.ts`
- Modify: `src/components/layout/siteNavigation.test.ts`
- Create: `src/content/secondaryPages.ts`
- Create: `src/content/secondaryPages.test.ts`
- Modify: `src/i18n/translations.ts`
- Modify: `src/i18n/translations.test.ts`

**Steps:**
1. Write failing route tests for `/nosotros`, `/about`, `/marcas`, `/brands`, `/calidad-y-sostenibilidad`, `/quality`, `/talento`, `/careers`, `/contactanos`, `/contact`.
2. Run the focused route test and observe failure.
3. Add typed page metadata and route-alias normalization.
4. Add bilingual navigation copy for the new pages without adding hubs.
5. Add secondary-page translations and key-parity tests.
6. Run focused tests, all tests, lint, and build.

### Task 2: Shared secondary page frame and shell navigation

**Files:**
- Create: `src/components/layout/SecondaryPageShell.tsx`
- Create: `src/components/layout/SecondaryPageShell.css` or append scoped rules to `src/index.css`
- Modify: `src/components/layout/SiteHeader.tsx`
- Modify: `src/components/layout/SiteFooter.tsx`
- Modify: `src/App.tsx`

**Steps:**
1. Write a source contract test for the page frame and navigation destinations.
2. Implement a bounded editorial page frame with a hero slot, section spacing, responsive padding, safe focus states, and reduced-motion behavior.
3. Update header/footer to link to real routes while preserving locale state and anchor behavior on Home.
4. Add the route outlet structure without changing Home motion components.
5. Run focused tests, all tests, lint, build, and detector.

### Task 3: Nosotros page

**Files:**
- Create: `src/pages/NosotrosPage.tsx`
- Create: `src/pages/NosotrosPage.test.ts` or content contract test
- Modify: `src/content/secondaryPages.ts`

**Steps:**
1. Write a failing test for identity/history/value content and the absence of hub terminology.
2. Implement the bilingual page with narrative hero, company story, Grupo Mariposa/BIA Foods relationship, values, and approved/placeholder timeline items.
3. Add cross-links to Marcas, Calidad, Talento, and Contactanos.
4. Run focused tests, all tests, lint, build, and browser smoke test.

### Task 4: Marcas and Calidad pages

**Files:**
- Create: `src/pages/MarcasPage.tsx`
- Create: `src/pages/CalidadPage.tsx`
- Create focused page/content tests
- Modify: `src/content/secondaryPages.ts`

**Steps:**
1. Write failing tests for the four brand entries, quality pillars, placeholder status, and Spanish/English copy.
2. Implement editorial brand rows without individual product routes.
3. Implement origin, food-safety, traceability, producer, standards, and culture sections without invented certifications or metrics.
4. Add bounded visual slots and restrained reveals; no generic equal card grid.
5. Run focused tests, all tests, lint, build, detector, and browser checks.

### Task 5: Talento page and alias

**Files:**
- Create: `src/pages/TalentoPage.tsx`
- Modify: `src/pages/CareersPage.tsx` or reuse it as the canonical talent page
- Modify: `src/App.tsx`
- Create/update talent page tests

**Steps:**
1. Write failing tests for canonical `/talento`, English `/careers`, employer content, and openings placeholder.
2. Move the existing careers composition to the canonical route while keeping `/careers` working.
3. Preserve bilingual copy, focus states, reduced motion, and the Home talent CTA.
4. Run focused tests, all tests, lint, build, and browser checks.

### Task 6: Contactanos page

**Files:**
- Create: `src/pages/ContactanosPage.tsx`
- Create: `src/pages/ContactanosPage.test.ts`
- Modify: `src/content/secondaryPages.ts`
- Modify: `src/i18n/translations.ts`

**Steps:**
1. Write failing tests for audience routing, placeholder contact data, and no fake submission behavior.
2. Implement the editorial contact page with general, partners/brands, press, and talent routes.
3. Render contact details as explicit placeholders until BIA supplies approved data; do not add a fake form endpoint.
4. Add cross-links to Talento, Calidad, and Marcas.
5. Run focused tests, all tests, lint, build, and browser checks.

### Task 7: Full QA and evidence

**Files:**
- Modify any files with verified defects
- Update: `verification.md`

**Steps:**
1. Run all automated gates and the Impeccable detector.
2. Use Playwright at desktop/mobile for every Spanish route and English alias.
3. Verify language switching, history preservation, metadata, focus, mobile flow, reduced motion, no overflow, and console errors.
4. Apply the project-specific invariants in `.agents/skills/validate/SKILL.md`.
5. Record exact evidence and remaining BIA content handoffs in `verification.md`.
