import { Fragment } from 'react';
import { biaContent } from '../../content/bia';
import { HOME_SECTION_IDS } from '../../content/home';
import { useI18n } from '../../i18n/I18nProvider';
import ParallaxLayer from '../media/ParallaxLayer';
import Reveal from '../motion/Reveal';
import AbstractMediaSlot from './AbstractMediaSlot';

function OriginContour() {
  return (
    <svg
      className="home-origin__contour"
      viewBox="0 0 720 540"
      aria-hidden="true"
    >
      <path d="M-24 398C70 338 112 364 176 315c69-52 84-142 165-168 73-24 96 70 167 35 77-38 112-131 236-108" />
      <path d="M-32 438c94-60 136-36 200-85 69-52 84-142 165-168 73-24 96 70 167 35 77-38 112-131 236-108" />
      <path d="M-32 478c94-60 136-36 200-85 69-52 84-142 165-168 73-24 96 70 167 35 77-38 112-131 236-108" />
      <path d="M-24 518c94-60 136-36 200-85 69-52 84-142 165-168 73-24 96 70 167 35 77-38 112-131 236-108" />
      <circle cx="178" cy="315" r="5" />
      <circle cx="342" cy="147" r="5" />
      <circle cx="508" cy="182" r="5" />
    </svg>
  );
}

export default function OriginStory() {
  const { locale, t } = useI18n();

  return (
    <section
      id={HOME_SECTION_IDS.origin}
      className="home-section home-origin"
      aria-labelledby="home-origin-title"
    >
      <div className="home-section__inner home-origin__inner">
        <Reveal className="home-origin__intro" duration={0.7} y={22}>
          <p className="home-eyebrow">{t('home.origin.eyebrow')}</p>
          <h2 id="home-origin-title" className="home-section__title">
            {t('home.origin.title')}
          </h2>
          <p className="home-section__intro">{t('home.origin.description')}</p>
          <p className="home-origin__detail">{t('home.origin.detail')}</p>
        </Reveal>

        <Reveal className="home-origin__visual" delay={0.12} duration={0.9} y={28}>
          <ParallaxLayer strength={16}>
            <AbstractMediaSlot
              variant="origin"
              label={t('home.origin.replaceMedia')}
              caption={t('home.media.pendingDescription')}
            >
              <OriginContour />
              <span className="home-origin__visual-stamp" aria-hidden="true">
                HND
              </span>
            </AbstractMediaSlot>
          </ParallaxLayer>
        </Reveal>

        <div className="home-origin__regions" aria-label={t('home.origin.regions')}>
          <Reveal className="home-origin__regions-label" duration={0.65} y={16}>
            <span>{t('home.origin.regions')}</span>
            <span className="home-origin__regions-line" aria-hidden="true" />
          </Reveal>
          <div className="home-origin__region-list">
            {biaContent.originRegions.map((region, index) => (
              <Fragment key={region.id}>
                <Reveal
                  className="home-origin__region"
                  delay={index * 0.08}
                  duration={0.65}
                  y={16}
                >
                  <span className="home-origin__region-number">0{index + 1}</span>
                  <h3>{region.name[locale]}</h3>
                  <p>{region.description[locale]}</p>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
