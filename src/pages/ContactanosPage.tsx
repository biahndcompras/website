import { ArrowUpRight } from 'lucide-react';
import { Fragment } from 'react';
import { ROUTE_PATHS } from '../app/routes';
import {
  contactAudiences,
  contactChannels,
  getSecondaryPage,
  getSecondarySectionCopy,
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

const pageId = 'contactanos';

export default function ContactanosPage() {
  const { locale, t } = useI18n();
  const page = getSecondaryPage(pageId);
  const [audiences] = getSecondarySectionCopy(pageId);

  return (
    <SecondaryPage pageId={pageId}>
      <SecondaryHero
        pageId={pageId}
        visual={<SecondaryMark label={locale === 'en' ? 'TALK' : 'HABLAR'} index="01 / 01" tone="light" />}
        actions={
          <a className="secondary-link secondary-link--light" href="#bia-contact-audiencias">
            <span>{t('common.cta.learnMore')}</span>
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
          </a>
        }
      />

      <section
        id={audiences.id}
        className="secondary-section secondary-section--ivory"
        aria-labelledby="bia-contact-audiencias-title"
      >
        <div className="secondary-section__inner">
          <Reveal duration={0.6} y={16}>
            <p className="secondary-eyebrow">{audiences.eyebrow[locale]}</p>
          </Reveal>
          <Reveal delay={0.05} duration={0.7} y={22}>
            <h2 id="bia-contact-audiencias-title" className="secondary-section__title">
              {audiences.title[locale]}
            </h2>
            {audiences.description ? (
              <p className="secondary-section__description">
                {audiences.description[locale]}
              </p>
            ) : null}
          </Reveal>

          {/*
            Only the talent audience has a real destination today. The other
            three resolve to the channels section, so the row action is left
            empty rather than repeating the same link three times.
          */}
          <ol className="secondary-list">
            {contactAudiences.map((audience, index) => (
              <Fragment key={audience.id}>
                <SecondaryRow
                  number={String(index + 1).padStart(2, '0')}
                  title={audience.title[locale]}
                  description={audience.description[locale]}
                  meta={<SecondaryPendingNote>{audience.pending}</SecondaryPendingNote>}
                  link={
                    audience.id === 'talent' ? (
                      <SecondaryPageLink
                        href={audience.destination}
                        className="secondary-link secondary-link--compact"
                      >
                        <span>{t('navigation.talento')}</span>
                        <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
                      </SecondaryPageLink>
                    ) : null
                  }
                />
              </Fragment>
            ))}
          </ol>
        </div>
      </section>

      <SecondarySection
        id="bia-contact-channels"
        eyebrow={{ es: 'Canales', en: 'Channels' }}
        title={{
          es: 'Todavía estamos confirmando los datos.',
          en: 'We are still confirming the details.',
        }}
        description={{
          es: 'Publicaremos teléfono, correo y dirección en cuanto BIA los confirme. No queremos publicar información que no sea cierta.',
          en: 'We will publish the phone, email, and address as soon as BIA confirms them. We do not want to publish information that is not true.',
        }}
        tone="soft"
      >
        <ul className="secondary-footer-links">
          {contactChannels.map((channel) => (
            <li key={channel.id}>
              <Reveal className="secondary-footer-link" duration={0.6} y={16}>
                <p className="secondary-footer-link__label">{channel.label[locale]}</p>
                <p className="secondary-footer-link__value">{channel.pending?.[locale]}</p>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="secondary-pending secondary-pending--wide">
          {locale === 'en'
            ? 'No online form is published yet: we will add one when there is a real destination for it.'
            : 'Todavía no publicamos un formulario en línea: lo añadiremos cuando exista un destino real para él.'}
        </p>
      </SecondarySection>

      <SecondaryCrossLinks
        headingId="bia-contact-seguir-title"
        heading={locale === 'en' ? 'KEEP EXPLORING' : 'SIGUE EXPLORANDO'}
        targets={[
          { id: 'talento', label: t('navigation.talento') },
          { id: 'marcas', label: t('navigation.marcas') },
          { id: 'nosotros', label: t('navigation.nosotros') },
        ]}
      />

      <SecondaryCta
        eyebrow={page.eyebrow}
        title={{
          es: 'Te leemos.',
          en: 'We are listening.',
        }}
        description={{
          es: 'Mientras tanto, estas páginas cuentan quiénes somos.',
          en: 'In the meantime, these pages tell you who we are.',
        }}
        links={[
          { href: ROUTE_PATHS.nosotros, label: t('navigation.nosotros') },
          { href: ROUTE_PATHS.calidad, label: t('navigation.calidad') },
        ]}
      />
    </SecondaryPage>
  );
}
