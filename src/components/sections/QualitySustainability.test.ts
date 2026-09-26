import { describe, expect, it } from 'vitest';
import { HOME_SECTION_IDS } from '../../content/home';
import { CssContract, readSource, splitTracks } from '../../test/cssContract';

const css = new CssContract(readSource('src/index.css'));
const sectionSource = readSource('src/components/sections/QualitySustainability.tsx');

const DESKTOP = 1050;
const STACK = 900;

function rulesFor(selector: string) {
  return css.rulesFor(selector);
}

function declarationsFor(selector: string, condition?: RegExp): Record<string, string> {
  return css.declarationsFor(selector, condition);
}

describe('Quality and sustainability layout contract', () => {
  it('lays the section out as an explicit two-column top row plus a full-width list row', () => {
    const base = declarationsFor('.home-quality__inner', new RegExp(`^$`));

    expect(Object.keys(base)).not.toHaveLength(0);
    const tracks = splitTracks(base['grid-template-columns'] ?? '');

    expect(tracks).toHaveLength(2);
    expect(tracks.every((track) => /^minmax\(0,\s*[\d.]+fr\)$/.test(track))).toBe(true);
    expect(base['column-gap']).toBeDefined();
    expect(base['row-gap']).toBeDefined();
    expect(declarationsFor('.home-quality__list', new RegExp(`^$`))['grid-column']).toBe(
      '1 / -1',
    );
  });

  it('never hard-codes a track minimum that can outgrow the available width', () => {
    const trackValues = rulesFor('.home-quality__inner')
      .filter((rule) => !rule.conditions.some((condition) => condition.includes(`${STACK}px`)))
      .map((rule) => rule.declarations['grid-template-columns'])
      .filter((value): value is string => Boolean(value));

    // Base rule plus the 1050px rebalance: neither may be dropped from the guard.
    expect(trackValues).toHaveLength(2);
    for (const value of trackValues) {
      for (const track of splitTracks(value)) {
        if (!track.startsWith('minmax(')) continue;
        expect(track.replace(/\s+/g, '')).toMatch(/^minmax\(0,[\d.]+fr\)$/);
      }
    }
  });

  it('lets every quality grid item shrink instead of pushing its neighbours', () => {
    for (const selector of [
      '.home-quality__intro',
      '.home-quality__visual',
      '.home-quality__list',
    ]) {
      expect(declarationsFor(selector, new RegExp(`^$`))['min-width']).toBe('0');
    }
  });

  it('bounds clipping to the media slot and keeps every copy box unclipped', () => {
    const slot = declarationsFor('.home-quality__visual .home-media-slot');

    expect(slot['overflow']).toMatch(/^(hidden|clip)$/);
    expect(slot['isolation']).toBe('isolate');
    expect(declarationsFor('.home-quality__visual')['overflow']).toBeUndefined();
    expect(declarationsFor('.home-quality__intro')['overflow']).toBeUndefined();
    expect(
      declarationsFor('.home-quality__intro .home-section__title')['overflow'],
    ).toBeUndefined();
  });

  it('keeps the quality title breakable so its ink can never reach the media column', () => {
    const title = declarationsFor('.home-quality__intro .home-section__title');

    expect(['break-word', 'anywhere', 'break-all']).toContain(
      title['overflow-wrap'] ?? title['word-break'],
    );
  });

  it('collapses to one column at the existing 900px breakpoint and frees placement', () => {
    const stacked = declarationsFor('.home-quality__inner', new RegExp(`${STACK}px`));

    expect(stacked['grid-template-columns']).toBe('1fr');
    for (const selector of [
      '.home-quality__intro',
      '.home-quality__visual',
      '.home-quality__list',
    ]) {
      const collapsed = declarationsFor(selector, new RegExp(`${STACK}px`));

      expect(collapsed['grid-column']).toBe('auto');
      expect(collapsed['grid-row']).toBe('auto');
    }
  });

  it('rebalances the two-column row at the existing 1050px breakpoint', () => {
    const tracks = splitTracks(
      declarationsFor('.home-quality__inner', new RegExp(`${DESKTOP}px`))[
        'grid-template-columns'
      ] ?? '',
    );

    expect(tracks).toHaveLength(2);
    expect(tracks.every((track) => /^minmax\(0,\s*[\d.]+fr\)$/.test(track))).toBe(true);
  });
});

describe('Quality section isolation', () => {
  it('keeps its stable section id, heading hook and proposition copy wiring', () => {
    expect(HOME_SECTION_IDS.quality).toBe('bia-quality');
    expect(sectionSource).toContain('HOME_SECTION_IDS.quality');
    expect(sectionSource).toContain('id="home-quality-title"');
    expect(sectionSource).toContain('home.quality.title');
    expect(sectionSource).toContain('home.quality.description');
    expect(sectionSource).toContain('home.quality.note');
    for (const key of [
      'home.quality.localProducerDescription',
      'home.quality.foodSafetyDescription',
      'home.quality.cultureDescription',
    ]) {
      expect(sectionSource).toContain(key);
    }
  });

  it('does not reach into the sections this fix must not disturb', () => {
    for (const isolated of [
      'ScrollVideoHero',
      'ProcessCinematicStage',
      'MotionStorySection',
      'BrandsSection',
      'CareersAreas',
    ]) {
      expect(sectionSource).not.toContain(isolated);
    }
  });
});
