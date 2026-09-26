import { ArrowUpRight } from 'lucide-react';
import { Fragment } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import type { ValueProposition } from '../../types';
import Reveal from '../motion/Reveal';

export interface CareersValuesProps {
  valuePropositions: ValueProposition[];
}

export default function CareersValues({
  valuePropositions,
}: CareersValuesProps) {
  const { locale, t } = useI18n();

  return (
    <>
      <section
        id="careers-life"
        className="careers-life careers-section"
        aria-labelledby="careers-life-title"
      >
        <div className="careers-section__inner careers-life__inner">
          <Reveal className="careers-section__label" duration={0.65} y={18}>
            <p className="careers-eyebrow">{t('careers.life.eyebrow')}</p>
          </Reveal>
          <div className="careers-life__content">
            <Reveal duration={0.75} y={26}>
              <h2 id="careers-life-title" className="careers-section__title">
                {t('careers.life.title')}
              </h2>
            </Reveal>
            <Reveal delay={0.08} duration={0.75} y={24}>
              <p className="careers-section__intro">{t('careers.life.description')}</p>
              <p className="careers-section__detail">{t('careers.life.detail')}</p>
            </Reveal>
          </div>
        </div>
        <div className="careers-life__rule" aria-hidden="true" />
      </section>

      <section
        id="careers-values"
        className="careers-values careers-section careers-section--ivory"
        aria-labelledby="careers-values-title"
      >
        <div className="careers-section__inner">
          <div className="careers-section__heading careers-section__heading--split">
            <Reveal className="careers-section__label" duration={0.65} y={18}>
              <p className="careers-eyebrow">{t('careers.values.eyebrow')}</p>
            </Reveal>
            <Reveal duration={0.75} y={24}>
              <h2 id="careers-values-title" className="careers-section__title">
                {t('careers.values.title')}
              </h2>
              <p className="careers-section__intro">{t('careers.values.description')}</p>
            </Reveal>
          </div>

          <div className="careers-values__list" role="list">
            {valuePropositions.map((value, index) => (
              <Fragment key={value.id}>
                <Reveal
                  className="careers-value-row"
                  role="listitem"
                  delay={index * 0.06}
                  duration={0.7}
                  y={20}
                >
                  <span className="careers-value-row__number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="careers-value-row__body">
                    <h3>{value.title[locale]}</h3>
                    {/* Each row carries its own description, not one shared line. */}
                    <p>{value.description[locale]}</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.4} />
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
