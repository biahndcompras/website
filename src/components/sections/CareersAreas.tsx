import { ArrowUpRight } from 'lucide-react';
import { Fragment } from 'react';
import type { TalentArea } from '../../content/secondaryPages';
import { useI18n } from '../../i18n/I18nProvider';
import { SecondaryPendingNote } from '../layout/SecondaryPageShell';
import Reveal from '../motion/Reveal';

export interface CareersAreasProps {
  areas: readonly TalentArea[];
}

export default function CareersAreas({ areas }: CareersAreasProps) {
  const { locale, t } = useI18n();

  return (
    <section
      id="careers-areas"
      className="careers-areas careers-section careers-section--navy"
      aria-labelledby="careers-areas-title"
    >
      <div className="careers-section__inner">
        <div className="careers-section__heading careers-areas__heading">
          <Reveal className="careers-section__label" duration={0.65} y={18}>
            <p className="careers-eyebrow careers-eyebrow--light">
              {t('careers.areas.eyebrow')}
            </p>
          </Reveal>
          <Reveal duration={0.75} y={24}>
            <h2
              id="careers-areas-title"
              className="careers-section__title careers-section__title--light"
            >
              {t('careers.areas.title')}
            </h2>
            <p className="careers-section__intro careers-section__intro--light">
              {t('careers.areas.description')}
            </p>
            <p className="careers-areas__note">
              {t('careers.areas.roleFamilyNote')}
            </p>
          </Reveal>
        </div>

        <ol className="careers-areas__list">
          {areas.map((area, index) => (
            <Fragment key={area.id}>
              <Reveal
                className="careers-area-row"
                role="listitem"
                delay={index * 0.06}
                duration={0.7}
                y={20}
              >
                <span className="careers-area-row__number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="careers-area-row__body">
                  <h3>{area.title[locale]}</h3>
                  <p>{area.description[locale]}</p>
                  <SecondaryPendingNote tone="light" className="secondary-pending--inline">
                    {area.pending}
                  </SecondaryPendingNote>
                </div>
                <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.4} />
              </Reveal>
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  );
}
