import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_MOTION_STORY_POSTER_PATH,
  DEFAULT_MOTION_STORY_VIDEO_PATH,
  MOTION_STORY_COPY_BEAT_COUNT,
  MOTION_STORY_COPY_SHIFT_PX,
  MOTION_STORY_CTA_VISUAL_SCALE_END,
  MOTION_STORY_CTA_VISUAL_SCALE_START,
  MOTION_STORY_FRAME_INSET_MAX_PX,
  MOTION_STORY_FRAME_RADIUS_MAX_PX,
  MOTION_STORY_MAX_PX_PER_SECOND,
  MOTION_STORY_MIN_PX_PER_SECOND,
  MOTION_STORY_PLAYBACK_RATE,
  MOTION_STORY_SCRUB_WINDOW_SECONDS,
  MOTION_STORY_VIDEO_DRIFT_END_PERCENT,
  MOTION_STORY_VIDEO_END_PADDING_SECONDS,
  MOTION_STORY_VIDEO_DRIFT_START_PERCENT,
  MOTION_STORY_VIDEO_SCALE_END,
  MOTION_STORY_VIDEO_SCALE_START,
  clampMotionStoryProgress,
  getMotionStoryCopyBeat,
  getMotionStoryCtaCopyOpacity,
  getMotionStoryCtaCopyShiftPx,
  getMotionStoryCtaVisualScale,
  getMotionStoryFrameInsetPx,
  getMotionStoryFrameRadiusPx,
  getMotionStoryPlaybackRate,
  getMotionStoryVisibleCopyOpacity,
  getMotionStoryVideoDriftPercent,
  getMotionStoryVideoScale,
  mapProgressToMotionStoryTime,
  resolveMotionStoryPosterSource,
  resolveMotionStoryVideoSource,
} from './motionStoryMedia';
import { CssContract, readSource } from '../../test/cssContract';

function publicMediaFile(publicPath: string): string {
  return resolve(process.cwd(), 'public', publicPath.replace(/^\/+/, ''));
}

function progressSweep(step = 0.005): number[] {
  const samples: number[] = [];
  for (let value = 0; value <= 1 + step / 2; value += step) {
    samples.push(Number(value.toFixed(4)));
  }
  return samples;
}

describe('motion story media sources', () => {
  it('uses the documented local paths when no configured source is provided', () => {
    expect(resolveMotionStoryVideoSource()).toBe(DEFAULT_MOTION_STORY_VIDEO_PATH);
    expect(resolveMotionStoryVideoSource('   ')).toBe(
      DEFAULT_MOTION_STORY_VIDEO_PATH,
    );
    expect(resolveMotionStoryVideoSource(null)).toBe(
      DEFAULT_MOTION_STORY_VIDEO_PATH,
    );
    expect(resolveMotionStoryPosterSource()).toBe(
      DEFAULT_MOTION_STORY_POSTER_PATH,
    );
    expect(resolveMotionStoryPosterSource('   ')).toBe(
      DEFAULT_MOTION_STORY_POSTER_PATH,
    );
  });

  it('prefers trimmed configured motion story sources', () => {
    expect(
      resolveMotionStoryVideoSource('  /media/custom-motion-film.mp4  '),
    ).toBe('/media/custom-motion-film.mp4');
    expect(
      resolveMotionStoryPosterSource('  /media/custom-motion-poster.jpg  '),
    ).toBe('/media/custom-motion-poster.jpg');
  });

  it('ships a real local MP4 and JPEG at the documented default paths', () => {
    const videoFile = publicMediaFile(DEFAULT_MOTION_STORY_VIDEO_PATH);
    const posterFile = publicMediaFile(DEFAULT_MOTION_STORY_POSTER_PATH);

    expect(existsSync(videoFile)).toBe(true);
    expect(existsSync(posterFile)).toBe(true);
    expect(statSync(videoFile).size).toBeGreaterThan(0);
    expect(statSync(posterFile).size).toBeGreaterThan(0);
    expect(readFileSync(videoFile).subarray(4, 8).toString('ascii')).toBe('ftyp');
    expect([...readFileSync(posterFile).subarray(0, 3)]).toEqual([
      0xff, 0xd8, 0xff,
    ]);
  });
});

