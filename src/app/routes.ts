import type { Locale } from '../types';

export type AppRouteId =
  | 'home'
  | 'nosotros'
  | 'marcas'
  | 'calidad'
  | 'talento'
  | 'contactanos'
  | 'careers';

export const ROUTE_PATHS = {
  home: '/',
  nosotros: '/nosotros',
  marcas: '/marcas',
  calidad: '/calidad-y-sostenibilidad',
  talento: '/talento',
  contactanos: '/contactanos',
  /**
   * Legacy English destination. It stays a declared route on purpose so the
   * current Careers composition, header hero id, document metadata, and
   * aria-current behavior stay untouched until the talent page moves onto the
   * canonical `/talento` path. `ENGLISH_ROUTE_ALIASES` still records `/careers`
   * as the English alias of `/talento` for canonicalization.
   */
  careers: '/careers',
} as const;

export interface AppRoute {
  id: AppRouteId;
  path: (typeof ROUTE_PATHS)[AppRouteId];
}

export const appRoutes = [
  { id: 'home', path: ROUTE_PATHS.home },
  { id: 'nosotros', path: ROUTE_PATHS.nosotros },
  { id: 'marcas', path: ROUTE_PATHS.marcas },
  { id: 'calidad', path: ROUTE_PATHS.calidad },
  { id: 'talento', path: ROUTE_PATHS.talento },
  { id: 'contactanos', path: ROUTE_PATHS.contactanos },
  { id: 'careers', path: ROUTE_PATHS.careers },
] as const satisfies readonly AppRoute[];

/**
 * English alias path -> canonical route id. Every secondary page has exactly
 * one English alias. `/careers` resolves to `talento` here, while `getRouteId`
 * keeps answering `careers` for the declared `/careers` path.
 */
export const ENGLISH_ROUTE_ALIASES: Readonly<Record<string, AppRouteId>> = {
  '/about': 'nosotros',
  '/brands': 'marcas',
  '/quality': 'calidad',
  '/careers': 'talento',
  '/contact': 'contactanos',
};

/**
 * Typed view of the alias table. Every alias is mounted as a real route so a
 * direct visit to `/about` or `/brands` renders the page instead of falling
 * through to the catch-all redirect. `/careers` is excluded because it is
 * already a declared path in `ROUTE_PATHS`.
 */
export const ENGLISH_ROUTE_ALIAS_PATHS = {
  about: '/about',
  brands: '/brands',
  quality: '/quality',
  contact: '/contact',
} as const satisfies Readonly<Record<string, string>>;

const mountedAliasPaths: ReadonlySet<string> = new Set(
  Object.values(ENGLISH_ROUTE_ALIAS_PATHS),
);

for (const [alias, routeId] of Object.entries(ENGLISH_ROUTE_ALIASES)) {
  if (alias === ROUTE_PATHS.careers) {
    continue;
  }

  if (!mountedAliasPaths.has(alias)) {
    throw new Error(
      `The English alias "${alias}" for "${routeId}" has no mounted route path.`,
    );
  }
}

export const BIA_LOCALE_NAVIGATION_STATE_KEY = 'biaLocale' as const;

export type BiaNavigationState = Record<
  typeof BIA_LOCALE_NAVIGATION_STATE_KEY,
  Locale
>;

export function getRouteNavigationState(locale: Locale): BiaNavigationState {
  return { [BIA_LOCALE_NAVIGATION_STATE_KEY]: locale };
}

export function getRouteNavigationLocale(state: unknown): Locale | null {
  if (typeof state !== 'object' || state === null) {
    return null;
  }

  const locale = (state as Record<string, unknown>)[
    BIA_LOCALE_NAVIGATION_STATE_KEY
  ];

  return locale === 'es' || locale === 'en' ? locale : null;
}

/**
 * Collapses repeated leading slashes and strips trailing slashes so `//about/`
 * and `/about` resolve to the same route. Paths without a leading slash are
 * returned untouched, which keeps them out of the route table.
 */
export function normalizeRoutePath(pathname: string): string {
  if (!pathname.startsWith('/')) {
    return pathname;
  }

  const collapsedPathname = pathname.replace(/^\/{2,}/, '/');

  return collapsedPathname.length > 1
    ? collapsedPathname.replace(/\/+$/, '') || '/'
    : collapsedPathname;
}

function readAliasRouteId(normalizedPathname: string): AppRouteId | null {
  if (
    !Object.prototype.hasOwnProperty.call(ENGLISH_ROUTE_ALIASES, normalizedPathname)
  ) {
    return null;
  }

  return ENGLISH_ROUTE_ALIASES[normalizedPathname] ?? null;
}

function findDeclaredRouteId(normalizedPathname: string): AppRouteId | null {
  return (
    appRoutes.find((route) => route.path === normalizedPathname)?.id ?? null
  );
}

/**
 * Resolves a declared route path first, then falls back to the English alias
 * table. A declared path always wins so `/careers` keeps its legacy id.
 */
export function getRouteId(pathname: string): AppRouteId | null {
  const normalizedPathname = normalizeRoutePath(pathname);

  return (
    findDeclaredRouteId(normalizedPathname) ?? readAliasRouteId(normalizedPathname)
  );
}

/** Resolves only the English alias table, ignoring declared route paths. */
export function getRouteAliasId(pathname: string): AppRouteId | null {
  return readAliasRouteId(normalizeRoutePath(pathname));
}

/**
 * Returns the canonical Spanish path a destination resolves to, or null when
 * the path is not part of the application.
 */
export function getCanonicalRoutePath(pathname: string): string | null {
  const normalizedPathname = normalizeRoutePath(pathname);
  const aliasRouteId = readAliasRouteId(normalizedPathname);

  if (aliasRouteId) {
    return ROUTE_PATHS[aliasRouteId];
  }

  return appRoutes.find((route) => route.path === normalizedPathname)?.path ?? null;
}
