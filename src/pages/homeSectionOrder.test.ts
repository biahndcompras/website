import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { HOME_SECTION_IDS } from '../content/home';
import { DEFAULT_MOTION_STORY_VIDEO_PATH } from '../components/media/motionStoryMedia';

function readSource(relativePath: string): string {
  const file = resolve(process.cwd(), relativePath);

  return existsSync(file) ? readFileSync(file, 'utf8') : '';
}

const homePagePath = 'src/pages/HomePage.tsx';
const motionSectionPath = 'src/components/sections/MotionStorySection.tsx';

const MOUNTED_SECTIONS = [
  'Hero',
  'BrandManifesto',
  'HubsSection',
  'OriginStory',
  'FromSeedToCup',
  'BrandsSection',
  'MotionStorySection',
  'QualitySustainability',
  'TalentBand',
] as const;

function mountedSectionOrder(source: string): string[] {
  return [...source.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((match) => match[1]);
}

describe('Home page section composition', () => {
  it('mounts every editorial section exactly once in the approved order', () => {
    const source = readSource(homePagePath);
    const order = mountedSectionOrder(source);

    expect(order).toEqual([...MOUNTED_SECTIONS]);
    expect(new Set(order).size).toBe(order.length);
  });

  it('places the motion story between Brands and Quality', () => {
    const order = mountedSectionOrder(readSource(homePagePath));
    const motionIndex = order.indexOf('MotionStorySection');

    expect(motionIndex).toBeGreaterThan(-1);
    expect(order[motionIndex - 1]).toBe('BrandsSection');
    expect(order[motionIndex + 1]).toBe('QualitySustainability');
  });

  it('leaves the restored Hero and From Seed to Cup in their established slots', () => {
    const order = mountedSectionOrder(readSource(homePagePath));

    expect(order.indexOf('Hero')).toBe(0);
    expect(order.indexOf('FromSeedToCup')).toBe(
      order.indexOf('OriginStory') + 1,
    );
    expect(order.indexOf('MotionStorySection')).toBeGreaterThan(
      order.indexOf('FromSeedToCup'),
    );
  });
});

describe('Motion story section isolation', () => {
  it('exists as an independent section component with its own media contract', () => {
    const sectionSource = readSource(motionSectionPath);
    const helperSource = readSource('src/components/media/motionStoryMedia.ts');

    expect(sectionSource.length).toBeGreaterThan(0);
    expect(helperSource.length).toBeGreaterThan(0);
    expect(helperSource).toContain(DEFAULT_MOTION_STORY_VIDEO_PATH);
    expect(sectionSource).toContain('resolveMotionStoryVideoSource');
  });

  it('does not reuse or merge the BIA Hero template', () => {
    const source = readSource(motionSectionPath);

    expect(source).not.toContain('ScrollVideoHero');
    expect(source).not.toContain('heroMedia');
    expect(source).not.toMatch(/from\s+['"][^'"]*\/Hero['"]/);
    expect(readSource(homePagePath)).toContain('components/Hero');
  });

  it('never imports ORBS files or reaches for a remote asset', () => {
    for (const source of [
      readSource(motionSectionPath),
      readSource(homePagePath),
      readSource('src/components/media/motionStoryMedia.ts'),
    ]) {
      expect(source).not.toMatch(/https?:\/\//);
      expect(source).not.toMatch(/orbs\//i);
    }
  });

  it('anchors itself to the stable motion section id', () => {
    const source = readSource(motionSectionPath);

    expect(HOME_SECTION_IDS.motion).toBe('bia-motion');
    expect(source).toContain('HOME_SECTION_IDS.motion');
  });

  it('points its CTA at an existing Home anchor instead of a fake route', () => {
    const source = readSource(motionSectionPath);

    expect(source).toMatch(
      /getHomeAnchorHref\(\s*HOME_SECTION_IDS\.(process|origin|story)\s*\)/,
    );
    expect(source).not.toMatch(/getHomeAnchorHref\(\s*HOME_SECTION_IDS\.(quality|talent|brands|hubs)\s*\)/);
  });

  it('grows the CTA visual with transform scale and animates no layout property', () => {
    const source = readSource(motionSectionPath);

    expect(source).toContain('getMotionStoryCtaVisualScale');
    expect(source).not.toMatch(/style=\{\{[^}]*\b(width|height)\b/);
    expect(source).not.toMatch(/animate=\{\{[^}]*\b(width|height|padding|margin)\b/);
  });
});
