import { ArrowUpRight } from 'lucide-react';
import { Fragment } from 'react';
import { ROUTE_PATHS } from '../app/routes';
import { biaContent } from '../content/bia';
import {
  getSecondaryPage,
  getSecondarySectionCopy,
  qualityPillars,
} from '../content/secondaryPages';
import { useI18n } from '../i18n/I18nProvider';
import Reveal from '../components/motion/Reveal';
import {
  SecondaryCrossLinks,
  SecondaryCta,
  SecondaryHero,
  SecondaryMark,
  SecondaryPage,
  SecondaryPageLink,
  SecondaryPendingNote,
  SecondaryRow,
  SecondarySection,
} from '../components/layout/SecondaryPageShell';

const pageId = 'calidad';

export default function CalidadPage() {
  const { locale, t } = useI18n();
  const page = getSecondaryPage(pageId);
  const [pillars, territory] = getSecondarySectionCopy(pageId);

  return (
    <SecondaryPage pageId={pageId}>
      <SecondaryHero
        pageId={pageId}
        visual={<SecondaryMark label={locale === 'en' ? 'CARE' : 'CUIDAR'} index="01 / 02" tone="light" />}
        actions={
          <>
            <a className="secondary-link secondary-link--light" href="#bia-calidad-pilares">
              <span>{t('common.cta.learnMore')}</span>
              <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
            </a>
            <SecondaryPageLink
              href={ROUTE_PATHS.contactanos}
              className="secondary-link secondary-link--ghost-light"
            >
              <span>{t('common.cta.contact')}</span>
              <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
            </SecondaryPageLink>
          </>
        }
      />

      <section
        id={pillars.id}
        className="secondary-section secondary-section--navy"
        aria-labelledby="bia-calidad-pilares-title"
      >
        <div className="secondary-section__inner">
          <Reveal duration={0.6} y={16}>
            <p className="secondary-eyebrow secondary-eyebrow--light">
              {pillars.eyebrow[locale]}
            </p>
          </Reveal>
          <Reveal delay={0.05} duration={0.7} y={22}>
            <h2 id="bia-calidad-pilares-title" className="secondary-section__title">
              {pillars.title[locale]}
            </h2>
            {pillars.description ? (
              <p className="secondary-section__description secondary-section__description--light">
                {pillars.description[locale]}
              </p>
            ) : null}
          </Reveal>

          <ol className="secondary-list secondary-list--light">
            {qualityPillars.map((pillar, index) => (
              <Fragment key={pillar.id}>
                <SecondaryRow
                  className="secondary-row--light"
                  number={String(index + 1).padStart(2, '0')}
                  title={pillar.title[locale]}
                  description={pillar.description[locale]}
                  meta={
                    pillar.pending ? (
                      <SecondaryPendingNote tone="light" className="secondary-pending--inline">
                        {pillar.pending}
                      </SecondaryPendingNote>
                    ) : null
                  }
                />
              </Fragment>
            ))}
          </ol>
        </div>
      </section>

      <SecondarySection
        id={territory.id}
        eyebrow={territory.eyebrow}
        title={territory.title}
        description={territory.description}
        tone="soft"
        media={
          <SecondaryMark
            label={locale === 'en' ? 'HONDURAS' : 'HONDURAS'}
            index="02 / 02"
          />
        }
        mediaLabel={locale === 'en' ? 'THREE ORIGINS' : 'TRES ORÍGENES'}
      >
        <div className="secondary-list" role="list">
          {biaContent.originRegions.map((region, index) => (
            <Fragment key={region.id}>
              <SecondaryRow
                number={String(index + 1).padStart(2, '0')}
                title={region.name[locale]}
                description={region.description[locale]}
              />
            </Fragment>
          ))}
        </div>
      </SecondarySection>

      <SecondaryCrossLinks
        headingId="bia-calidad-seguir-title"
        heading={locale === 'en' ? 'KEEP EXPLORING' : 'SIGUE EXPLORANDO'}
        targets={[
          { id: 'nosotros', label: t('navigation.nosotros') },
          { id: 'marcas', label: t('navigation.marcas') },
          { id: 'talento', label: t('navigation.talento') },
        ]}
      />

      <SecondaryCta
        eyebrow={page.eyebrow}
        title={{
          es: 'Trabajemos con calidad.',
          en: 'Let’s work with quality.',
        }}
        description={{
          es: 'Cuéntanos qué necesitas y te dirigimos a la ruta correcta.',
          en: 'Tell us what you need and we will point you to the right route.',
        }}
        links={[
          { href: ROUTE_PATHS.contactanos, label: t('navigation.contactanos') },
          { href: ROUTE_PATHS.nosotros, label: t('navigation.nosotros') },
        ]}
      />
    </SecondaryPage>
  );
}
