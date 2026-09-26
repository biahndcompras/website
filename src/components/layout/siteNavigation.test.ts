import { describe, expect, it } from 'vitest';
import { getRouteId, ROUTE_PATHS } from '../../app/routes';
import { translations } from '../../i18n/translations';
import { getSiteMetadata, getSiteNavigation } from './siteNavigation';

const SECONDARY_NAVIGATION_IDS = [
  'nosotros',
  'marcas',
  'calidad',
  'talento',
  'contactanos',
] as const;

describe('BIA site shell navigation', () => {
  it('sends the primary navigation to the real pages instead of Home anchors', () => {
    const spanish = getSiteNavigation('es');
    const english = getSiteNavigation('en');

    expect(spanish.map((item) => item.id)).toEqual([
      'home',
      ...SECONDARY_NAVIGATION_IDS,
    ]);
    expect(english.map((item) => item.id)).toEqual(spanish.map((item) => item.id));
    expect(spanish.map((item) => item.href)).toEqual([
      '#top',
      ROUTE_PATHS.nosotros,
      ROUTE_PATHS.marcas,
      ROUTE_PATHS.calidad,
      ROUTE_PATHS.talento,
      ROUTE_PATHS.contactanos,
    ]);
  });

  it('translates every destination in both locales without hub wording', () => {
    expect(getSiteNavigation('es').map((item) => item.label)).toEqual([
      translations.es['navigation.home'],
      translations.es['navigation.nosotros'],
      translations.es['navigation.marcas'],
      translations.es['navigation.calidad'],
      translations.es['navigation.talento'],
      translations.es['navigation.contactanos'],
    ]);
    expect(getSiteNavigation('en').map((item) => item.label)).toEqual([
      translations.en['navigation.home'],
      translations.en['navigation.nosotros'],
      translations.en['navigation.marcas'],
      translations.en['navigation.calidad'],
      translations.en['navigation.talento'],
      translations.en['navigation.contactanos'],
    ]);

    for (const locale of ['es', 'en'] as const) {
      for (const item of getSiteNavigation(locale)) {
        expect(item.label.trim().length).toBeGreaterThan(0);
        expect(item.label).not.toMatch(/\bhubs?\b/i);
      }
    }
  });

  it('never points the primary navigation at an unregistered route', () => {
    for (const pathname of ['/', '/careers', '/nosotros', '/about', '/contactanos']) {
      for (const item of getSiteNavigation('es', pathname)) {
        if (item.id === 'home') {
          expect(item.href === '#top' || item.href === ROUTE_PATHS.home).toBe(true);
          continue;
        }

        expect(getRouteId(item.href), `${pathname}:${item.id}`).not.toBeNull();
      }
    }
  });

  it('keeps the Home anchor on Home and a real Home link everywhere else', () => {
    expect(getSiteNavigation('es').find((item) => item.id === 'home')?.href).toBe(
      '#top',
    );

    for (const pathname of [
      ROUTE_PATHS.careers,
      ROUTE_PATHS.nosotros,
      '/about',
      ROUTE_PATHS.contactanos,
    ]) {
      const item = getSiteNavigation('en', pathname).find(
        (entry) => entry.id === 'home',
      );

      expect(item?.href, pathname).toBe('/');
    }
  });

  it('keeps the real page destinations usable from any route', () => {
    const careersNavigation = getSiteNavigation('en', '/careers');

    expect(careersNavigation.map((item) => item.href)).toEqual([
      '/',
      ROUTE_PATHS.nosotros,
      ROUTE_PATHS.marcas,
      ROUTE_PATHS.calidad,
      ROUTE_PATHS.talento,
      ROUTE_PATHS.contactanos,
    ]);
  });

  it('marks the current page destination from a Spanish path or an English alias', () => {
    const fromAlias = getSiteNavigation('en', '/brands');
    const fromCanonical = getSiteNavigation('en', '/marcas');

    expect(fromAlias.find((item) => item.id === 'marcas')?.href).toBe(
      ROUTE_PATHS.marcas,
    );
    expect(fromCanonical.find((item) => item.id === 'marcas')?.href).toBe(
      ROUTE_PATHS.marcas,
    );
    expect(fromAlias.find((item) => item.id === 'home')?.href).toBe('/');
  });

  it('exposes the first five destinations as the desktop primary navigation', () => {
    expect(getSiteNavigation('es').slice(0, 5).map((item) => item.id)).toEqual([
      'home',
      'nosotros',
      'marcas',
      'calidad',
      'talento',
    ]);
  });

  it('carries the active locale through every route destination', () => {
    const navigation = getSiteNavigation('en', '/nosotros');

    for (const item of navigation) {
      expect(item.navigationState).toEqual({ biaLocale: 'en' });
    }

    expect(
      getSiteNavigation('es', '/nosotros').find((item) => item.id === 'nosotros'),
    ).toMatchObject({
      href: ROUTE_PATHS.nosotros,
      navigationState: { biaLocale: 'es' },
    });
  });

  it('uses the approved BIA title and description for metadata', () => {
    expect(getSiteMetadata('es')).toEqual({
      title: 'BIA Honduras | De Honduras, con propósito',
      description:
        'Conoce BIA Honduras, el pilar hondureño de BIA Foods, desde el origen del café hasta las personas que lo hacen posible.',
    });
    expect(getSiteMetadata('en')).toEqual({
      title: 'BIA Honduras | From Honduras, with purpose',
      description:
        'Discover BIA Honduras, the Honduran pillar of BIA Foods, from coffee origin to the people who make it possible.',
    });
  });

  it('serves identical employer-brand metadata on /talento and its /careers alias', () => {
    for (const routeId of ['talento', 'careers'] as const) {
      expect(getSiteMetadata('es', routeId)).toEqual({
        title: 'Talento | BIA Honduras',
        description:
          'Descubre las áreas de talento en BIA Honduras, nuestra forma de trabajar y el proceso para compartir tu historia.',
      });
      expect(getSiteMetadata('en', routeId)).toEqual({
        title: 'Talent | BIA Honduras',
        description:
          'Discover the talent areas at BIA Honduras, how we work, and the process for sharing your story.',
      });
    }
  });

  it('serves bilingual document metadata for every secondary page', () => {
    expect(getSiteMetadata('es', 'nosotros').title).toBe(
      'Nosotros | BIA Honduras',
    );
    expect(getSiteMetadata('en', 'nosotros').title).toBe('About us | BIA Honduras');
    expect(getSiteMetadata('es', 'marcas').title).toBe('Marcas | BIA Honduras');
    expect(getSiteMetadata('en', 'marcas').title).toBe('Brands | BIA Honduras');
    expect(getSiteMetadata('es', 'calidad').title).toBe(
      'Calidad y sostenibilidad | BIA Honduras',
    );
    expect(getSiteMetadata('en', 'calidad').title).toBe(
      'Quality & sustainability | BIA Honduras',
    );
    expect(getSiteMetadata('es', 'talento').title).toBe('Talento | BIA Honduras');
    expect(getSiteMetadata('en', 'talento').title).toBe('Talent | BIA Honduras');
    expect(getSiteMetadata('es', 'contactanos').title).toBe(
      'Contáctanos | BIA Honduras',
    );
    expect(getSiteMetadata('en', 'contactanos').title).toBe(
      'Contact us | BIA Honduras',
    );

    for (const routeId of SECONDARY_NAVIGATION_IDS) {
      for (const locale of ['es', 'en'] as const) {
        const metadata = getSiteMetadata(locale, routeId);

        expect(metadata.title.trim().length, `${routeId}:${locale}`).toBeGreaterThan(0);
        expect(metadata.description.trim().length, `${routeId}:${locale}`).toBeGreaterThan(
          0,
        );
        expect(metadata.title, `${routeId}:${locale}`).toContain('BIA Honduras');
        expect(metadata.title, `${routeId}:${locale}`).not.toMatch(/\bhubs?\b/i);
        expect(metadata.description, `${routeId}:${locale}`).not.toMatch(
          /\bhubs?\b/i,
        );
      }
    }
  });
});
