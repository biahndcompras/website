/**
 * Pure media and scroll-progress contract for the Home MotionStory section.
 *
 * This module is intentionally independent from the Hero media helpers: the
 * MotionStory section reuses the ORBS motion grammar, not the Hero template.
 */

export const DEFAULT_MOTION_STORY_VIDEO_PATH = '/media/bia-motion-story.mp4';
export const DEFAULT_MOTION_STORY_POSTER_PATH =
  '/media/bia-motion-story-poster.jpg';
export const MOTION_STORY_VIDEO_END_PADDING_SECONDS = 0.02;

/**
 * How much of the film the scroll track actually plays.
 *
 * The supplied footage runs 23.06s. Spreading all of it across a 200vh track
 * left only one viewport of scrollable distance, so the scrub rate collapsed to
 * roughly 39px of scroll per second of footage — about 2.5s of film skipped per
 * wheel tick, which read as the video sprinting.
 *
 * Capping the window keeps the mapping gentle without needing a track so long
 * that the section would swallow five viewports. A film shorter than the window
 * is still used whole, so a replacement clip can never be truncated.
 */
export const MOTION_STORY_SCRUB_WINDOW_SECONDS = 12;

/**
 * Scrub-rate budget, in pixels of scroll per second of footage. Measured at a
 * 900px viewport, where the scrollable distance is `(trackVh - 1) * 900`.
 *
 * The original 200vh / 23.06s configuration measured 39. The Home Hero, which
 * felt right, measures 174 at 400vh / 15.52s. This section is a supporting beat
 * rather than the opening statement, so it sits below the Hero: anything under
 * 90 still feels like a fast-forward.
 */
export const MOTION_STORY_MIN_PX_PER_SECOND = 90;
export const MOTION_STORY_MAX_PX_PER_SECOND = 170;

/** Frame bounds. The inset ceiling keeps the frame inside the sticky stage. */
export const MOTION_STORY_FRAME_INSET_MAX_PX = 30;
export const MOTION_STORY_FRAME_RADIUS_MAX_PX = 48;

/** Film drift happens with transform only: scale plus a percentage offset. */
export const MOTION_STORY_VIDEO_SCALE_START = 1.02;
export const MOTION_STORY_VIDEO_SCALE_END = 1.12;
export const MOTION_STORY_VIDEO_DRIFT_START_PERCENT = -3;
export const MOTION_STORY_VIDEO_DRIFT_END_PERCENT = 3;

/** Copy beats translate by at most this many pixels on the Y axis. */
export const MOTION_STORY_COPY_SHIFT_PX = 56;
export const MOTION_STORY_COPY_BEAT_COUNT = 2;

/** The CTA visual only ever scales inside its own bounded grid cell. */
export const MOTION_STORY_CTA_VISUAL_SCALE_START = 0.86;
export const MOTION_STORY_CTA_VISUAL_SCALE_END = 1;

const FRAME_INSET_RANGE = [0.1, 0.8] as const;
const FRAME_RADIUS_RANGE = [0.16, 0.84] as const;

const COPY_BEAT_RANGES = [
  {
    opacity: [0, 0.14, 0.4, 0.54],
    output: [1, 1, 0, 0],
    shift: [0, 0, 0, 0],
    shiftOutput: [0, 0, -1, -1],
  },
  {
    opacity: [0.34, 0.5, 0.68, 1],
    output: [0, 1, 1, 1],
    shift: [0.34, 0.5, 0.68, 1],
    shiftOutput: [1, 0, 0, 0],
  },
] as const;

const CTA_VISUAL_RANGE = [0.15, 1] as const;

function resolveMediaSource(
  configuredSource: string | null | undefined,
  defaultSource: string,
): string {
  return configuredSource?.trim() || defaultSource;
}

export function resolveMotionStoryVideoSource(
  configuredSource?: string | null,
): string {
  return resolveMediaSource(configuredSource, DEFAULT_MOTION_STORY_VIDEO_PATH);
}

export function resolveMotionStoryPosterSource(
  configuredSource?: string | null,
): string {
  return resolveMediaSource(
    configuredSource,
    DEFAULT_MOTION_STORY_POSTER_PATH,
  );
}

export function clampMotionStoryProgress(progress: number): number {
  if (!Number.isFinite(progress)) {
    return 0;
  }

  return Math.min(1, Math.max(0, progress));
}

