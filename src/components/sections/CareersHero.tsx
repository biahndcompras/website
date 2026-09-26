import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getRouteNavigationState,
  ROUTE_PATHS,
} from '../../app/routes';
import { useI18n } from '../../i18n/I18nProvider';
import ParallaxLayer from '../media/ParallaxLayer';
import Reveal from '../motion/Reveal';

export default function CareersHero() {
  const { locale, t } = useI18n();

  return (
    <section
      id="careers-hero"
      className="careers-hero"
      aria-labelledby="careers-hero-title"
    >
      <div className="careers-hero__inner">
        <div className="careers-hero__copy">
          <Reveal duration={0.7} y={24}>
            <p className="careers-eyebrow careers-eyebrow--light">
              {t('careers.hero.eyebrow')}
            </p>
            <h1 id="careers-hero-title" className="careers-hero__title">
              {t('careers.hero.title')}
            </h1>
            <p className="careers-hero__description">
              {t('careers.hero.description')}
            </p>
            <div className="careers-hero__actions">
              <a
                className="careers-link careers-link--light"
                href="#careers-openings"
              >
                <span>{t('common.cta.viewOpportunities')}</span>
                <ArrowDown aria-hidden="true" size={17} strokeWidth={1.5} />
              </a>
              <Link
                className="careers-link careers-link--ghost-light"
                to={ROUTE_PATHS.home}
                state={getRouteNavigationState(locale)}
              >
                <span>{t('common.cta.exploreStory')}</span>
                <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
              </Link>
            </div>
            <p className="careers-hero__note">{t('careers.hero.note')}</p>
          </Reveal>
        </div>

        <ParallaxLayer className="careers-hero__art-wrap" strength={18}>
          <div className="careers-hero__art" aria-hidden="true">
            <div className="careers-hero__art-grid" />
            <div className="careers-hero__art-orbit careers-hero__art-orbit--one" />
            <div className="careers-hero__art-orbit careers-hero__art-orbit--two" />
            <div className="careers-hero__art-core">BIA</div>
            <div className="careers-hero__art-caption">
              <span>{locale === 'en' ? 'FROM HONDURAS' : 'DESDE HONDURAS'}</span>
              <span>{locale === 'en' ? 'WITH PURPOSE' : 'CON PROPÓSITO'}</span>
            </div>
            <span className="careers-hero__art-index">01 / 04</span>
          </div>
        </ParallaxLayer>
      </div>

      <div className="careers-hero__scroll-cue" aria-hidden="true">
        <span>{t('careers.life.eyebrow')}</span>
        <span className="careers-hero__scroll-line" />
      </div>
    </section>
  );
}
