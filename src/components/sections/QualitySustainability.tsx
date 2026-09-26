import { biaContent } from '../../content/bia';
import { HOME_SECTION_IDS } from '../../content/home';
import { useI18n } from '../../i18n/I18nProvider';
import Reveal from '../motion/Reveal';
import AbstractMediaSlot from './AbstractMediaSlot';

const propositionDescriptionKeys = [
  'home.quality.localProducerDescription',
  'home.quality.foodSafetyDescription',
  'home.quality.cultureDescription',
] as const;

export default function QualitySustainability() {
  const { locale, t } = useI18n();
  const qualityWords = locale === 'en' ? ['SAFE', 'LOCAL', 'TOGETHER'] : ['CALIDAD', 'LOCAL', 'JUNTOS'];

  return (
    <section
      id={HOME_SECTION_IDS.quality}
      className="home-section home-quality"
      aria-labelledby="home-quality-title"
    >
      <div className="home-section__inner home-quality__inner">
        <div className="home-quality__intro">
          <Reveal duration={0.7} y={20}>
            <p className="home-eyebrow home-eyebrow--light">{t('home.quality.eyebrow')}</p>
            <h2 id="home-quality-title" className="home-section__title home-section__title--light">
              {t('home.quality.title')}
            </h2>
            <p className="home-section__intro home-section__intro--light">
              {t('home.quality.description')}
            </p>
          </Reveal>
          <Reveal className="home-quality__note" delay={0.16} duration={0.7} y={16}>
            <span className="home-quality__note-line" aria-hidden="true" />
            <p>{t('home.quality.note')}</p>
          </Reveal>
        </div>

        <Reveal className="home-quality__visual" delay={0.14} duration={0.9} y={24}>
          <AbstractMediaSlot
            variant="quality"
            label={t('home.media.pendingLabel')}
            caption={t('home.media.pendingDescription')}
          >
            <div className="home-quality__visual-seal" aria-hidden="true">
              {qualityWords.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
            <span className="home-quality__visual-word" aria-hidden="true">
              {locale === 'en' ? 'VALUE' : 'VALOR'}
            </span>
          </AbstractMediaSlot>
        </Reveal>

        <ol className="home-quality__list" aria-label={t('home.quality.title')}>
          {biaContent.valuePropositions.map((proposition, index) => (
            <li className="home-quality__item" key={proposition.id}>
              <Reveal className="home-quality__item-inner" delay={index * 0.08} duration={0.68} y={18}>
                <span className="home-quality__item-number">0{index + 1}</span>
                <div>
                  <h3>{proposition.title[locale]}</h3>
                  <p>{t(propositionDescriptionKeys[index])}</p>
                </div>
                <span className="home-quality__item-mark" aria-hidden="true" />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
