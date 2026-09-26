import { describe, expect, it } from 'vitest';
import {
  ENGLISH_ROUTE_ALIASES,
  getCanonicalRoutePath,
  ROUTE_PATHS,
} from '../app/routes';
import {
  contactAudiences,
  contactChannels,
  getSecondaryPage,
  historyMoments,
  qualityPillars,
  SECONDARY_BRAND_ENTRIES,
  SECONDARY_PAGE_IDS,
  secondaryValues,
  talentAreas,
  talentOpenings,
} from '../content/secondaryPages';
import { readSource } from '../test/cssContract';

const appSource = readSource('src/App.tsx');
const routeSource = readSource('src/app/routes.ts');
const headerSource = readSource('src/components/layout/SiteHeader.tsx');
const footerSource = readSource('src/components/layout/SiteFooter.tsx');
const navigationSource = readSource('src/components/layout/siteNavigation.ts');
const shellSource = readSource('src/components/layout/SecondaryPageShell.tsx');

/** Both ids resolve to the same employer-brand page. */
const TALENT_ALIAS_IDS = ['talento', 'careers'] as const;

const pageFiles: Record<(typeof SECONDARY_PAGE_IDS)[number], string> = {
  nosotros: 'src/pages/NosotrosPage.tsx',
  marcas: 'src/pages/MarcasPage.tsx',
  calidad: 'src/pages/CalidadPage.tsx',
  talento: 'src/pages/TalentoPage.tsx',
  contactanos: 'src/pages/ContactanosPage.tsx',
};

const pageSource = (id: keyof typeof pageFiles): string => readSource(pageFiles[id]);

/**
 * Reads the onward-link ids a page declares through the shared cross-link grid.
 * The grid resolves ids to canonical paths itself, so the source only names ids.
 */
function crossLinkTargets(id: keyof typeof pageFiles): string[] {
  const source = pageSource(id);
  const targets: string[] = [];
  const pattern = /targets=\{\[([\s\S]*?)\]\}/g;

  for (const match of source.matchAll(pattern)) {
    for (const entry of match[1].matchAll(/id:\s*'([a-z]+)'/g)) {
      targets.push(entry[1]);
    }
  }

  return targets;
}