describe('motion story progress clamping', () => {
  it('clamps every progress source into the closed unit interval', () => {
    expect(clampMotionStoryProgress(0)).toBe(0);
    expect(clampMotionStoryProgress(0.5)).toBe(0.5);
    expect(clampMotionStoryProgress(1)).toBe(1);
    expect(clampMotionStoryProgress(-3)).toBe(0);
    expect(clampMotionStoryProgress(4)).toBe(1);
    expect(clampMotionStoryProgress(Number.NaN)).toBe(0);
  });

  it('never lets non-finite scroll input escape the cinematic range', () => {
    const nonFinite = [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ];

    for (const value of nonFinite) {
      expect(clampMotionStoryProgress(value)).toBe(0);
    }
  });
});

describe('motion story film transport', () => {
  /*
   * Scroll-scrubbing with `currentTime` seeks painted a stalled film: each seek
   * into an unbuffered region had to download that segment before a frame could
   * be shown, so the video froze instead of moving. The film now plays natively
   * at a reduced rate and scroll only trims how much of it is on screen.
   *
   * A rate strictly below 1 is what makes the browser decode and present real
   * frames. At 1.0 or above it would race the scrub again.
   */
  it('plays the film below real time so frames are actually decoded', () => {
    expect(MOTION_STORY_PLAYBACK_RATE).toBeLessThan(1);
    expect(MOTION_STORY_PLAYBACK_RATE).toBeGreaterThan(0.1);
  });

  it('maps scroll progress onto a rate, not onto a timestamp', () => {
    for (const progress of [0, 0.25, 0.5, 0.75, 1, -1, 2, Number.NaN]) {
      const rate = getMotionStoryPlaybackRate(progress);

      expect(Number.isFinite(rate)).toBe(true);
      expect(rate).toBeLessThanOrEqual(1);
      expect(rate).toBeGreaterThanOrEqual(0);
    }
  });

  it('eases the rate in and out of the track instead of snapping', () => {
    // A hard rate change at the boundaries reads as a gear shift while scrolling.
    const start = getMotionStoryPlaybackRate(0);
    const justInside = getMotionStoryPlaybackRate(0.02);
    const end = getMotionStoryPlaybackRate(1);

    expect(justInside).toBeGreaterThan(0);
    expect(start).toBeLessThanOrEqual(MOTION_STORY_PLAYBACK_RATE);
    expect(end).toBeLessThanOrEqual(MOTION_STORY_PLAYBACK_RATE);
    expect(Math.abs(justInside - start)).toBeLessThan(0.2);
    expect(Math.abs(end - justInside)).toBeLessThan(0.2);
  });

  it('keeps the rate inside the range the browser accepts', () => {
    // Safari refuses playbackRate values below 0.5 on some sources, and a rate
    // above 2 can drop frames. The ramp must stay in a safe band.
    for (const progress of progressSweep()) {
      const rate = getMotionStoryPlaybackRate(progress);

      expect(rate, String(progress)).toBeGreaterThanOrEqual(0.25);
      expect(rate, String(progress)).toBeLessThanOrEqual(1);
    }
  });

  it('never returns a negative or non-finite rate for invalid progress', () => {
    for (const value of [Number.NaN, Number.POSITIVE_INFINITY, -5, 9]) {
      const rate = getMotionStoryPlaybackRate(value);

      expect(rate).not.toBeNaN();
      expect(rate).toBeGreaterThanOrEqual(0);
      expect(rate).toBeLessThanOrEqual(1);
    }
  });
});

describe('motion story film scrubbing', () => {
  it('maps progress onto a clamped time inside the supplied duration', () => {
    // A short film is used whole: the window is a ceiling, never a target.
    const shortFilm = MOTION_STORY_SCRUB_WINDOW_SECONDS;
    expect(mapProgressToMotionStoryTime(0, shortFilm)).toBe(0);
    expect(mapProgressToMotionStoryTime(1, shortFilm)).toBeCloseTo(
      shortFilm - MOTION_STORY_VIDEO_END_PADDING_SECONDS,
      6,
    );
    expect(mapProgressToMotionStoryTime(2, shortFilm)).toBeCloseTo(
      shortFilm - MOTION_STORY_VIDEO_END_PADDING_SECONDS,
      6,
    );
    expect(mapProgressToMotionStoryTime(-1, shortFilm)).toBe(0);
  });

  it('stops scrubbing at the window instead of racing through the whole film', () => {
    /*
     * The supplied film is 23.06s. Spreading all of it across the scroll track
     * made a single wheel tick skip ~2.5s of footage, so the mapping is capped
     * to a window. The end of the track must land on the window, not on the
     * file duration.
     */
    const FILM_SECONDS = 23.06;
    const end = mapProgressToMotionStoryTime(1, FILM_SECONDS);

    expect(end).not.toBeNull();
    expect(end).toBeCloseTo(
      MOTION_STORY_SCRUB_WINDOW_SECONDS - MOTION_STORY_VIDEO_END_PADDING_SECONDS,
      6,
    );
    expect(end).toBeLessThan(FILM_SECONDS);
  });

  it('keeps the mapped curve monotonic across the window', () => {
    const times = progressSweep().map((progress) =>
      mapProgressToMotionStoryTime(progress, 23.06),
    );

    for (let index = 1; index < times.length; index += 1) {
      const previous = times[index - 1];
      const current = times[index];

      expect(previous).not.toBeNull();
      expect(current).not.toBeNull();
      expect(current as number).toBeGreaterThanOrEqual(previous as number);
    }
  });

  it('does not seek the film until a finite positive duration is known', () => {
    expect(mapProgressToMotionStoryTime(0.5, 0)).toBeNull();
    expect(mapProgressToMotionStoryTime(0.5, -3)).toBeNull();
    expect(mapProgressToMotionStoryTime(0.5, Number.NaN)).toBeNull();
    expect(mapProgressToMotionStoryTime(0.5, Number.POSITIVE_INFINITY)).toBeNull();
  });
});

