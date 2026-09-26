import { describe, expect, it } from 'vitest';
import { getSecondaryPage, SECONDARY_PAGE_IDS } from '../../content/secondaryPages';
import {
  CssContract,
  readSource,
  splitTracks,
  viewportWidthDeclarations,
} from '../../test/cssContract';

const shellSource = readSource('src/components/layout/SecondaryPageShell.tsx');
const css = new CssContract(readSource('src/index.css'));

const STACK = 900;
const DESKTOP = 1180;

function declarationsFor(selector: string, condition?: RegExp): Record<string, string> {
  return css.declarationsFor(selector, condition);
}

describe('Secondary page shell', () => {
  it('exists and is driven by the bilingual secondary page content', () => {
    expect(shellSource).toContain('getSecondaryPage');
    expect(shellSource).toContain('SecondaryPageId');
    expect(shellSource).toContain('useI18n');
    expect(shellSource).toMatch(/getSecondaryPage\(pageId\)/);
    // Every page id in the content module must be accepted by the frame.
    for (const id of SECONDARY_PAGE_IDS) {
      expect(getSecondaryPage(id).canonicalPath).toBeTruthy();
    }
  });

  it('exposes a labelled hero hook plus a page landmark for the header theme', () => {
    expect(shellSource).toContain('id="secondary-hero"');
    expect(shellSource).toContain('aria-labelledby');
    expect(shellSource).toContain('data-page={pageId}');
  });

  it('reuses the shared motion primitives instead of bespoke animation code', () => {
    expect(shellSource).toContain("from '../motion/Reveal'");
    expect(shellSource).toContain("from '../media/ParallaxLayer'");
    expect(shellSource).not.toContain('useScroll(');
    expect(shellSource).not.toContain('requestAnimationFrame');
  });

  it('never mentions the hubs concept', () => {
    expect(shellSource.toLowerCase()).not.toContain('hub');
  });
});

describe('Secondary page layout contract', () => {
  it('clips the page frame instead of letting a visual push the document wide', () => {
    const page = declarationsFor('.secondary-page', new RegExp(`^$`));

    expect(page['overflow-x']).toMatch(/^(hidden|clip)$/);
    expect(page['background']).toBeDefined();
  });

  it('lays the hero out as shrinkable tracks with a defined column and row gap', () => {
    const inner = declarationsFor('.secondary-hero__inner', new RegExp(`^$`));

    expect(inner['grid-template-columns']).toBeDefined();
    expect(inner['column-gap']).toBeDefined();
    expect(inner['row-gap']).toBeDefined();
    for (const track of splitTracks(inner['grid-template-columns'] ?? '')) {
      if (track.startsWith('minmax(')) {
        expect(track.replace(/\s+/g, '')).toMatch(/^minmax\(0,[\d.]+(fr|rem|%)\)$/);
      }
    }
  });

  it('lets hero copy, titles and every grid child shrink inside the frame', () => {
    for (const selector of [
      '.secondary-hero__copy',
      '.secondary-hero__visual',
      '.secondary-section__grid',
      '.secondary-section__media',
      '.secondary-row__body',
    ]) {
      expect(declarationsFor(selector, new RegExp(`^$`))['min-width']).toBe('0');
    }
  });

  it('keeps long words inside their column', () => {
    for (const selector of [
      '.secondary-hero__title',
      '.secondary-section__title',
      '.secondary-row__title',
      '.secondary-timeline__title',
    ]) {
      const declarations = declarationsFor(selector);

      expect(['break-word', 'anywhere', 'break-all']).toContain(
        declarations['overflow-wrap'] ?? declarations['word-break'],
      );
    }
  });

  it('bounds clipping to the media slots only', () => {
    for (const selector of [
      '.secondary-section__media',
      '.secondary-hero__visual',
      '.secondary-mark',
    ]) {
      const declarations = declarationsFor(selector);

      expect(declarations['overflow']).toMatch(/^(hidden|clip)$/);
      expect(declarations['isolation']).toBe('isolate');
    }
    for (const selector of [
      '.secondary-section__copy',
      '.secondary-hero__copy',
      '.secondary-section__grid',
    ]) {
      expect(declarationsFor(selector)['overflow']).toBeUndefined();
    }
  });

  it('collapses every secondary grid to one column at the shared stack breakpoint', () => {
    for (const selector of [
      '.secondary-hero__inner',
      '.secondary-section__grid',
      '.secondary-footer-links',
    ]) {
      expect(declarationsFor(selector, new RegExp(`${STACK}px`))['grid-template-columns']).toBe(
        '1fr',
      );
    }
  });

  it('rebalances the hero at the shared wide breakpoint without fixed minimums', () => {
    const tracks = splitTracks(
      declarationsFor('.secondary-hero__inner', new RegExp(`${DESKTOP}px`))[
        'grid-template-columns'
      ] ?? '',
    );

    expect(tracks).toHaveLength(2);
    expect(tracks.every((track) => /^minmax\(0,\s*[\d.]+fr\)$/.test(track))).toBe(true);
  });

  it('never sizes a secondary box with a viewport width', () => {
    expect(viewportWidthDeclarations(css)).toEqual([]);
  });

  it('keeps a pending note legible on both dark and light sections', () => {
    const pending = declarationsFor('.secondary-pending');

    expect(pending['font-size']).toBeDefined();
    expect(pending['line-height']).toBeDefined();
    expect(declarationsFor('.secondary-pending--light')['color']).toBeDefined();
  });
});
