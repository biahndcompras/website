import { biaContent } from '../../content/bia';
import { HOME_SECTION_IDS } from '../../content/home';
import { useI18n } from '../../i18n/I18nProvider';
import Reveal from '../motion/Reveal';

const hubMarks = ['C', 'U', 'S', 'P'] as const;

export default function HubsSection() {
  const { locale, t } = useI18n();

  return (
    <section
      id={HOME_SECTION_IDS.hubs}
      className="home-section home-hubs"
      aria-labelledby="home-hubs-title"
    >
      <div className="home-section__inner home-hubs__inner">
        <div className="home-hubs__intro">
          <Reveal duration={0.65} y={18}>
            <p className="home-eyebrow">{t('home.hubs.eyebrow')}</p>
            <h2 id="home-hubs-title" className="home-section__title home-section__title--light">
              {t('home.hubs.title')}
            </h2>
          </Reveal>
          <Reveal className="home-hubs__detail" delay={0.1} duration={0.75} y={20}>
            <p>{t('home.hubs.detail')}</p>
          </Reveal>
          <Reveal className="home-hubs__rail" delay={0.18} duration={0.7} y={14}>
            <span className="home-hubs__rail-line" aria-hidden="true" />
            <p>{t('home.hubs.rail')}</p>
          </Reveal>
        </div>

        <ol className="home-hubs__list" aria-label={t('home.hubs.title')}>
          {biaContent.hubs.map((hub, index) => (
            <li className={`home-hub home-hub--${index + 1}`} key={hub.id} data-hub-id={hub.id}>
              <Reveal className="home-hub__reveal" delay={index * 0.07} duration={0.7} y={18}>
                <span className="home-hub__number">0{index + 1}</span>
                <div className="home-hub__body">
                  <h3>{hub.name[locale]}</h3>
                  <p>{hub.description[locale]}</p>
                </div>
                <span className="home-hub__mark" aria-hidden="true">
                  {hubMarks[index]}
                </span>
                <span className="home-hub__rule" aria-hidden="true" />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
