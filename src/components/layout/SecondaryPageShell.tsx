import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { getRouteNavigationState } from '../../app/routes';
import {
  getSecondaryPage,
  type SecondaryPageId,
} from '../../content/secondaryPages';
import { useI18n } from '../../i18n/I18nProvider';
import type { Locale, LocalizedCopy } from '../../types';
import ParallaxLayer from '../media/ParallaxLayer';
import Reveal from '../motion/Reveal';

export type SecondaryTone = 'ivory' | 'soft' | 'navy';

function localized(value: LocalizedCopy, locale: Locale): string {
  return value[locale];
}

/**
 * Page frame for the corporate subpages. It owns the page landmark, the
 * document language, and the bounded overflow the Home sections rely on.
 */
export function SecondaryPage({
  pageId,
  children,
  className = '',
}: {
  pageId: SecondaryPageId;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`secondary-page ${className}`.trim()} data-page={pageId}>
      {children}
    </div>
  );
}

export interface SecondaryPageLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  ariaCurrent?: 'page';
}

/** Internal link that carries the active locale through the navigation state. */
export function SecondaryPageLink({
  href,
  children,
  className = 'secondary-link',
  ariaCurrent,
}: SecondaryPageLinkProps) {
  const { locale } = useI18n();
  const [path, hash] = href.split('#');
  const target = hash ? `${path}#${hash}` : path;

  return (
    <Link
      to={target}
      state={getRouteNavigationState(locale)}
      className={className}
      aria-current={ariaCurrent}
    >
      {children}
    </Link>
  );
}

export interface SecondaryPendingNoteProps {
  children: LocalizedCopy | null;
  tone?: 'default' | 'light';
  className?: string;
}

/**
 * Renders content BIA has not approved yet as an explicit, honest note instead
 * of hiding it or inventing a value.
 */
export function SecondaryPendingNote({
  children,
  tone = 'default',
  className = '',
}: SecondaryPendingNoteProps) {
  const { locale } = useI18n();

  if (!children) {
    return null;
  }

  return (
    <p
      className={`secondary-pending secondary-pending--${tone} ${className}`.trim()}
      data-content-status="placeholder"
    >
      {localized(children, locale)}
    </p>
  );
}

export interface SecondaryHeroProps {
  pageId: SecondaryPageId;
  actions?: ReactNode;
  visual?: ReactNode;
  aside?: ReactNode;
}

/** Cinematic editorial hero shared by every corporate subpage. */
export function SecondaryHero({
  pageId,
  actions,
  visual,
  aside,
}: SecondaryHeroProps) {
  const { locale } = useI18n();
  const page = getSecondaryPage(pageId);
  const titleId = `${pageId}-title`;

  return (
    <section
      id="secondary-hero"
      className="secondary-hero"
      aria-labelledby={titleId}
      data-page={pageId}
    >
      <div className="secondary-hero__inner">
        <div className="secondary-hero__copy">
          <Reveal duration={0.7} y={20}>
            <p className="secondary-eyebrow secondary-eyebrow--light">
              {localized(page.eyebrow, locale)}
            </p>
            <h1 id={titleId} className="secondary-hero__title">
              {localized(page.title, locale)}
            </h1>
            <p className="secondary-hero__description">
              {localized(page.description, locale)}
            </p>
          </Reveal>
          {actions ? (
            <Reveal delay={0.1} duration={0.7} y={18} className="secondary-hero__actions">
              {actions}
            </Reveal>
          ) : null}
          {aside}
        </div>

        {visual ? (
          <ParallaxLayer className="secondary-hero__visual" strength={16}>
            {visual}
          </ParallaxLayer>
        ) : null}
      </div>
    </section>
  );
}

export interface SecondarySectionProps {
  id: string;
  eyebrow?: LocalizedCopy;
  title: LocalizedCopy;
  description?: LocalizedCopy | null;
  tone?: SecondaryTone;
  media?: ReactNode;
  mediaLabel?: ReactNode;
  children?: ReactNode;
  className?: string;
  align?: 'start' | 'wide';
}

