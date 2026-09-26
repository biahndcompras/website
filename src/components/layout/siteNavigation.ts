import type { Locale } from '../../types';
import { translate } from '../../i18n/I18nProvider';
import type { TranslationKey } from '../../i18n/translations';
import {
  getSecondaryPage,
  isSecondaryPageId,
} from '../../content/secondaryPages';
import {
  getRouteId,
  getRouteNavigationState,
  ROUTE_PATHS,
  type AppRouteId,
  type BiaNavigationState,
} from '../../app/routes';

export type SiteNavigationId =
  | 'home'
  | 'nosotros'
  | 'marcas'
  | 'calidad'
  | 'talento'
  | 'contactanos';

export interface SiteNavigationItem {
  id: SiteNavigationId;
  href: string;
  label: string;
  navigationState: BiaNavigationState;
}

interface NavigationDefinition {
  id: SiteNavigationId;
  href: string;
  labelKey: TranslationKey;
}

/**
 * The primary navigation links to the real pages. Home keeps its `#top` anchor
 * while it is the current route; the secondary destinations stay on their
 * canonical Spanish path in both locales and carry the locale in
 * `navigationState` instead of duplicating the path per language.
 */
const navigationDefinitions: readonly NavigationDefinition[] = [
  { id: 'home', href: '#top', labelKey: 'navigation.home' },
  { id: 'nosotros', href: ROUTE_PATHS.nosotros, labelKey: 'navigation.nosotros' },
  { id: 'marcas', href: ROUTE_PATHS.marcas, labelKey: 'navigation.marcas' },
  { id: 'calidad', href: ROUTE_PATHS.calidad, labelKey: 'navigation.calidad' },
  { id: 'talento', href: ROUTE_PATHS.talento, labelKey: 'navigation.talento' },
  {
    id: 'contactanos',
    href: ROUTE_PATHS.contactanos,
    labelKey: 'navigation.contactanos',
  },
];

function resolveNavigationHref(
  id: SiteNavigationId,
  href: string,
  isHomeRoute: boolean,
): string {
  if (id === 'home' && !isHomeRoute) {
    return ROUTE_PATHS.home;
  }

  return href;
}

export function getSiteNavigation(
  locale: Locale,
  pathname: string = ROUTE_PATHS.home,
): SiteNavigationItem[] {
  const isHomeRoute = getRouteId(pathname) === 'home';

  return navigationDefinitions.map(({ id, href, labelKey }) => ({
    id,
    href: resolveNavigationHref(id, href, isHomeRoute),
    label: translate(labelKey, locale),
    navigationState: getRouteNavigationState(locale),
  }));
}

export interface SiteMetadata {
  title: string;
  description: string;
}

export function getSiteMetadata(
  locale: Locale,
  routeId: AppRouteId = 'home',
): SiteMetadata {
  if (routeId === 'home') {
    return {
      title: translate('metadata.title', locale),
      description: translate('metadata.description', locale),
    };
  }

  // `/careers` is the declared english alias of `/talento`, so both ids must
  // resolve to the same employer-brand metadata instead of the legacy careers
  // title.
  if (routeId === 'talento' || routeId === 'careers') {
    const page = getSecondaryPage('talento');

    return {
      title: page.documentTitle[locale],
      description: page.documentDescription[locale],
    };
  }

  if (isSecondaryPageId(routeId)) {
    const page = getSecondaryPage(routeId);

    return {
      title: page.documentTitle[locale],
      description: page.documentDescription[locale],
    };
  }

  return {
    title: translate('metadata.title', locale),
    description: translate('metadata.description', locale),
  };
}
