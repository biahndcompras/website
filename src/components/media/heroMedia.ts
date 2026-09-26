export const DEFAULT_HERO_VIDEO_PATH = '/media/bia-origin-hero.mp4';
export const DEFAULT_HERO_POSTER_PATH = '/media/bia-origin-poster.jpg';
export const HERO_VIDEO_END_PADDING_SECONDS = 0.02;

export type HeroMediaState = 'loading' | 'ready' | 'fallback';
export type HeroMediaEvent = 'loadeddata' | 'error';

function resolveHeroMediaSource(
  configuredSource: string | null | undefined,
  defaultSource: string,
): string {
  return configuredSource?.trim() || defaultSource;
}

export function resolveHeroVideoSource(configuredSource?: string | null): string {
  return resolveHeroMediaSource(configuredSource, DEFAULT_HERO_VIDEO_PATH);
}

export function resolveHeroPosterSource(
  configuredSource?: string | null,
): string {
  return resolveHeroMediaSource(configuredSource, DEFAULT_HERO_POSTER_PATH);
}

function clampProgress(progress: number): number {
  if (Number.isNaN(progress)) {
    return 0;
  }

  return Math.min(1, Math.max(0, progress));
}

export function mapProgressToVideoTime(
  progress: number,
  duration: number,
): number | null {
  if (!Number.isFinite(duration) || duration <= 0) {
    return null;
  }

  const normalizedProgress = clampProgress(progress);
  const maxTime =
    duration <= HERO_VIDEO_END_PADDING_SECONDS
      ? duration
      : duration - HERO_VIDEO_END_PADDING_SECONDS;

  return normalizedProgress * maxTime;
}

export function getNextHeroMediaState(
  currentState: HeroMediaState,
  event: HeroMediaEvent,
): HeroMediaState {
  if (event === 'error') {
    return 'fallback';
  }

  return currentState === 'loading' || currentState === 'fallback'
    ? 'ready'
    : currentState;
}