describe('motion story scrub rate budget', () => {
  /*
   * The film felt like it was sprinting. The rate is pixels of scroll per
   * second of footage, and it is a property of two things that live in
   * different files — the scrub window in this module and the track height in
   * the stylesheet. Asserting the combined budget is what stops the ratio from
   * silently regressing.
   */
  const FILM_SECONDS = 23.06;
  const VIEWPORT_HEIGHT = 900;

  function trackHeightVh(): number {
    const css = new CssContract(readSource('src/index.css'));
    const height = css.declarationsFor(
      '.home-motion-story[data-cinematic="true"] .home-motion-story__track',
    )['height'];

    expect(
      height,
      'the cinematic track must declare a viewport-relative height',
    ).toBeTruthy();

    return Number.parseFloat((height as string).replace('vh', ''));
  }

  function pxPerSecondOfFootage(): number {
    // `1vh` is 1% of the viewport, not a whole viewport. The sticky stage
    // occupies one full viewport, so only the remainder scrolls.
    const trackPx = (trackHeightVh() / 100) * VIEWPORT_HEIGHT;
    const scrollablePx = trackPx - VIEWPORT_HEIGHT;

    expect(scrollablePx).toBeGreaterThan(0);

    return scrollablePx / MOTION_STORY_SCRUB_WINDOW_SECONDS;
  }

  it('gives the film at least the documented scroll budget', () => {
    expect(trackHeightVh()).toBeGreaterThan(1);
    // The original 200vh / 23.06s pair measured 39px per second of footage.
    expect(pxPerSecondOfFootage()).toBeGreaterThanOrEqual(
      MOTION_STORY_MIN_PX_PER_SECOND,
    );
  });

  it('stays inside the documented ceiling for this section', () => {
    expect(pxPerSecondOfFootage()).toBeLessThanOrEqual(
      MOTION_STORY_MAX_PX_PER_SECOND,
    );
  });

  it('never spends more of the film than the window allows', () => {
    expect(MOTION_STORY_SCRUB_WINDOW_SECONDS).toBeLessThan(FILM_SECONDS);
  });
});

