import { ArrowDownRight } from 'lucide-react';
import { biaContent } from '../../content/bia';
import { HOME_SECTION_IDS } from '../../content/home';
import { useI18n } from '../../i18n/I18nProvider';
import Reveal from '../motion/Reveal';
import ParallaxLayer from '../media/ParallaxLayer';
import AbstractMediaSlot from './AbstractMediaSlot';

export default function BrandManifesto() {
  const { locale, t } = useI18n();

  return (
    <section
      id={HOME_SECTION_IDS.story}
      className="home-section home-manifesto"
      aria-labelledby="home-manifesto-title"
    >
      <div className="home-section__inner home-manifesto__inner">
        <Reveal className="home-manifesto__label" duration={0.65} y={18}>
          <p className="home-eyebrow">{t('home.manifesto.eyebrow')}</p>
          <span className="home-section__index">01 / 07</span>
        </Reveal>

        <div className="home-manifesto__copy">
          <Reveal duration={0.8} y={30}>
            <h2 id="home-manifesto-title" className="home-section__title">
              {t('home.manifesto.title')}
            </h2>
          </Reveal>
          <Reveal className="home-manifesto__organization" delay={0.08} duration={0.7} y={20}>
            <p>{biaContent.organization.description[locale]}</p>
          </Reveal>
          <Reveal className="home-manifesto__detail" delay={0.14} duration={0.7} y={18}>
            <p>{t('home.manifesto.detail')}</p>
          </Reveal>
          <Reveal className="home-manifesto__note" delay={0.2} duration={0.7} y={14}>
            <span className="home-manifesto__note-mark" aria-hidden="true" />
            <p>{t('home.manifesto.note')}</p>
          </Reveal>
        </div>

        <Reveal className="home-manifesto__visual" delay={0.12} duration={0.9} y={28}>
          <ParallaxLayer strength={18}>
            <AbstractMediaSlot
              variant="manifesto"
              label={t('home.media.pendingLabel')}
              caption={t('home.media.pendingDescription')}
            >
              <div className="home-manifesto__visual-word" aria-hidden="true">
                {locale === 'en' ? 'ORIGIN' : 'ORIGEN'}
              </div>
              <div className="home-manifesto__visual-bean" aria-hidden="true" />
            </AbstractMediaSlot>
          </ParallaxLayer>
          <div className="home-manifesto__visual-caption" aria-hidden="true">
            <span>01</span>
            <span className="home-manifesto__visual-caption-line" />
            <ArrowDownRight size={16} strokeWidth={1.2} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
