import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Fragment } from 'react';
import { ROUTE_PATHS } from '../app/routes';
import {
  getSecondaryPage,
  getSecondarySectionCopy,
  HISTORY_PERIOD_PENDING,
  historyMoments,
  secondaryIdentityNotes,
  secondaryValues,
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

const pageId = 'nosotros';

export default function NosotrosPage() {
  const { locale, t } = useI18n();
  const page = getSecondaryPage(pageId);
  const [identity, history, values] = getSecondarySectionCopy(pageId);

  return (
    <SecondaryPage pageId={pageId}>
      <SecondaryHero
        pageId={pageId}
        visual={<SecondaryMark label={locale === 'en' ? 'HONDURAS' : 'HONDURAS'} index="01 / 03" tone="light" />}
        actions={
          <>
            <a className="secondary-link secondary-link--light" href="#bia-nosotros-historia">
              <span>{t('common.cta.learnMore')}</span>
              <ArrowDown aria-hidden="true" size={17} strokeWidth={1.5} />
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
        aside={
          <Reveal delay={0.16} duration={0.7} y={16} className="secondary-hero__aside">
            <p className="secondary-hero__aside-title">
              {locale === 'en' ? 'IN THIS PAGE' : 'EN ESTA PÁGINA'}
            </p>
            <ul className="secondary-hero__aside-list">
              <li>{identity.eyebrow[locale]}</li>
              <li>{history.eyebrow[locale]}</li>
              <li>{values.eyebrow[locale]}</li>
            </ul>
          </Reveal>
        }
      />

      <SecondarySection
        id={identity.id}
        eyebrow={identity.eyebrow}
        title={identity.title}
        description={identity.description}
        tone="soft"
        media={
          <SecondaryMark
            label={locale === 'en' ? 'FROM HONDURAS' : 'DESDE HONDURAS'}
            index="02 / 03"
          />
        }
        mediaLabel={locale === 'en' ? 'COFFEE ORIGIN' : 'ORIGEN DEL CAFÉ'}
      >
        <ol className="secondary-list">
          {secondaryIdentityNotes.map((note, index) => (
            <Fragment key={note.id}>
              <SecondaryRow
                number={String(index + 1).padStart(2, '0')}
                title={note.title[locale]}
                description={note.description[locale]}
                meta={<SecondaryPendingNote>{note.pending}</SecondaryPendingNote>}
              />
            </Fragment>
          ))}
        </ol>
      </SecondarySection>

      <section
        id={history.id}
        className="secondary-section secondary-section--ivory"
        aria-labelledby="bia-nosotros-historia-title"
      >
        <div className="secondary-section__inner">
          <Reveal duration={0.6} y={16}>
            <p className="secondary-eyebrow">{history.eyebrow[locale]}</p>
          </Reveal>
          <Reveal delay={0.05} duration={0.7} y={22}>
            <h2 id="bia-nosotros-historia-title" className="secondary-section__title">
              {history.title[locale]}
            </h2>
            {history.description ? (
              <p className="secondary-section__description">{history.description[locale]}</p>
            ) : null}
          </Reveal>

          <ol className="secondary-timeline">
            {historyMoments.map((moment) => (
              <Fragment key={moment.id}>
                <Reveal className="secondary-timeline__item" duration={0.65} y={18}>
                  <p className="secondary-timeline__period">
                    {moment.period ?? HISTORY_PERIOD_PENDING[locale]}
                  </p>
                  <div className="secondary-timeline__body">
                    <h3 className="secondary-timeline__title">{moment.title[locale]}</h3>
                    <p className="secondary-timeline__description">
                      {moment.description[locale]}
                    </p>
                    <SecondaryPendingNote>{moment.pending}</SecondaryPendingNote>
                  </div>
                </Reveal>
              </Fragment>
            ))}
          </ol>
        </div>
      </section>

      <section
        id={values.id}
        className="secondary-section secondary-section--navy"
        aria-labelledby="bia-nosotros-valores-title"
      >
        <div className="secondary-section__inner">
          <Reveal duration={0.6} y={16}>
            <p className="secondary-eyebrow secondary-eyebrow--light">
              {values.eyebrow[locale]}
            </p>
          </Reveal>
          <Reveal delay={0.05} duration={0.7} y={22}>
            <h2 id="bia-nosotros-valores-title" className="secondary-section__title">
              {values.title[locale]}
            </h2>
            {values.description ? (
              <p className="secondary-section__description secondary-section__description--light">
                {values.description[locale]}
              </p>
            ) : null}
          </Reveal>

          <ol className="secondary-list secondary-list--light">
            {secondaryValues.map((value, index) => (
              <Fragment key={value.id}>
                <SecondaryRow
                  className="secondary-row--light"
                  number={String(index + 1).padStart(2, '0')}
                  title={value.title[locale]}
                  description={value.description[locale]}
                  meta={
                    <SecondaryPendingNote tone="light" className="secondary-pending--inline">
                      {value.pending}
                    </SecondaryPendingNote>
                  }
                />
              </Fragment>
            ))}
          </ol>
        </div>
      </section>

      <SecondaryCrossLinks
        headingId="bia-nosotros-seguir-title"
        heading={locale === 'en' ? 'KEEP EXPLORING' : 'SIGUE EXPLORANDO'}
        targets={[
          { id: 'marcas', label: t('navigation.marcas') },
          { id: 'calidad', label: t('navigation.calidad') },
          { id: 'talento', label: t('navigation.talento') },
        ]}
      />

      <SecondaryCta
        eyebrow={page.eyebrow}
        title={{ es: 'Hablemos de BIA Honduras.', en: 'Let’s talk about BIA Honduras.' }}
        description={{
          es: 'Cuéntanos qué necesitas y te dirigimos a la ruta correcta.',
          en: 'Tell us what you need and we will point you to the right route.',
        }}
        links={[
          { href: ROUTE_PATHS.contactanos, label: t('navigation.contactanos') },
          { href: ROUTE_PATHS.talento, label: t('navigation.talento') },
        ]}
      />
    </SecondaryPage>
  );
}
