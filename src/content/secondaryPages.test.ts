import { describe, expect, it } from 'vitest';
import {
  getCanonicalRoutePath,
  getRouteAliasId,
  getRouteId,
  ROUTE_PATHS,
} from '../app/routes';
import {
  contactAudiences,
  contactChannels,
  CONTACT_DETAILS_PENDING,
  getSecondaryPage,
  HISTORY_PERIOD_PENDING,
  historyMoments,
  isSecondaryPageId,
  qualityPillars,
  SECONDARY_BRAND_ENTRIES,
  SECONDARY_PAGE_IDS,
  secondaryPages,
  secondaryPageMetrics,
  secondaryValues,
  talentAreas,
  talentOpenings,
} from './secondaryPages';
import type { LocalizedCopy } from '../types';
import { readSource } from '../test/cssContract';

const CONTENT_STATUSES = ['approved', 'placeholder'] as const;

/** Section anchors the contact page renders, so audience links stay valid. */
const CONTACT_PAGE_ANCHORS = [
  'bia-contact-audiencias',
  'bia-contact-channels',
] as const;

const contactanosSource = readSource('src/pages/ContactanosPage.tsx');

/** Every user-visible string in this module must exist in both locales. */
function collectCopyStrings(): string[] {
  const strings: string[] = [];
  const push = (value: LocalizedCopy) => {
    strings.push(value.es, value.en);
  };

  for (const page of Object.values(secondaryPages)) {
    strings.push(
      page.eyebrow.es,
      page.eyebrow.en,
      page.title.es,
      page.title.en,
      page.description.es,
      page.description.en,
      page.documentTitle.es,
      page.documentTitle.en,
      page.documentDescription.es,
      page.documentDescription.en,
    );
  }

  for (const brand of SECONDARY_BRAND_ENTRIES) {
    push(brand.name);
    push(brand.category);
    push(brand.description);
    push(brand.pending);
  }

  for (const pillar of qualityPillars) {
    push(pillar.title);
    push(pillar.description);
    if (pillar.pending) {
      push(pillar.pending);
    }
  }

  for (const moment of historyMoments) {
    strings.push(moment.period ?? HISTORY_PERIOD_PENDING.es);
    strings.push(moment.period ?? HISTORY_PERIOD_PENDING.en);
    push(moment.title);
    push(moment.description);
    push(moment.pending);
  }

  for (const value of secondaryValues) {
    push(value.title);
    push(value.description);
    push(value.pending);
  }

  for (const audience of contactAudiences) {
    push(audience.title);
    push(audience.description);
    push(audience.pending);
  }

  for (const channel of contactChannels) {
    push(channel.label);
    if (channel.pending) {
      push(channel.pending);
    }
  }

  for (const area of talentAreas) {
    push(area.title);
    push(area.description);
    push(area.pending);
  }

  push(talentOpenings.headline);
  push(talentOpenings.note);
  push(CONTACT_DETAILS_PENDING);
  push(HISTORY_PERIOD_PENDING);

  return strings;
}