/** Bounded editorial section: one copy column plus an optional media column. */
export function SecondarySection({
  id,
  eyebrow,
  title,
  description = null,
  tone = 'ivory',
  media,
  mediaLabel,
  children,
  className = '',
  align = 'start',
}: SecondarySectionProps) {
  const { locale } = useI18n();
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      className={`secondary-section secondary-section--${tone} ${className}`.trim()}
      aria-labelledby={titleId}
    >
      <div className="secondary-section__inner">
        <div
          className={`secondary-section__grid secondary-section__grid--${align}`}
        >
          <div className="secondary-section__copy">
            {eyebrow ? (
              <Reveal duration={0.6} y={16}>
                <p
                  className={`secondary-eyebrow${
                    tone === 'navy' ? ' secondary-eyebrow--light' : ''
                  }`}
                >
                  {localized(eyebrow, locale)}
                </p>
              </Reveal>
            ) : null}
            <Reveal delay={0.05} duration={0.7} y={22}>
              <h2 id={titleId} className="secondary-section__title">
                {localized(title, locale)}
              </h2>
              {description ? (
                <p
                  className={`secondary-section__description${
                    tone === 'navy' ? ' secondary-section__description--light' : ''
                  }`}
                >
                  {localized(description, locale)}
                </p>
              ) : null}
            </Reveal>
          </div>

          {media ? (
            <div className="secondary-section__media">
              <ParallaxLayer className="secondary-section__media-inner" strength={12}>
                {media}
              </ParallaxLayer>
              {mediaLabel ? (
                <p
                  className={`secondary-section__media-label${
                    tone === 'navy' ? ' secondary-section__media-label--light' : ''
                  }`}
                >
                  {mediaLabel}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        {children}
      </div>
    </section>
  );
}

export interface SecondaryMarkProps {
  label: string;
  index: string;
  tone?: 'dark' | 'light';
}

/**
 * Abstract, non-inventive visual mark. It carries the editorial rhythm of the
 * page without implying photography or data BIA has not supplied.
 */
export function SecondaryMark({ label, index, tone = 'dark' }: SecondaryMarkProps) {
  return (
    <div
      className={`secondary-mark secondary-mark--${tone}`}
      aria-hidden="true"
      data-mark="abstract"
    >
      <span className="secondary-mark__grid" />
      <span className="secondary-mark__label">{label}</span>
      <span className="secondary-mark__index">{index}</span>
    </div>
  );
}

export interface SecondaryRowProps {
  number: string;
  title: ReactNode;
  description: ReactNode;
  meta?: ReactNode;
  className?: string;
  link?: ReactNode;
}

/** Shared editorial row used by the history, brand, pillar and audience lists. */
export function SecondaryRow({
  number,
  title,
  description,
  meta,
  className = '',
  link,
}: SecondaryRowProps) {
  return (
    <Reveal className={`secondary-row ${className}`.trim()} role="listitem" duration={0.65} y={18}>
      <span className="secondary-row__number" aria-hidden="true">
        {number}
      </span>
      <div className="secondary-row__body">
        <h3 className="secondary-row__title">{title}</h3>
        <div className="secondary-row__description">{description}</div>
        {meta ? <div className="secondary-row__meta">{meta}</div> : null}
      </div>
      {link ? <span className="secondary-row__action">{link}</span> : null}
    </Reveal>
  );
}

export interface SecondaryCrossLinkTarget {
  id: SecondaryPageId;
  label: string;
}

/** Grid of onward links so every page offers at least two other ways forward. */
export function SecondaryCrossLinks({
  targets,
  heading,
  headingId,
}: {
  targets: readonly SecondaryCrossLinkTarget[];
  heading: ReactNode;
  headingId: string;
}) {
  const { locale } = useI18n();

  return (
    <section
      className="secondary-section secondary-section--soft"
      aria-labelledby={headingId}
    >
      <div className="secondary-section__inner">
        <Reveal duration={0.6} y={16}>
          <h2 id={headingId} className="secondary-eyebrow">
            {heading}
          </h2>
        </Reveal>
        <ul className="secondary-crosslinks">
          {targets.map((target) => (
            <li key={target.id}>
              <Reveal duration={0.6} y={16}>
                <SecondaryPageLink
                  href={getSecondaryPage(target.id).canonicalPath}
                  className="secondary-crosslink"
                >
                  <span className="secondary-crosslink__label">{target.label}</span>
                  <span className="secondary-crosslink__title">
                    {getSecondaryPage(target.id).title[locale]}
                  </span>
                </SecondaryPageLink>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export interface SecondaryCtaLink {
  href: string;
  label: string;
}

export interface SecondaryCtaProps {
  eyebrow?: LocalizedCopy;
  title: LocalizedCopy;
  description?: LocalizedCopy | null;
  links: readonly SecondaryCtaLink[];
}

/** Closing call to action that always offers a second way forward. */
export function SecondaryCta({ eyebrow, title, description = null, links }: SecondaryCtaProps) {
  const { locale } = useI18n();

  return (
    <section className="secondary-cta" aria-labelledby="secondary-cta-title">
      <div className="secondary-section__inner secondary-cta__inner">
        <Reveal duration={0.7} y={22}>
          {eyebrow ? (
            <p className="secondary-eyebrow secondary-eyebrow--light">{localized(eyebrow, locale)}</p>
          ) : null}
          <h2 id="secondary-cta-title" className="secondary-cta__title">
            {localized(title, locale)}
          </h2>
          {description ? (
            <p className="secondary-cta__description">{localized(description, locale)}</p>
          ) : null}
        </Reveal>
        <ul className="secondary-cta__links">
          {links.map((link, index) => (
            <li key={link.href}>
              <Reveal delay={0.06 * (index + 1)} duration={0.6} y={16}>
                <SecondaryPageLink href={link.href} className="secondary-link secondary-link--light">
                  <span>{link.label}</span>
                  <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
                </SecondaryPageLink>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
