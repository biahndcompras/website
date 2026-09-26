import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { biaContent } from './bia';

function publicMediaFile(publicPath: string): string {
  return resolve(process.cwd(), 'public', publicPath.replace(/^\/+/, ''));
}

describe('BIA content contract', () => {
  it('defines the four BIA Foods hubs and core coffee brands', () => {
    expect(biaContent.hubs.map((hub) => hub.id)).toEqual([
      'coffee',
      'culinary',
      'snacks',
      'partners-food-service',
    ]);

    expect(biaContent.brands.map((brand) => brand.id)).toEqual([
      'el-indio',
      'cafe-maya',
      'oro-puro',
      'medalla',
    ]);
  });

  it('keeps media accessible or explicitly decorative', () => {
    for (const asset of biaContent.media) {
      expect(Boolean(asset.alt?.trim()) || asset.decorative === true).toBe(true);
    }
  });

  it('documents the supplied local hero film and poster', () => {
    expect(biaContent.media).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'video',
          src: '/media/bia-origin-hero.mp4',
        }),
        expect.objectContaining({
          kind: 'poster',
          src: '/media/bia-origin-poster.jpg',
        }),
      ]),
    );
  });

  it('documents the approved local motion story film and poster', () => {
    expect(biaContent.media).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'video',
          src: '/media/bia-motion-story.mp4',
        }),
        expect.objectContaining({
          kind: 'poster',
          src: '/media/bia-motion-story-poster.jpg',
        }),
      ]),
    );
  });

  it('keeps every declared media asset a real local approved file', () => {
    for (const asset of biaContent.media) {
      expect(asset.src.startsWith('/media/')).toBe(true);
      expect(asset.status).toBe('approved');

      const file = publicMediaFile(asset.src);
      expect(existsSync(file)).toBe(true);
      expect(statSync(file).size).toBeGreaterThan(0);
    }
  });

  it('never points the content inventory at a remote or ORBS asset', () => {
    for (const asset of biaContent.media) {
      expect(asset.src).not.toMatch(/^[a-z]+:\/\//i);
      expect(asset.src).not.toMatch(/^https?:\/\//i);
    }
  });

  it('stores separate Spanish and English value proposition copy', () => {
    const valueChain = biaContent.valuePropositions.find(
      (proposition) => proposition.id === 'local-producer-value-chain',
    );

    expect(valueChain?.title).toEqual({
      es: 'Cadena de valor de productores locales',
      en: 'Local producer value chain',
    });
  });
});
