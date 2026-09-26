import { ArrowUpRight, Globe2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { biaContent } from '../../content/bia';
import { getHomeAnchorHref, HOME_SECTION_IDS } from '../../content/home';
import { useI18n } from '../../i18n/I18nProvider';
import {
  getRouteId,
  getRouteNavigationState,
  ROUTE_PATHS,
  type AppRouteId,
} from '../../app/routes';
import type { SecondaryPageId } from '../../content/secondaryPages';
import type { Locale } from '../../types';

export interface SiteFooterProps {
  className?: string;
}

const locales: readonly Locale[] = ['es', 'en'];

const TALENT_ROUTE_IDS: readonly AppRouteId[] = ['talento', 'careers'];

/** Footer pages that are not part of the primary navigation. */
const SECONDARY_DESTINATIONS: readonly {
  id: SecondaryPageId;
  labelKey:
    | 'navigation.nosotros'
    | 'navigation.calidad'
    | 'navigation.contactanos';
  destination: string;
}[] = [
  {
    id: 'nosotros',
    labelKey: 'navigation.nosotros',
    destination: ROUTE_PATHS.nosotros,
  },
  {
    id: 'calidad',
    labelKey: 'navigation.calidad',
    destination: `${ROUTE_PATHS.calidad}#bia-calidad-pilares`,
  },
  {
    id: 'contactanos',
    labelKey: 'navigation.contactanos',
    destination: ROUTE_PATHS.contactanos,
  },
];

export default function SiteFooter({ className = '' }: SiteFooterProps) {
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const routeId = getRouteId(location.pathname);
  const isHomeRoute = routeId === 'home';
  const contactPlaceholder = biaContent.placeholders.find(
    (placeholder) => placeholder.id === 'contact-details',
  );
  const contactLabel = contactPlaceholder?.label[locale] ?? t('footer.contact');
  const homeHref = isHomeRoute ? '#top' : ROUTE_PATHS.home;
  const brandHref = `${ROUTE_PATHS.marcas}#bia-marcas-portafolio`;
  const lockup = (
    <span
      className="bia-lockup bia-lockup--footer"
      data-logo-placeholder="true"
    >
      <span className="bia-lockup__primary">BIA</span>
      <span className="bia-lockup__secondary">HONDURAS / FOODS</span>
    </span>
  );

  return (
    <footer
      id="contact"
      className={`site-footer ${className}`.trim()}
      aria-labelledby="bia-footer-title"
    >
      <div className="site-footer__inner">
        <div className="site-footer__intro">
          {isHomeRoute ? (
            <a
              href={homeHref}
              className="site-footer__brand"
              aria-current="page"
              aria-label={t('navigation.home')}
            >
              {lockup}
            </a>
          ) : (
            <Link
              to={ROUTE_PATHS.home}
              state={getRouteNavigationState(locale)}
              className="site-footer__brand"
              aria-label={t('navigation.home')}
            >
              {lockup}
            </Link>
          )}
          <h2 id="bia-footer-title" className="site-footer__title">
            {t('footer.description')}
          </h2>
          <p className="site-footer__note">{contactLabel}</p>
        </div>

        <div className="site-footer__directory">
          <div className="site-footer__group">
            <h3>{t('footer.company')}</h3>
            <ul>
              {SECONDARY_DESTINATIONS.map((destination) => {
                const [path, hash] = destination.destination.split('#');

                return (
                  <li key={destination.id}>
                    <Link
                      to={hash ? `${path}#${hash}` : path}
                      state={getRouteNavigationState(locale)}
                      aria-current={routeId === destination.id ? 'page' : undefined}
                    >
                      {t(destination.labelKey)}
                    </Link>
                  </li>
                );
              })}
              <li>
                <a href={getHomeAnchorHref(HOME_SECTION_IDS.story, location.pathname)}>
                  {locale === 'en' ? 'Our story' : 'Nuestra historia'}
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__group">
            <h3>{t('footer.brands')}</h3>
            {/*
              Every brand name points at the same brands page, so none of them
              marks itself as the current destination. The Explore group below
              already does that once.
            */}
            <ul>
              {biaContent.brands.map((brand) => (
                <li key={brand.id}>
                  <Link to={brandHref} state={getRouteNavigationState(locale)}>
                    {brand.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div id="careers" className="site-footer__group site-footer__group--action">
            <h3>{t('footer.explore')}</h3>
            <Link
              className="site-footer__action-link"
              to={ROUTE_PATHS.talento}
              state={getRouteNavigationState(locale)}
              aria-current={
                TALENT_ROUTE_IDS.includes(routeId as AppRouteId) ? 'page' : undefined
              }
            >
              <span>{t('footer.careers')}</span>
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
            </Link>
            <Link
              className="site-footer__text-link"
              to={ROUTE_PATHS.marcas}
              state={getRouteNavigationState(locale)}
              aria-current={routeId === 'marcas' ? 'page' : undefined}
            >
              {t('navigation.marcas')}
            </Link>
            {isHomeRoute ? (
              <a
                className="site-footer__text-link"
                href={homeHref}
                aria-current="page"
              >
                {t('navigation.home')}
              </a>
            ) : (
              <Link
                className="site-footer__text-link"
                to={ROUTE_PATHS.home}
                state={getRouteNavigationState(locale)}
              >
                {t('navigation.home')}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>{t('footer.copyright')}</span>
        <div className="site-footer__legal-links" aria-label={t('footer.legal')}>
          <span className="site-footer__legal-placeholder" data-legal-placeholder="true">
            {t('footer.privacy')}
          </span>
          <span className="site-footer__legal-placeholder" data-legal-placeholder="true">
            {t('footer.terms')}
          </span>
        </div>
        <div
          className="site-header__locale-switcher site-footer__locale-switcher"
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
      </div>
    </footer>
  );
}
