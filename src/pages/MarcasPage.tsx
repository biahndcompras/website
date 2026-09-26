import { ArrowUpRight } from 'lucide-react';
import { Fragment } from 'react';
import { ROUTE_PATHS } from '../app/routes';
import {
  getSecondaryPage,
  getSecondarySectionCopy,
  SECONDARY_BRAND_ENTRIES,
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
  SecondarySection,
} from '../components/layout/SecondaryPageShell';

const pageId = 'marcas';

const brandMonograms: Record<string, string> = {
  'el-indio': 'EI',
  'cafe-maya': 'CM',
  'oro-puro': 'OP',
  'medalla': 'MD',
};

export default function MarcasPage() {
  const { locale, t } = useI18n();
  const page = getSecondaryPage(pageId);
  const [family, portfolio] = getSecondarySectionCopy(pageId);

  return (
    <SecondaryPage pageId={pageId}>
      <SecondaryHero
        pageId={pageId}
        visual={<SecondaryMark label="BIA" index="01 / 02" tone="light" />}
        actions={
          <>
            <a className="secondary-link secondary-link--light" href="#bia-marcas-portafolio">
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

      <SecondarySection
        id={family.id}
        eyebrow={family.eyebrow}
        title={family.title}
        description={family.description}
        tone="soft"
        media={
          <SecondaryMark
            label={locale === 'en' ? 'ONE FAMILY' : 'UNA FAMILIA'}
            index="02 / 02"
          />
        }
        mediaLabel={locale === 'en' ? 'FROM COFFEE TO THE TABLE' : 'DEL CAFÉ A LA MESA'}
      />

      <section
        id={portfolio.id}
        className="secondary-section secondary-section--ivory"
        aria-labelledby="bia-marcas-portafolio-title"
      >
        <div className="secondary-section__inner">
          <Reveal duration={0.6} y={16}>
            <p className="secondary-eyebrow">{portfolio.eyebrow[locale]}</p>
          </Reveal>
          <Reveal delay={0.05} duration={0.7} y={22}>
            <h2 id="bia-marcas-portafolio-title" className="secondary-section__title">
              {portfolio.title[locale]}
            </h2>
            {portfolio.description ? (
              <p className="secondary-section__description">
                {portfolio.description[locale]}
              </p>
            ) : null}
          </Reveal>

          <div className="secondary-list" role="list">
            {SECONDARY_BRAND_ENTRIES.map((brand, index) => (
              <Fragment key={brand.id}>
                <Reveal className="secondary-brand" role="listitem" duration={0.65} y={18}>
                  <div className="secondary-brand__body">
                    <p className="secondary-brand__category">
                      {String(index + 1).padStart(2, '0')} · {brand.category[locale]}
                    </p>
                    <h3 className="secondary-brand__name">{brand.name[locale]}</h3>
                    <p className="secondary-brand__description">
                      {brand.description[locale]}
                    </p>
                    <SecondaryPendingNote>{brand.pending}</SecondaryPendingNote>
                  </div>
                  <div className="secondary-brand__visual">
                    <SecondaryMark
                      label={brandMonograms[brand.id] ?? 'BIA'}
                      index={`${String(index + 1).padStart(2, '0')} / 04`}
                    />
                  </div>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <SecondaryCrossLinks
        headingId="bia-marcas-seguir-title"
        heading={locale === 'en' ? 'KEEP EXPLORING' : 'SIGUE EXPLORANDO'}
        targets={[
          { id: 'calidad', label: t('navigation.calidad') },
          { id: 'nosotros', label: t('navigation.nosotros') },
          { id: 'contactanos', label: t('navigation.contactanos') },
        ]}
      />

      <SecondaryCta
        eyebrow={page.eyebrow}
        title={{
          es: '¿Quieres trabajar con nuestras marcas?',
          en: 'Want to work with our brands?',
        }}
        description={{
          es: 'Cuéntanos tu proyecto y te dirigimos a la ruta correcta.',
          en: 'Tell us about your project and we will point you to the right route.',
        }}
        links={[
          { href: ROUTE_PATHS.contactanos, label: t('navigation.contactanos') },
          { href: ROUTE_PATHS.calidad, label: t('navigation.calidad') },
        ]}
      />
    </SecondaryPage>
  );
}
