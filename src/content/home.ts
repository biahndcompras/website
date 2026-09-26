import { ROUTE_PATHS } from '../app/routes';

export const HOME_SECTION_IDS = {
  story: 'bia-story',
  hubs: 'bia-hubs',
  origin: 'bia-origin',
  process: 'bia-process',
  brands: 'bia-brands',
  motion: 'bia-motion',
  quality: 'bia-quality',
  talent: 'bia-talent',
} as const;

export type HomeSectionId =
  (typeof HOME_SECTION_IDS)[keyof typeof HOME_SECTION_IDS];

export const HOME_NAVIGATION_ANCHOR_IDS = [
  HOME_SECTION_IDS.story,
  HOME_SECTION_IDS.hubs,
  HOME_SECTION_IDS.brands,
] as const;

export type HomeNavigationAnchorId =
  (typeof HOME_NAVIGATION_ANCHOR_IDS)[number];

function isHomePathname(pathname: string): boolean {
  const normalizedPathname =
    pathname.length > 1 ? pathname.replace(/\/+$/, '') || '/' : pathname;

  return normalizedPathname === ROUTE_PATHS.home;
}

export function getHomeAnchorHref(
  anchorId: HomeNavigationAnchorId | HomeSectionId | 'contact',
  pathname: string = ROUTE_PATHS.home,
): string {
  const anchor = anchorId === 'contact' ? 'contact' : anchorId;
  return isHomePathname(pathname)
    ? `#${anchor}`
    : `${ROUTE_PATHS.home}#${anchor}`;
}