describe('Secondary route registration', () => {
  it('mounts every canonical Spanish page and resolves its English alias to the same id', () => {
    for (const id of SECONDARY_PAGE_IDS) {
      const page = getSecondaryPage(id);

      expect(ROUTE_PATHS[id]).toBe(page.canonicalPath);
      // The canonical path reaches the route table through the routes module.
      expect(routeSource).toContain(ROUTE_PATHS[id]);
      expect(appSource).toContain(`path={ROUTE_PATHS.${id}}`);
      expect(ENGLISH_ROUTE_ALIASES[page.aliasPath]).toBe(id);
    }
  });

  it('serves the talent composition on both the canonical and the English path', () => {
    expect(appSource).toContain(`path={ROUTE_PATHS.talento}`);
    expect(appSource).toContain(`path={ROUTE_PATHS.careers}`);
    expect(appSource.match(/<TalentoPage \/>/g)).toHaveLength(2);
  });

  it('declares every English alias as a real route so a direct visit renders the page', () => {
    for (const [alias, target] of Object.entries(ENGLISH_ROUTE_ALIASES)) {
      if (target === 'talento') {
        // `/careers` is a declared route, not just a canonicalization hint.
        expect(ROUTE_PATHS.careers).toBe(alias);
        continue;
      }

      expect(ROUTE_PATHS[target]).not.toBe(alias);
      expect(appSource).toContain(`path={ROUTE_PATHS.${target}}`);
    }
  });

  it('gives every secondary page its own hero hook for the header theme', () => {
    expect(appSource).toContain("'secondary-hero'");

    for (const id of TALENT_ALIAS_IDS) {
      expect(appSource).toContain(`'${id}'`);
    }
  });

  it('offers every secondary page from the header and the footer', () => {
    for (const id of SECONDARY_PAGE_IDS) {
      expect(ROUTE_PATHS[id]).toBeDefined();
    }

    expect(navigationSource).toContain('ROUTE_PATHS.nosotros');
    expect(navigationSource).toContain('ROUTE_PATHS.marcas');
    expect(navigationSource).toContain('ROUTE_PATHS.calidad');
    expect(navigationSource).toContain('ROUTE_PATHS.talento');
    expect(navigationSource).toContain('ROUTE_PATHS.contactanos');
    expect(footerSource).toContain('ROUTE_PATHS.nosotros');
    expect(footerSource).toContain('ROUTE_PATHS.marcas');
    expect(footerSource).toContain('ROUTE_PATHS.calidad');
    expect(footerSource).toContain('ROUTE_PATHS.talento');
    expect(footerSource).toContain('ROUTE_PATHS.contactanos');
  });

  it('marks the nav item current on both talent paths, not only the canonical one', () => {
    // `/careers` resolves to the `careers` id, so aria-current must compare the
    // alias id as well or the Talent nav item goes unmarked on the alias.
    expect(headerSource).toContain('getRouteAliasId');
    expect(headerSource).toContain('canonicalRouteId');
    expect(headerSource).toMatch(/item\.id === routeId \|\| item\.id === canonicalRouteId/);
  });

  it('marks each footer destination exactly once', () => {
    // The four brand names all point at /marcas, so none may claim
    // aria-current; the Explore group owns that page instead.
    const brandGroup = footerSource.slice(
      footerSource.indexOf("t('footer.brands')"),
      footerSource.indexOf('site-footer__group--action'),
    );

    expect(brandGroup).not.toContain('aria-current');
    expect(footerSource).toContain("routeId === 'marcas' ? 'page' : undefined");
  });

  it('points every alias at its canonical Spanish path', () => {
    // Each alias is a real route, so it must declare the canonical URL or the
    // same page becomes indexable twice.
    expect(appSource).toContain('getCanonicalRoutePath');
    expect(appSource).toContain("link[rel=\"canonical\"]");

    for (const [alias, target] of Object.entries(ENGLISH_ROUTE_ALIASES)) {
      expect(getCanonicalRoutePath(alias), alias).toBe(ROUTE_PATHS[target]);
      expect(getCanonicalRoutePath(ROUTE_PATHS[target]), target).toBe(
        ROUTE_PATHS[target],
      );
    }
  });

  it('marks the contact action current on the contact page', () => {
    // Contact is the sixth destination, so it lives in the header action rather
    // than the five-item nav; that link must still carry aria-current.
    expect(headerSource).toMatch(
      /aria-current=\{canonicalRouteId === 'contactanos' \? 'page' : undefined\}/,
    );
  });

  it('never points a page or link at an unpublished detail route', () => {
    const sources = [appSource, headerSource, footerSource, ...Object.values(pageFiles).map(readSource)];

    for (const source of sources) {
      expect(source).not.toMatch(/\/marcas\/[a-z]/);
      expect(source).not.toMatch(/\/nosotros\/[a-z]/);
      expect(source).not.toMatch(/\/calidad-y-sostenibilidad\/[a-z]/);
    }
  });
});

