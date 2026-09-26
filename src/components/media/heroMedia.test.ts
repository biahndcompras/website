import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_HERO_POSTER_PATH,
  DEFAULT_HERO_VIDEO_PATH,
  getNextHeroMediaState,
  mapProgressToVideoTime,
  resolveHeroPosterSource,
  resolveHeroVideoSource,
} from './heroMedia';

function publicMediaFile(publicPath: string): string {
  return resolve(process.cwd(), 'public', publicPath.replace(/^\/+/, ''));
}

describe('hero media helpers', () => {
  it('uses the documented local path when no configured source is provided', () => {
    expect(resolveHeroVideoSource()).toBe(DEFAULT_HERO_VIDEO_PATH);
    expect(resolveHeroVideoSource('   ')).toBe(DEFAULT_HERO_VIDEO_PATH);
    expect(resolveHeroPosterSource()).toBe(DEFAULT_HERO_POSTER_PATH);
    expect(resolveHeroPosterSource('   ')).toBe(DEFAULT_HERO_POSTER_PATH);
  });

  it('prefers trimmed configured hero video and poster sources', () => {
    expect(resolveHeroVideoSource('  /media/custom-bia-film.mp4  ')).toBe(
      '/media/custom-bia-film.mp4',
    );
    expect(resolveHeroPosterSource('  /media/custom-bia-poster.jpg  ')).toBe(
      '/media/custom-bia-poster.jpg',
    );
  });

  it('ships a real local MP4 and JPEG at the documented default paths', () => {
    const videoFile = publicMediaFile(DEFAULT_HERO_VIDEO_PATH);
    const posterFile = publicMediaFile(DEFAULT_HERO_POSTER_PATH);

    expect(existsSync(videoFile)).toBe(true);
    expect(existsSync(posterFile)).toBe(true);
    expect(statSync(videoFile).size).toBeGreaterThan(0);
    expect(statSync(posterFile).size).toBeGreaterThan(0);
    expect(readFileSync(videoFile).subarray(4, 8).toString('ascii')).toBe('ftyp');
    expect([...readFileSync(posterFile).subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
  });

  it('maps normalized progress to a clamped video time', () => {
    expect(mapProgressToVideoTime(0, 10)).toBe(0);
    expect(mapProgressToVideoTime(0.5, 10)).toBe(4.99);
    expect(mapProgressToVideoTime(1, 10)).toBe(9.98);
    expect(mapProgressToVideoTime(2, 10)).toBe(9.98);
    expect(mapProgressToVideoTime(-1, 10)).toBe(0);
  });

  it('does not seek media until a finite positive duration is available', () => {
    expect(mapProgressToVideoTime(0.5, 0)).toBeNull();
    expect(mapProgressToVideoTime(0.5, Number.NaN)).toBeNull();
    expect(mapProgressToVideoTime(0.5, Number.POSITIVE_INFINITY)).toBeNull();
  });

  it('keeps the video time inside the full duration for very short media', () => {
    expect(mapProgressToVideoTime(1, 0.01)).toBeCloseTo(0.01, 6);
  });

  it('moves to the branded fallback only after a media error', () => {
    expect(getNextHeroMediaState('loading', 'error')).toBe('fallback');
    expect(getNextHeroMediaState('ready', 'error')).toBe('fallback');
  });

  it('can recover when replacement media loads after an error', () => {
    expect(getNextHeroMediaState('fallback', 'loadeddata')).toBe('ready');
  });
});