describe('motion story cinematic frame', () => {
  it('keeps the frame bounded and inside the documented inset ceiling', () => {
    expect(getMotionStoryFrameInsetPx(0)).toBe(0);
    expect(getMotionStoryFrameInsetPx(0.1)).toBe(0);
    expect(getMotionStoryFrameInsetPx(0.45)).toBeCloseTo(
      MOTION_STORY_FRAME_INSET_MAX_PX / 2,
      6,
    );
    expect(getMotionStoryFrameInsetPx(1)).toBe(MOTION_STORY_FRAME_INSET_MAX_PX);
    expect(getMotionStoryFrameInsetPx(2)).toBe(MOTION_STORY_FRAME_INSET_MAX_PX);
    expect(getMotionStoryFrameInsetPx(-1)).toBe(0);
    expect(getMotionStoryFrameInsetPx(Number.NaN)).toBe(0);
  });

  it('rounds the frame in without ever exceeding the radius ceiling', () => {
    expect(getMotionStoryFrameRadiusPx(0)).toBe(0);
    expect(getMotionStoryFrameRadiusPx(0.5)).toBeCloseTo(
      MOTION_STORY_FRAME_RADIUS_MAX_PX / 2,
      6,
    );
    expect(getMotionStoryFrameRadiusPx(1)).toBe(
      MOTION_STORY_FRAME_RADIUS_MAX_PX,
    );
    expect(getMotionStoryFrameRadiusPx(Number.NaN)).toBe(0);
  });

  it('drifts the film inside the frame with scale only, never outside its band', () => {
    for (const progress of [...progressSweep(), -0.5, 1.5, Number.NaN]) {
      const scale = getMotionStoryVideoScale(progress);
      const drift = getMotionStoryVideoDriftPercent(progress);

      expect(scale).toBeGreaterThanOrEqual(MOTION_STORY_VIDEO_SCALE_START);
      expect(scale).toBeLessThanOrEqual(MOTION_STORY_VIDEO_SCALE_END);
      expect(drift).toBeGreaterThanOrEqual(MOTION_STORY_VIDEO_DRIFT_START_PERCENT);
      expect(drift).toBeLessThanOrEqual(MOTION_STORY_VIDEO_DRIFT_END_PERCENT);
      expect(Number.isFinite(scale)).toBe(true);
      expect(Number.isFinite(drift)).toBe(true);
    }

    expect(getMotionStoryVideoScale(0)).toBe(MOTION_STORY_VIDEO_SCALE_START);
    expect(getMotionStoryVideoScale(1)).toBe(MOTION_STORY_VIDEO_SCALE_END);
    expect(getMotionStoryVideoDriftPercent(0)).toBe(
      MOTION_STORY_VIDEO_DRIFT_START_PERCENT,
    );
    expect(getMotionStoryVideoDriftPercent(0.5)).toBeCloseTo(0, 6);
  });
});

describe('motion story copy beats', () => {
  it('always keeps at least one copy beat readable across the whole track', () => {
    expect(MOTION_STORY_COPY_BEAT_COUNT).toBe(2);

    for (const progress of progressSweep()) {
      const first = getMotionStoryCopyBeat(progress, 0);
      const second = getMotionStoryCopyBeat(progress, 1);

      expect(first.opacity).toBeGreaterThanOrEqual(0);
      expect(first.opacity).toBeLessThanOrEqual(1);
      expect(second.opacity).toBeGreaterThanOrEqual(0);
      expect(second.opacity).toBeLessThanOrEqual(1);
      expect(Math.abs(first.shiftPx)).toBeLessThanOrEqual(MOTION_STORY_COPY_SHIFT_PX);
      expect(Math.abs(second.shiftPx)).toBeLessThanOrEqual(MOTION_STORY_COPY_SHIFT_PX);

      expect(getMotionStoryVisibleCopyOpacity(progress)).toBeGreaterThan(0);
    }
  });

  it('opens with the first beat visible and settles on the second', () => {
    expect(getMotionStoryCopyBeat(0, 0).opacity).toBe(1);
    expect(getMotionStoryCopyBeat(0, 1).opacity).toBe(0);
    expect(getMotionStoryCopyBeat(1, 0).opacity).toBe(0);
    expect(getMotionStoryCopyBeat(1, 1).opacity).toBe(1);
  });

  it('never lets invalid progress hide the whole copy block', () => {
    for (const value of [Number.NaN, -2, 3]) {
      expect(getMotionStoryVisibleCopyOpacity(value)).toBeGreaterThan(0);
    }

    // Non-finite and negative progress fall back to the opening beat.
    for (const value of [Number.NaN, Number.POSITIVE_INFINITY, -2]) {
      expect(getMotionStoryCopyBeat(value, 0).opacity).toBe(1);
    }

    // Overshoot clamps to the closing beat.
    expect(getMotionStoryCopyBeat(3, 1).opacity).toBe(1);
  });
});

describe('motion story CTA geometry', () => {
  it('grows the bounded visual with transform scale and never past its cell', () => {
    expect(getMotionStoryCtaVisualScale(0)).toBe(
      MOTION_STORY_CTA_VISUAL_SCALE_START,
    );
    expect(getMotionStoryCtaVisualScale(1)).toBe(
      MOTION_STORY_CTA_VISUAL_SCALE_END,
    );

    for (const progress of [...progressSweep(), -1, 2, Number.NaN]) {
      const scale = getMotionStoryCtaVisualScale(progress);

      expect(scale).toBeGreaterThanOrEqual(MOTION_STORY_CTA_VISUAL_SCALE_START);
      expect(scale).toBeLessThanOrEqual(1);
    }
  });

  it('keeps the CTA copy and its link fully readable for every progress value', () => {
    for (const progress of [...progressSweep(), -1, 2, Number.NaN]) {
      expect(getMotionStoryCtaCopyOpacity(progress)).toBe(1);
      expect(getMotionStoryCtaCopyShiftPx(progress)).toBe(0);
    }
  });
});
