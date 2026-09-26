import { describe, expect, it } from 'vitest';
import {
  HOME_NAVIGATION_ANCHOR_IDS,
  HOME_SECTION_IDS,
  getHomeAnchorHref,
} from './home';

describe('BIA Home section and anchor contract', () => {
  it('defines one stable id for each editorial Home section', () => {
    expect(HOME_SECTION_IDS).toEqual({
      story: 'bia-story',
      hubs: 'bia-hubs',
      origin: 'bia-origin',
      process: 'bia-process',
      brands: 'bia-brands',
      motion: 'bia-motion',
      quality: 'bia-quality',
      talent: 'bia-talent',
    });

    expect(new Set(Object.values(HOME_SECTION_IDS)).size).toBe(
      Object.values(HOME_SECTION_IDS).length,
    );
  });

  it('keeps the shared navigation anchors exact and route-aware', () => {
    expect(HOME_NAVIGATION_ANCHOR_IDS).toEqual([
      'bia-story',
      'bia-hubs',
      'bia-brands',
    ]);

    expect(getHomeAnchorHref('bia-story', '/')).toBe('#bia-story');
    expect(getHomeAnchorHref('bia-hubs', '/careers')).toBe('/#bia-hubs');
    expect(getHomeAnchorHref('bia-brands', '/careers/')).toBe('/#bia-brands');
  });

  it('exposes the motion story as a reachable anchor without promoting it to the shared nav', () => {
    expect(HOME_SECTION_IDS.motion).toBe('bia-motion');
    expect(HOME_NAVIGATION_ANCHOR_IDS).not.toContain(HOME_SECTION_IDS.motion);
    expect(getHomeAnchorHref('bia-motion', '/')).toBe('#bia-motion');
    expect(getHomeAnchorHref('bia-motion', '/careers')).toBe('/#bia-motion');
  });
});