describe('Secondary page composition', () => {
  it('reads its copy from the shared bilingual content module', () => {
    for (const id of SECONDARY_PAGE_IDS) {
      const source = pageSource(id);
      const usesContentModule =
        source.includes('getSecondaryPage') ||
        source.includes('getSecondarySectionCopy') ||
        source.includes('talentOpenings');

      expect(usesContentModule).toBe(true);
      expect(source).toContain(`'${id}'`);
    }
  });

  it('gives every secondary page a single page landmark with the page id', () => {
    // The frame owns the landmark and the data attribute; each page must opt in.
    expect(shellSource).toContain('data-page={pageId}');

    for (const id of SECONDARY_PAGE_IDS) {
      const source = pageSource(id);

      expect(source).toContain('<SecondaryPage');
      expect(source).toMatch(/pageId=\{?pageId\}?|<SecondaryPage pageId="/);
    }
  });

  it('never reintroduces the hubs concept in navigation, copy or page sources', () => {
    const sources = [
      ...Object.values(pageFiles).map((file) => readSource(file)),
      appSource,
      headerSource,
      footerSource,
    ];

    for (const source of sources) {
      expect(source.toLowerCase()).not.toContain('hub');
    }
  });

  it('links each page onward to the rest of the corporate story', () => {
    // Onward links are declared as page ids and resolved by the shared frame.
    for (const id of SECONDARY_PAGE_IDS) {
      const targets = crossLinkTargets(id);
      const others = SECONDARY_PAGE_IDS.filter((candidate) => candidate !== id);

      expect(targets.length).toBeGreaterThan(0);
      for (const target of targets) {
        expect(others).toContain(target);
      }
    }
  });
});

describe('Nosotros composition', () => {
  const source = pageSource('nosotros');

  it('renders the history as a timeline that shows pending periods instead of dates', () => {
    expect(source).toContain('historyMoments');
    expect(source).toContain('period');
    expect(source).toContain('HISTORY_PERIOD_PENDING');
    for (const moment of historyMoments) {
      expect(moment.period).toBeNull();
      expect(moment.status).toBe('placeholder');
    }
  });

  it('renders the company values as a list', () => {
    expect(source).toContain('secondaryValues');
    expect(source).toContain('<ol className="secondary-list secondary-list--light">');
    expect(secondaryValues).toHaveLength(4);
  });
});

describe('Marcas composition', () => {
  const source = pageSource('marcas');

  it('presents the four approved brands without individual product routes', () => {
    expect(source).toContain('SECONDARY_BRAND_ENTRIES');
    expect(SECONDARY_BRAND_ENTRIES.map((brand) => brand.id)).toEqual([
      'el-indio',
      'cafe-maya',
      'oro-puro',
      'medalla',
    ]);
    expect(source).not.toContain('/marcas/');
  });

  it('marks every unapproved product detail as pending copy', () => {
    for (const brand of SECONDARY_BRAND_ENTRIES) {
      expect(brand.status).toBe('placeholder');
      expect(brand.pending).toBeTruthy();
    }
    expect(source).toContain('SecondaryPendingNote');
  });
});

describe('Calidad composition', () => {
  const source = pageSource('calidad');

  it('renders every quality pillar', () => {
    expect(source).toContain('qualityPillars');
    expect(qualityPillars).toHaveLength(6);
    for (const pillar of qualityPillars) {
      expect(pillar.status === 'approved' || pillar.status === 'placeholder').toBe(true);
    }
  });

  it('states no certification, standard or metric as fact', () => {
    expect(source.toLowerCase()).not.toContain('certificad');
    expect(source).toContain('SecondaryPendingNote');
  });
});

describe('Talento composition', () => {
  const source = pageSource('talento');

  it('describes talent areas without reusing the hubs data', () => {
    expect(source).toContain('talentAreas');
    expect(source).not.toContain('biaContent.hubs');
    expect(talentAreas).toHaveLength(4);
  });

  it('shows the approved openings state instead of inventing vacancies', () => {
    expect(source).toContain('talentOpenings');
    expect(talentOpenings.count).toBeNull();
    expect(talentOpenings.status).toBe('placeholder');
  });

  it('keeps the employer-brand composition reachable on the existing english path', () => {
    expect(source).toContain('CareersHero');
    expect(source).toContain('CareersAreas');
    expect(source).toContain('CareersProcess');
    expect(source).toContain('CareersValues');
    expect(appSource).toContain(`path={ROUTE_PATHS.careers} element={<TalentoPage />}`);
  });

  it('gives every value and area row its own copy instead of one shared line', () => {
    const valuesSource = readSource('src/components/sections/CareersValues.tsx');
    const areasSource = readSource('src/components/sections/CareersAreas.tsx');

    // Repeating one sentence under every row reads as filler, so each row must
    // use the description its own data entry carries.
    expect(valuesSource).toContain('value.description[locale]');
    expect(valuesSource).not.toContain("t('careers.values.detail')");
    expect(areasSource).toContain('area.description[locale]');
    expect(areasSource).not.toContain('areaDescriptionKeys');
  });
});

describe('Contactanos composition', () => {
  const source = pageSource('contactanos');

  it('routes each audience to an internal destination', () => {
    expect(source).toContain('contactAudiences');
    for (const audience of contactAudiences) {
      expect(audience.destination.startsWith('/')).toBe(true);
      expect(audience.status).toBe('placeholder');
    }
  });

  it('renders every audience row with a pending note and no dead link', () => {
    expect(source).toContain('audience.destination');
    expect(source).toContain('audience.pending');
    expect(source).toContain('secondary-link--compact');
    expect(source).not.toContain('href="#"');

    // A row action may only appear for an audience with a distinct destination.
    const talentOnly = source.includes("audience.id === 'talent'");
    expect(talentOnly).toBe(true);
    expect(contactAudiences.filter((a) => a.id === 'talent')).toHaveLength(1);
  });

  it('never ships a form or an unapproved contact value', () => {
    expect(source).not.toContain('<form');
    expect(source).not.toContain('mailto:');
    expect(source).not.toContain('type="email"');
    expect(source).not.toContain('action=');
    for (const channel of contactChannels) {
      expect(channel.value).toBeNull();
    }
  });

  it('publishes an explicit pending note for the contact channels', () => {
    expect(source).toContain('contactChannels');
    expect(source).toContain('SecondaryPendingNote');
  });
});
