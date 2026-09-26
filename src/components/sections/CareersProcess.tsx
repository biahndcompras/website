import { ArrowUpRight, Compass, MessageCircle, Route } from 'lucide-react';
import { Fragment } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import Reveal from '../motion/Reveal';

const processSteps = [
  {
    number: '01',
    titleKey: 'careers.process.step1.title',
    descriptionKey: 'careers.process.step1.description',
    icon: MessageCircle,
  },
  {
    number: '02',
    titleKey: 'careers.process.step2.title',
    descriptionKey: 'careers.process.step2.description',
    icon: Compass,
  },
  {
    number: '03',
    titleKey: 'careers.process.step3.title',
    descriptionKey: 'careers.process.step3.description',
    icon: Route,
  },
] as const;

export default function CareersProcess() {
  const { t } = useI18n();

  return (
    <section
      id="careers-process"
      className="careers-process careers-section careers-section--ivory"
      aria-labelledby="careers-process-title"
    >
      <div className="careers-section__inner">
        <div className="careers-section__heading careers-section__heading--split">
          <Reveal className="careers-section__label" duration={0.65} y={18}>
            <p className="careers-eyebrow">{t('careers.process.eyebrow')}</p>
          </Reveal>
          <Reveal duration={0.75} y={24}>
            <h2
              id="careers-process-title"
              className="careers-section__title"
            >
              {t('careers.process.title')}
            </h2>
            <p className="careers-section__intro">
              {t('careers.process.description')}
            </p>
          </Reveal>
        </div>

        <div className="careers-process__layout">
          <ol className="careers-process__list">
            {processSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Fragment key={step.number}>
                  <Reveal
                    className="careers-process-row"
                    role="listitem"
                    delay={index * 0.08}
                    duration={0.7}
                    y={20}
                  >
                    <span className="careers-process-row__number" aria-hidden="true">
                      {step.number}
                    </span>
                    <div className="careers-process-row__body">
                      <div className="careers-process-row__title-line">
                        <h3>{t(step.titleKey)}</h3>
                        <Icon aria-hidden="true" size={19} strokeWidth={1.35} />
                      </div>
                      <p>{t(step.descriptionKey)}</p>
                    </div>
                  </Reveal>
                </Fragment>
              );
            })}
          </ol>

          <Reveal
            className="careers-process__note"
            delay={0.12}
            duration={0.7}
            y={20}
          >
            <span className="careers-process__note-mark" aria-hidden="true">
              03
            </span>
            <p>{t('careers.process.pending')}</p>
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.4} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