/**
 * Piecewise-linear interpolation that clamps outside the supplied input range,
 * so out-of-contract progress can never push a value past its ceiling.
 */
function interpolateClamped(
  value: number,
  input: readonly number[],
  output: readonly number[],
): number {
  if (input.length < 2 || input.length !== output.length) {
    return 0;
  }

  if (value <= input[0]) {
    return output[0];
  }

  for (let index = 1; index < input.length; index += 1) {
    if (value <= input[index]) {
      const span = input[index] - input[index - 1];
      if (span <= 0) {
        return output[index];
      }

      const step = (value - input[index - 1]) / span;
      return output[index - 1] + step * (output[index] - output[index - 1]);
    }
  }

  return output[output.length - 1];
}

export function mapProgressToMotionStoryTime(
  progress: number,
  duration: number,
): number | null {
  if (!Number.isFinite(duration) || duration <= 0) {
    return null;
  }

  // A film shorter than the window plays whole; a longer one is capped so the
  // scroll track does not have to race through it.
  const playableSeconds = Math.min(duration, MOTION_STORY_SCRUB_WINDOW_SECONDS);
  const maxTime =
    playableSeconds <= MOTION_STORY_VIDEO_END_PADDING_SECONDS
      ? playableSeconds
      : playableSeconds - MOTION_STORY_VIDEO_END_PADDING_SECONDS;

  return clampMotionStoryProgress(progress) * maxTime;
}

export function getMotionStoryFrameInsetPx(progress: number): number {
  return interpolateClamped(
    clampMotionStoryProgress(progress),
    FRAME_INSET_RANGE,
    [0, MOTION_STORY_FRAME_INSET_MAX_PX],
  );
}

export function getMotionStoryFrameRadiusPx(progress: number): number {
  return interpolateClamped(
    clampMotionStoryProgress(progress),
    FRAME_RADIUS_RANGE,
    [0, MOTION_STORY_FRAME_RADIUS_MAX_PX],
  );
}

export function getMotionStoryVideoScale(progress: number): number {
  return interpolateClamped(
    clampMotionStoryProgress(progress),
    [0, 1],
    [MOTION_STORY_VIDEO_SCALE_START, MOTION_STORY_VIDEO_SCALE_END],
  );
}

export function getMotionStoryVideoDriftPercent(progress: number): number {
  return interpolateClamped(
    clampMotionStoryProgress(progress),
    [0, 1],
    [
      MOTION_STORY_VIDEO_DRIFT_START_PERCENT,
      MOTION_STORY_VIDEO_DRIFT_END_PERCENT,
    ],
  );
}

export interface MotionStoryCopyBeatState {
  opacity: number;
  shiftPx: number;
}

/**
 * The two copy beats cross-fade so at least one of them is always readable
 * across the whole track: the section never opens or closes on empty copy.
 */
export function getMotionStoryCopyBeat(
  progress: number,
  beat: 0 | 1,
): MotionStoryCopyBeatState {
  const range = COPY_BEAT_RANGES[beat] ?? COPY_BEAT_RANGES[0];
  const normalizedProgress = clampMotionStoryProgress(progress);
  const opacity = interpolateClamped(
    normalizedProgress,
    range.opacity,
    range.output,
  );
  const shiftRatio = interpolateClamped(
    normalizedProgress,
    range.shift,
    range.shiftOutput,
  );

  return {
    opacity,
    shiftPx: shiftRatio * MOTION_STORY_COPY_SHIFT_PX,
  };
}

export function getMotionStoryVisibleCopyOpacity(progress: number): number {
  const normalizedProgress = clampMotionStoryProgress(progress);

  return Math.max(
    getMotionStoryCopyBeat(normalizedProgress, 0).opacity,
    getMotionStoryCopyBeat(normalizedProgress, 1).opacity,
  );
}

export function getMotionStoryCtaVisualScale(progress: number): number {
  return interpolateClamped(
    clampMotionStoryProgress(progress),
    CTA_VISUAL_RANGE,
    [
      MOTION_STORY_CTA_VISUAL_SCALE_START,
      MOTION_STORY_CTA_VISUAL_SCALE_END,
    ],
  );
}

/**
 * The CTA copy and its link are never faded or moved by scroll: the visual
 * grows beside them, so the action must stay readable and clickable.
 */
export function getMotionStoryCtaCopyOpacity(_progress: number): number {
  return 1;
}

export function getMotionStoryCtaCopyShiftPx(_progress: number): number {
  return 0;
}