describe('BIA secondary page content contract', () => {
  it('describes every secondary page with a canonical path, an alias, and bilingual metadata', () => {
    expect(SECONDARY_PAGE_IDS).toEqual([
      'nosotros',
      'marcas',
      'calidad',
      'talento',
      'contactanos',
    ]);

    for (const id of SECONDARY_PAGE_IDS) {
      const page = getSecondaryPage(id);

      expect(page.id).toBe(id);
      expect(page.canonicalPath).toBe(ROUTE_PATHS[id]);
      expect(getRouteId(page.canonicalPath)).toBe(id);
      // `/careers` is the English alias of `/talento`; the declared legacy
      // `/careers` route id is handled in routes.test.ts.
      expect(getRouteAliasId(page.aliasPath)).toBe(id);
      expect(getCanonicalRoutePath(page.aliasPath)).toBe(page.canonicalPath);
      expect(CONTENT_STATUSES).toContain(page.status);

      for (const value of [
        page.eyebrow,
        page.title,
        page.description,
        page.documentTitle,
        page.documentDescription,
      ]) {
        expect(value.es.trim().length).toBeGreaterThan(0);
        expect(value.en.trim().length).toBeGreaterThan(0);
        expect(value.es).not.toBe(value.en);
      }
    }

    expect(isSecondaryPageId('nosotros')).toBe(true);
    expect(isSecondaryPageId('home')).toBe(false);
    expect(isSecondaryPageId('careers')).toBe(false);
    expect(isSecondaryPageId('constructor')).toBe(false);
  });

  it('covers the four approved coffee brands as explicit placeholders', () => {
    expect(SECONDARY_BRAND_ENTRIES.map((brand) => brand.id)).toEqual([
      'el-indio',
      'cafe-maya',
      'oro-puro',
      'medalla',
    ]);
    expect(SECONDARY_BRAND_ENTRIES.map((brand) => brand.name.en)).toEqual([
      'Café El Indio',
      'Café Maya',
      'Oro Puro',
      'Medalla',
    ]);

    for (const brand of SECONDARY_BRAND_ENTRIES) {
      expect(brand.status).toBe('placeholder');
      expect(brand.pending.es.length).toBeGreaterThan(0);
      expect(brand.pending.en.length).toBeGreaterThan(0);
    }
  });

  it('covers origin, food safety, traceability, producers, standards, and culture', () => {
    expect(qualityPillars.map((pillar) => pillar.id)).toEqual([
      'origin',
      'food-safety',
      'local-producers',
      'traceability',
      'standards',
      'culture',
    ]);

    for (const pillar of qualityPillars) {
      expect(CONTENT_STATUSES).toContain(pillar.status);

      if (pillar.status === 'placeholder') {
        expect(pillar.pending).not.toBeNull();
      }
    }

    expect(qualityPillars.filter((pillar) => pillar.status === 'placeholder')).toHaveLength(3);
  });

  it('keeps history and value entries placeholder with no invented period', () => {
    expect(historyMoments.length).toBeGreaterThan(0);

    for (const moment of historyMoments) {
      expect(moment.period).toBeNull();
      expect(moment.status).toBe('placeholder');
      expect(moment.pending.es.length).toBeGreaterThan(0);
      expect(moment.pending.en.length).toBeGreaterThan(0);
    }

    expect(secondaryValues.length).toBeGreaterThan(0);

    for (const value of secondaryValues) {
      expect(value.status).toBe('placeholder');
      expect(value.pending.es.length).toBeGreaterThan(0);
      expect(value.pending.en.length).toBeGreaterThan(0);
    }
  });

  it('routes every contact audience to an internal destination and invents no contact data', () => {
    expect(contactAudiences.map((audience) => audience.id)).toEqual([
      'general',
      'partners',
      'press',
      'talent',
    ]);

    for (const audience of contactAudiences) {
      expect(audience.status).toBe('placeholder');
      expect(audience.destination).not.toMatch(/^(https?:|mailto:|tel:)/i);
      expect(audience.pending.es.length).toBeGreaterThan(0);
      expect(audience.pending.en.length).toBeGreaterThan(0);

      const [path, hash] = audience.destination.split('#');
      expect(Object.values(ROUTE_PATHS)).toContain(path);
      expect(getRouteId(path)).not.toBeNull();

      // A hash must land on a section that the page really renders. Only the
      // channels section is built per audience today.
      if (hash) {
        expect(CONTACT_PAGE_ANCHORS).toContain(hash);
        expect(contactanosSource).toContain(`id="${hash}"`);
      }
    }

    expect(contactChannels.length).toBeGreaterThan(0);

    for (const channel of contactChannels) {
      expect(channel.status).toBe('placeholder');
      expect(channel.value).toBeNull();
      expect(channel.label.es.length).toBeGreaterThan(0);
      expect(channel.label.en.length).toBeGreaterThan(0);
    }

    expect(contactChannels.some((channel) => channel.id.includes('address'))).toBe(true);
  });

  it('covers the four talent areas without promising openings', () => {
    expect(talentAreas.map((area) => area.id)).toEqual([
      'coffee-origin',
      'production-quality',
      'culinary-product',
      'partners-service',
    ]);

    for (const area of talentAreas) {
      expect(area.status).toBe('placeholder');
      expect(area.title.es.length).toBeGreaterThan(0);
      expect(area.title.en.length).toBeGreaterThan(0);
    }

    expect(talentOpenings.count).toBeNull();
    expect(talentOpenings.status).toBe('placeholder');
  });

  it('publishes no metrics for the secondary pages', () => {
    expect(secondaryPageMetrics).toEqual([]);
  });

  it('never uses hub wording, digits, or unapproved claim vocabulary in the copy', () => {
    const copyStrings = collectCopyStrings();

    expect(copyStrings.length).toBeGreaterThan(0);

    for (const value of copyStrings) {
      expect(value).not.toMatch(/\bhubs?\b/i);
      expect(value).not.toMatch(/[0-9]/);
      expect(value).not.toMatch(/\d/);
      expect(value).not.toMatch(
        /\b(certific\w*|premio\w*|award\w*|garant\w*|sello\w*|iso|haccp|utz|rainforest|fair\s?trade|numbers?|top|world|mejor|l[ií]der\w*|únic\w*|primer\w*)\b/i,
      );
      expect(value).not.toMatch(/mailto:|tel:|https?:\/\/|@/);
    }
  });

  it('flags an invented claim, a hub mention, a number, and a contact address', () => {
    const claimVocabulary =
      /\b(certific\w*|premio\w*|award\w*|garant\w*|sello\w*|iso|haccp|utz|rainforest|fair\s?trade|numbers?|top|world|mejor|l[ií]der\w*|únic\w*|primer\w*)\b/i;

    // The guard above must actually reject the copy this project must never ship.
    for (const invented of [
      'Contamos con certificación ISO.',
      'Somos la compañía líder de Honduras.',
      'Tenemos cuatro Coffee Hubs en operación.',
      'Escríbenos a contacto@bia.hn.',
      'Fundada en 1998 en Tegucigalpa.',
      'La marca top del mercado hondureño.',
    ]) {
      expect(
        claimVocabulary.test(invented) ||
          /\bhubs?\b/i.test(invented) ||
          /\d/.test(invented) ||
          /mailto:|tel:|@/.test(invented),
        invented,
      ).toBe(true);
    }
  });
});
