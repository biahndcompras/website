import { ArrowUpRight, Globe2, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  getRouteAliasId,
  getRouteId,
  getRouteNavigationState,
  ROUTE_PATHS,
} from '../../app/routes';
import { useI18n } from '../../i18n/I18nProvider';
import type { Locale } from '../../types';
import BiaLogo from './BiaLogo';
import {
  getSiteNavigation,
  type SiteNavigationItem,
} from './siteNavigation';

export interface SiteHeaderProps {
  heroId?: string;
  className?: string;
}

const locales: readonly Locale[] = ['es', 'en'];

export default function SiteHeader({
  heroId = 'bia-hero',
  className = '',
}: SiteHeaderProps) {
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const routeId = getRouteId(location.pathname);
  const canonicalRouteId = getRouteAliasId(location.pathname) ?? routeId;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const previousLocationKeyRef = useRef(location.key);
  const navigation = getSiteNavigation(locale, location.pathname);
  const isHomeRoute = routeId === 'home';

  useEffect(() => {
    let frameId = 0;

    const updateTheme = () => {
      if (typeof window === 'undefined') {
        return;
      }

      const hero = document.getElementById(heroId);
      if (!hero) {
        setIsOverHero(window.scrollY < window.innerHeight * 3);
        return;
      }

      const heroBottom = hero.getBoundingClientRect().bottom;
      setIsOverHero(heroBottom > 76);
    };

    const handleScroll = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateTheme();
      });
    };

    updateTheme();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [heroId, location.pathname]);

  useEffect(() => {
    if (previousLocationKeyRef.current === location.key) {
      return;
    }

    previousLocationKeyRef.current = location.key;
    if (isMenuOpen) {
      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    }
  }, [isMenuOpen, location.key]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const focusTimer = window.setTimeout(() => {
      firstMobileLinkRef.current?.focus();
    }, 0);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    if (isMenuOpen) {
      menuButtonRef.current?.focus();
    }
  };

  const navigationContent = (
    item: SiteNavigationItem,
    isMobile: boolean,
  ): ReactNode =>
    isMobile ? (
      <>
        <span>{item.label}</span>
        <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
      </>
    ) : (
      item.label
    );

  const renderNavigationLink = (
    item: SiteNavigationItem,
    linkClassName: string,
    isMobile = false,
  ) => {
    // `/careers` resolves to the `careers` id, but the navigation item is
    // `talento`; comparing canonical ids keeps aria-current correct on the alias.
    const isCurrentPage = item.id === routeId || item.id === canonicalRouteId;
    const ariaCurrent = isCurrentPage ? 'page' : undefined;
    const linkProps = {
      className: linkClassName,
      onClick: closeMenu,
      'aria-current': ariaCurrent,
    } as const;

    if (item.href.startsWith('/')) {
      return (
        <Link
          key={item.id}
          to={item.href}
          state={item.navigationState}
          ref={isMobile && item.id === 'home' ? firstMobileLinkRef : undefined}
          {...linkProps}
        >
          {navigationContent(item, isMobile)}
        </Link>
      );
    }

    return (
      <a
        key={item.id}
        href={item.href}
        ref={isMobile && item.id === 'home' ? firstMobileLinkRef : undefined}
        {...linkProps}
      >
        {navigationContent(item, isMobile)}
      </a>
    );
  };

  const headerTheme = isOverHero ? 'site-header--dark' : 'site-header--light';
  // Contact now has its own editorial page; only Home keeps the in-page anchor.
  const contactHref = isHomeRoute
    ? '#contact'
    : ROUTE_PATHS.contactanos;
  const contactContent = (
    <>
      <span>{t('navigation.contact')}</span>
      <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.5} />
    </>
  );
  const brandContent = <BiaLogo className="bia-logo" />;

  return (
    <header
      className={`site-header ${headerTheme} ${className}`.trim()}
      data-theme={isOverHero ? 'dark' : 'light'}
    >
      <div className="site-header__inner">
        {isHomeRoute ? (
          <a
            href="#top"
            className="site-header__brand"
            onClick={closeMenu}
            aria-current="page"
            aria-label={t('navigation.home')}
          >
            {brandContent}
          </a>
        ) : (
          <Link
            to={ROUTE_PATHS.home}
            state={getRouteNavigationState(locale)}
            className="site-header__brand"
            onClick={closeMenu}
            aria-label={t('navigation.home')}
          >
            {brandContent}
          </Link>
        )}

        <nav
          className="site-header__desktop-nav"
          aria-label={t('accessibility.mainNavigation')}
        >
          {navigation.slice(0, 5).map((item) =>
            renderNavigationLink(item, 'site-header__nav-link'),
          )}
        </nav>

        <div className="site-header__actions">
          <div
            className="site-header__locale-switcher"
            role="group"
            aria-label={t('accessibility.toggleLanguage')}
          >
            <Globe2 aria-hidden="true" size={14} strokeWidth={1.5} />
            {locales.map((option) => (
              <button
                key={option}
                type="button"
                className="site-header__locale-button"
                aria-pressed={locale === option}
                aria-current={locale === option ? 'true' : undefined}
                onClick={() => setLocale(option)}
                lang={option}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          {contactHref.startsWith('/') ? (
            <Link
              to={contactHref}
              state={getRouteNavigationState(locale)}
              className="site-header__contact-link"
              onClick={closeMenu}
              aria-current={canonicalRouteId === 'contactanos' ? 'page' : undefined}
            >
              {contactContent}
            </Link>
          ) : (
            <a
              href={contactHref}
              className="site-header__contact-link"
              onClick={closeMenu}
            >
              {contactContent}
            </a>
          )}

          <button
            ref={menuButtonRef}
            type="button"
            className="site-header__menu-button lg:hidden"
            aria-controls="bia-mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? t('navigation.closeMenu') : t('navigation.openMenu')}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            {isMenuOpen ? (
              <X aria-hidden="true" size={21} strokeWidth={1.5} />
            ) : (
              <Menu aria-hidden="true" size={21} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          id="bia-mobile-navigation"
          className="site-header__mobile-panel lg:hidden"
          role="dialog"
          aria-modal="false"
          aria-label={t('accessibility.mainNavigation')}
        >
          <div className="site-header__mobile-inner">
            <nav className="site-header__mobile-nav">
              {navigation.map((item) =>
                renderNavigationLink(item, 'site-header__mobile-link', true),
              )}
            </nav>

            <div className="site-header__mobile-locale">
              <span>{t('footer.language')}</span>
              <div className="site-header__locale-switcher">
                {locales.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="site-header__locale-button"
                    aria-pressed={locale === option}
                    aria-current={locale === option ? 'true' : undefined}
                    onClick={() => setLocale(option)}
                    lang={option}
                  >
                    {option.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
