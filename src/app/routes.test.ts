import { describe, expect, it } from 'vitest';
import {
  appRoutes,
  ENGLISH_ROUTE_ALIASES,
  getCanonicalRoutePath,
  getRouteAliasId,
  getRouteId,
  getRouteNavigationLocale,
  getRouteNavigationState,
  normalizeRoutePath,
  ROUTE_PATHS,
} from './routes';

describe('BIA application routes', () => {
  it('keeps the existing Home and Careers destinations intact', () => {
    expect(ROUTE_PATHS.home).toBe('/');
    expect(ROUTE_PATHS.careers).toBe('/careers');
    expect(appRoutes[0]).toEqual({ id: 'home', path: '/' });
    expect(getRouteId('/')).toBe('home');
    expect(getRouteId('/careers')).toBe('careers');
    expect(getRouteId('/careers/')).toBe('careers');
  });

  it('declares one canonical Spanish path per secondary page plus the legacy Careers path', () => {
    expect(ROUTE_PATHS).toEqual({
      home: '/',
      nosotros: '/nosotros',
      marcas: '/marcas',
      calidad: '/calidad-y-sostenibilidad',
      talento: '/talento',
      contactanos: '/contactanos',
      careers: '/careers',
    });
    expect(appRoutes.map((route) => route.id)).toEqual([
      'home',
      'nosotros',
      'marcas',
      'calidad',
      'talento',
      'contactanos',
      'careers',
    ]);
    expect(appRoutes.map((route) => route.path)).toEqual([
      '/',
      '/nosotros',
      '/marcas',
      '/calidad-y-sostenibilidad',
      '/talento',
      '/contactanos',
      '/careers',
    ]);
  });

  it('normalizes trailing and repeated slashes before resolving a route', () => {
    expect(normalizeRoutePath('/')).toBe('/');
    expect(normalizeRoutePath('//')).toBe('/');
    expect(normalizeRoutePath('/nosotros')).toBe('/nosotros');
    expect(normalizeRoutePath('/nosotros/')).toBe('/nosotros');
    expect(normalizeRoutePath('/nosotros///')).toBe('/nosotros');
    expect(getRouteId('/nosotros/')).toBe('nosotros');
    expect(getRouteId('/calidad-y-sostenibilidad/')).toBe('calidad');
    expect(getRouteId('///contactanos')).toBe('contactanos');
  });

  it('resolves every English alias to its canonical Spanish route id', () => {
    expect(getRouteId('/about')).toBe('nosotros');
    expect(getRouteId('/brands')).toBe('marcas');
    expect(getRouteId('/quality')).toBe('calidad');
    expect(getRouteId('/contact')).toBe('contactanos');
    expect(getRouteId('/about/')).toBe('nosotros');
    expect(getRouteAliasId('/about')).toBe('nosotros');
    expect(getRouteAliasId('/nosotros')).toBeNull();
  });

  it('keeps the declared Careers id while exposing /careers as the /talento alias', () => {
    expect(getRouteAliasId('/careers')).toBe('talento');
    expect(getRouteId('/careers')).toBe('careers');
    expect(getRouteId('/talento')).toBe('talento');
  });

  it('canonicalizes aliases and declared paths to the Spanish destination', () => {
    expect(getCanonicalRoutePath('/about')).toBe('/nosotros');
    expect(getCanonicalRoutePath('/brands')).toBe('/marcas');
    expect(getCanonicalRoutePath('/quality')).toBe('/calidad-y-sostenibilidad');
    expect(getCanonicalRoutePath('/contact')).toBe('/contactanos');
    expect(getCanonicalRoutePath('/careers')).toBe('/talento');
    expect(getCanonicalRoutePath('/nosotros/')).toBe('/nosotros');
    expect(getCanonicalRoutePath('/talento')).toBe('/talento');
    expect(getCanonicalRoutePath('/')).toBe('/');
    expect(getCanonicalRoutePath('/nope')).toBeNull();
  });

  it('declares exactly one English alias per canonical secondary page', () => {
    expect(Object.keys(ENGLISH_ROUTE_ALIASES).sort()).toEqual([
      '/about',
      '/brands',
      '/careers',
      '/contact',
      '/quality',
    ]);
    expect(Object.values(ENGLISH_ROUTE_ALIASES).sort()).toEqual([
      'calidad',
      'contactanos',
      'marcas',
      'nosotros',
      'talento',
    ]);
    expect(ENGLISH_ROUTE_ALIASES['/careers']).toBe('talento');
  });

  it('never resolves an unknown or prototype-shaped path to a route', () => {
    for (const pathname of [
      '',
      '/nope',
      'nosotros',
      '/about/team',
      'constructor',
      'toString',
      '__proto__',
    ]) {
      expect(getRouteId(pathname)).toBeNull();
      expect(getRouteAliasId(pathname)).toBeNull();
      expect(getCanonicalRoutePath(pathname)).toBeNull();
    }
  });

  it('round-trips only supported locales through route navigation state', () => {
    expect(getRouteNavigationLocale(getRouteNavigationState('en'))).toBe('en');
    expect(getRouteNavigationLocale(getRouteNavigationState('es'))).toBe('es');
    expect(getRouteNavigationLocale({ biaLocale: 'fr' })).toBeNull();
    expect(getRouteNavigationLocale(null)).toBeNull();
  });
});
