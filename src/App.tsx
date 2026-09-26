import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Lenis from 'lenis';
import { AnimatePresence } from 'motion/react';
import { I18nProvider, useI18n } from './i18n/I18nProvider';
import CalidadPage from './pages/CalidadPage';
import ContactanosPage from './pages/ContactanosPage';
import HomePage from './pages/HomePage';
import MarcasPage from './pages/MarcasPage';
import NosotrosPage from './pages/NosotrosPage';
import TalentoPage from './pages/TalentoPage';
import LoadingScreen from './components/LoadingScreen';
import SiteFooter from './components/layout/SiteFooter';
import SiteHeader from './components/layout/SiteHeader';
import { getSiteMetadata } from './components/layout/siteNavigation';
import {
  ENGLISH_ROUTE_ALIAS_PATHS,
  getCanonicalRoutePath,
  getRouteId,
  getRouteNavigationLocale,
  getRouteNavigationState,
  ROUTE_PATHS,
  type AppRouteId,
} from './app/routes';

const TALENT_ROUTE_IDS: readonly AppRouteId[] = ['talento', 'careers'];

function getHeaderHeroId(routeId: AppRouteId): string {
  if (routeId === 'home') {
    return 'bia-hero';
  }

  if (TALENT_ROUTE_IDS.includes(routeId)) {
    return 'careers-hero';
  }

  return 'secondary-hero';
}

function BiaApp() {
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const routeId = getRouteId(location.pathname) ?? 'home';
  const routeNavigationLocale = getRouteNavigationLocale(location.state);
  const [isLoading, setIsLoading] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);
  const savedScrollYRef = useRef(0);
  const previousLocaleRef = useRef(locale);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (routeNavigationLocale && routeNavigationLocale !== locale) {
      setLocale(routeNavigationLocale);
    }
  }, [locale, routeNavigationLocale, setLocale]);

  useEffect(() => {
    const metadata = getSiteMetadata(locale, routeId);
    document.title = metadata.title;

    const updateMeta = (selector: string, attribute: 'name' | 'property', key: string, value: string) => {
      let element = document.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = value;
    };

    // The English aliases are real routes, so each one declares the Spanish
    // canonical path to keep search engines on a single URL per page.
    const canonicalPath = getCanonicalRoutePath(location.pathname);
    if (canonicalPath) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.href = `${window.location.origin}${canonicalPath}`;
    }

    updateMeta('meta[name="description"]', 'name', 'description', metadata.description);
    updateMeta('meta[property="og:title"]', 'property', 'og:title', metadata.title);
    updateMeta(
      'meta[property="og:description"]',
      'property',
      'og:description',
      metadata.description,
    );
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', metadata.title);
    updateMeta(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      metadata.description,
    );
  }, [locale, routeId, location.pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
    });
    let animationFrameId = 0;
    const runFrame = (time: number) => {
      lenis.raf(time);
      animationFrameId = window.requestAnimationFrame(runFrame);
    };
    const resize = () => lenis.resize();
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);

    lenisRef.current = lenis;
    animationFrameId = window.requestAnimationFrame(runFrame);
    window.addEventListener('resize', resize);
    resizeObserver?.observe(document.body);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      resizeObserver?.disconnect();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const updateSavedScroll = () => {
      savedScrollYRef.current = window.scrollY;
    };

    updateSavedScroll();
    window.addEventListener('scroll', updateSavedScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateSavedScroll);
    };
  }, []);

  useEffect(() => {
    if (previousLocaleRef.current === locale) {
      return;
    }

    previousLocaleRef.current = locale;
    const savedScrollY = savedScrollYRef.current;
    const frameId = window.requestAnimationFrame(() => {
      let destinationY = savedScrollY;

      try {
        const hash = decodeURIComponent(location.hash.slice(1));
        const target = hash ? document.getElementById(hash) : null;
        if (target) {
          const offset = 6.5 * 16;
          destinationY = window.scrollY + target.getBoundingClientRect().top - offset;
        }
      } catch {
        // Keep the numeric scroll position when a malformed hash is present.
      }

      lenisRef.current?.scrollTo(destinationY, { immediate: true });
      window.scrollTo(0, destinationY);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [locale]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis || isLoading) {
      return;
    }

    lenis.start();
    lenis.resize();

    if (!location.hash) {
      lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }

    const resizeTimer = window.setTimeout(() => {
      lenis.resize();
    }, 100);

    return () => {
      window.clearTimeout(resizeTimer);
    };
  }, [isLoading, location.hash, location.pathname]);

  useEffect(() => {
    if (isLoading || !location.hash) {
      return;
    }

    let hash: string;
    try {
      hash = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }

    if (!hash) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const target = document.getElementById(hash);
      if (!target) {
        return;
      }

      const offset = 6.5;
      const top = target.getBoundingClientRect().top + window.scrollY - offset * 16;
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(top, { immediate: true });
      } else {
        window.scrollTo({ top, behavior: 'auto' });
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isLoading, location.hash, location.pathname]);

  const focusMainContent = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById('main-content')?.focus();
    });
  };

  return (
    <div id="top" className="bia-app-shell">
      <a className="skip-link" href="#main-content" onClick={focusMainContent}>
        {t('accessibility.skipToContent')}
      </a>
      <SiteHeader heroId={getHeaderHeroId(routeId)} />
      <main id="main-content" className="bia-main" tabIndex={-1}>
        <Routes>
          <Route path={ROUTE_PATHS.home} element={<HomePage />} />
          <Route path={ROUTE_PATHS.nosotros} element={<NosotrosPage />} />
          <Route path={ROUTE_PATHS.marcas} element={<MarcasPage />} />
          <Route path={ROUTE_PATHS.calidad} element={<CalidadPage />} />
          <Route path={ROUTE_PATHS.talento} element={<TalentoPage />} />
          <Route path={ROUTE_PATHS.contactanos} element={<ContactanosPage />} />
          <Route path={ROUTE_PATHS.careers} element={<TalentoPage />} />
          <Route path={ENGLISH_ROUTE_ALIAS_PATHS.about} element={<NosotrosPage />} />
          <Route path={ENGLISH_ROUTE_ALIAS_PATHS.brands} element={<MarcasPage />} />
          <Route path={ENGLISH_ROUTE_ALIAS_PATHS.quality} element={<CalidadPage />} />
          <Route path={ENGLISH_ROUTE_ALIAS_PATHS.contact} element={<ContactanosPage />} />
          <Route
            path="*"
            element={
              <Navigate
                to={ROUTE_PATHS.home}
                replace
                state={getRouteNavigationState(locale)}
              />
            }
          />
        </Routes>
      </main>
      <SiteFooter />
      <AnimatePresence>
        {isLoading ? <LoadingScreen onComplete={handleLoadingComplete} /> : null}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <BiaApp />
      </I18nProvider>
    </BrowserRouter>
  );
}
