import { Link } from 'react-router-dom';
import {
  getRouteNavigationState,
  ROUTE_PATHS,
} from '../app/routes';
import {
  resolveHeroPosterSource,
  resolveHeroVideoSource,
} from './media/heroMedia';
import ScrollVideoHero from './media/ScrollVideoHero';
import Reveal from './motion/Reveal';
import { useI18n } from '../i18n/I18nProvider';

export default function Hero() {
  const { locale, t } = useI18n();
  const environment = (
    import.meta as ImportMeta & {
      env?: Record<string, string | undefined>;
    }
  ).env;
  const videoSrc = resolveHeroVideoSource(environment?.VITE_BIA_HERO_VIDEO_URL);
  const posterSrc = resolveHeroPosterSource(
    environment?.VITE_BIA_HERO_POSTER_URL,
  );

  return (
    <div id="bia-hero" className="home-hero">
      <ScrollVideoHero
        videoSrc={videoSrc}
        posterSrc={posterSrc}
        eyebrow={t('home.hero.eyebrow')}
        title={t('home.hero.title')}
        description={t('home.hero.description')}
        scrollCue={t('home.hero.scroll')}
        videoAriaLabel={t('accessibility.heroVideo')}
      >
        {({ isReducedMotion }) => (
          <Reveal
            delay={isReducedMotion ? 0 : 0.18}
            duration={0.7}
            y={18}
            className="home-hero__actions"
          >
            <a
              href="#bia-story"
              className="home-hero__cta home-hero__cta--solid"
            >
              <span>{t('common.cta.exploreStory')}</span>
              <span className="home-hero__cta-line" aria-hidden="true" />
            </a>
            <Link
              to={ROUTE_PATHS.talento}
              state={getRouteNavigationState(locale)}
              className="home-hero__cta home-hero__cta--outline"
            >
              <span>{t('common.cta.joinBia')}</span>
              <span className="home-hero__cta-line" aria-hidden="true" />
            </Link>
          </Reveal>
        )}
      </ScrollVideoHero>
    </div>
  );
}
