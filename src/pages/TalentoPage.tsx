import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { Fragment } from 'react';
import { getRouteNavigationState, ROUTE_PATHS } from '../app/routes';
import { biaContent } from '../content/bia';
import { talentAreas, talentOpenings } from '../content/secondaryPages';
import { useI18n } from '../i18n/I18nProvider';
import CareersAreas from '../components/sections/CareersAreas';
import CareersHero from '../components/sections/CareersHero';
import CareersProcess from '../components/sections/CareersProcess';
import CareersValues from '../components/sections/CareersValues';
import Reveal from '../components/motion/Reveal';
import {
  SecondaryCrossLinks,
  SecondaryPage,
  SecondaryPageLink,
} from '../components/layout/SecondaryPageShell';

const pageId = 'talento';

const faqItems = [
  {
    questionKey: 'careers.faq.openingsQuestion',
    answerKey: 'careers.faq.openingsAnswer',
  },
  {
    questionKey: 'careers.faq.languageQuestion',
    answerKey: 'careers.faq.languageAnswer',
  },
  {
    questionKey: 'careers.faq.updatesQuestion',
    answerKey: 'careers.faq.updatesAnswer',
  },
] as const;

export default function TalentoPage() {
  const { locale, t } = useI18n();

  return (
    <SecondaryPage pageId={pageId} className="careers-page">
      <CareersHero />
      <CareersValues valuePropositions={biaContent.valuePropositions} />
      <CareersAreas areas={talentAreas} />
      <CareersProcess />

      <section
        id="careers-openings"
        className="careers-openings careers-section careers-section--ivory"
        aria-labelledby="careers-openings-title"
      >
        <div className="careers-section__inner careers-openings__inner">
          <Reveal className="careers-openings__label" duration={0.65} y={18}>
            <p className="careers-eyebrow">{t('careers.openings.title')}</p>
          </Reveal>
          <Reveal className="careers-openings__body" duration={0.75} y={24}>
            <div>
              <h2 id="careers-openings-title" className="careers-section__title">
                {talentOpenings.headline[locale]}
              </h2>
              <p className="careers-openings__coming-soon">
                {talentOpenings.note[locale]}
              </p>
            </div>
            <div className="careers-openings__status" role="status">
              <span className="careers-openings__status-dot" aria-hidden="true" />
              <span>{t('careers.openings.description')}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="careers-faq"
        className="careers-faq careers-section careers-section--blue"
        aria-labelledby="careers-faq-title"
      >
        <div className="careers-section__inner careers-faq__inner">
          <Reveal className="careers-faq__intro" duration={0.7} y={22}>
            <p className="careers-eyebrow">{t('careers.faq.eyebrow')}</p>
            <h2 id="careers-faq-title" className="careers-section__title">
              {t('careers.faq.title')}
            </h2>
          </Reveal>
          <div className="careers-faq__list">
            {faqItems.map((item, index) => (
              <Fragment key={item.questionKey}>
                <Reveal
                  className="careers-faq__item"
                  delay={index * 0.06}
                  duration={0.65}
                  y={18}
                >
                  <details>
                    <summary>
                      <span>{t(item.questionKey)}</span>
                      <ChevronDown aria-hidden="true" size={18} strokeWidth={1.4} />
                    </summary>
                    <p>{t(item.answerKey)}</p>
                  </details>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <section
        id="careers-cta"
        className="careers-cta careers-section"
        aria-labelledby="careers-cta-title"
      >
        <div className="careers-section__inner careers-cta__inner">
          <Reveal duration={0.7} y={22}>
            <p className="careers-eyebrow careers-eyebrow--light">
              {t('careers.hero.eyebrow')}
            </p>
            <h2 id="careers-cta-title" className="careers-section__title careers-section__title--light">
              {t('careers.cta.title')}
            </h2>
            <p className="careers-section__intro careers-section__intro--light">
              {t('careers.cta.description')}
            </p>
          </Reveal>
          <Reveal delay={0.1} duration={0.7} y={20}>
            <SecondaryPageLink
              href={ROUTE_PATHS.contactanos}
              className="careers-link careers-link--light"
            >
              <span>{t('common.cta.contact')}</span>
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </SecondaryPageLink>
          </Reveal>
        </div>
      </section>

      <SecondaryCrossLinks
        headingId="bia-talento-seguir-title"
        heading={locale === 'en' ? 'KEEP EXPLORING' : 'SIGUE EXPLORANDO'}
        targets={[
          { id: 'nosotros', label: t('navigation.nosotros') },
          { id: 'calidad', label: t('navigation.calidad') },
          { id: 'contactanos', label: t('navigation.contactanos') },
        ]}
      />
    </SecondaryPage>
  );
}
