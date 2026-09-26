import { HOME_SECTION_IDS } from '../../content/home';
import { useI18n } from '../../i18n/I18nProvider';
import Reveal from '../motion/Reveal';
import ProcessCinematicStage from './ProcessCinematicStage';

export default function FromSeedToCup() {
  const { locale, t } = useI18n();

  return (
    <section
      id={HOME_SECTION_IDS.process}
      className="home-section home-process"
      aria-labelledby="home-process-title"
    >
      <div className="home-section__inner home-process__inner">
        <div className="home-process__header">
          <Reveal duration={0.7} y={20}>
            <p className="home-eyebrow">{t('home.process.eyebrow')}</p>
            <h2 id="home-process-title" className="home-section__title">
              {t('home.process.title')}
            </h2>
          </Reveal>
          <Reveal
            className="home-process__detail"
            delay={0.1}
            duration={0.72}
            y={18}
          >
            <p>{t('home.process.description')}</p>
            <p>{t('home.process.detail')}</p>
          </Reveal>
        </div>

        <ProcessCinematicStage
          locale={locale}
          trailLabel={t('home.process.trail')}
          visualLabel={t('home.process.visual')}
          mediaCaption={t('home.media.pendingDescription')}
        />
      </div>
    </section>
  );
}
