import { biaContent } from '../../content/bia';
import { HOME_SECTION_IDS, getHomeAnchorHref } from '../../content/home';
import { useI18n } from '../../i18n/I18nProvider';
import Reveal from '../motion/Reveal';
import AbstractMediaSlot from './AbstractMediaSlot';

const brandGlyphs = ['EI', 'MY', 'OP', 'MD'] as const;

export default function BrandsSection() {
  const { locale, t } = useI18n();
  const storyHref = getHomeAnchorHref(HOME_SECTION_IDS.origin);

  return (
    <section
      id={HOME_SECTION_IDS.brands}
      className="home-section home-brands"
      aria-labelledby="home-brands-title"
    >
      <div className="home-section__inner home-brands__inner">
        <div className="home-brands__header">
          <Reveal duration={0.7} y={20}>
            <p className="home-eyebrow">{t('home.brands.eyebrow')}</p>
            <h2 id="home-brands-title" className="home-section__title">
              {t('home.brands.title')}
            </h2>
          </Reveal>
          <Reveal className="home-brands__detail" delay={0.1} duration={0.72} y={18}>
            <p>{t('home.brands.description')}</p>
            <p>{t('home.brands.detail')}</p>
          </Reveal>
        </div>

        <Reveal className="home-brands__visual" delay={0.12} duration={0.9} y={24}>
          <AbstractMediaSlot
            variant="brands"
            label={t('home.brands.visual')}
            caption={t('home.media.pendingDescription')}
          >
            <div className="home-brands__glyphs" aria-hidden="true">
              {brandGlyphs.map((glyph, index) => (
                <span className={`home-brands__glyph home-brands__glyph--${index + 1}`} key={glyph}>
                  {glyph}
                </span>
              ))}
            </div>
          </AbstractMediaSlot>
        </Reveal>

        <div className="home-brands__body">
          <Reveal className="home-brands__family" duration={0.65} y={16}>
            <span className="home-brands__family-line" aria-hidden="true" />
            <p>{t('home.brands.family')}</p>
          </Reveal>
          <ol className="home-brands__list">
            {biaContent.brands.map((brand, index) => (
              <li className="home-brand" key={brand.id} data-brand-id={brand.id}>
                <Reveal className="home-brand__inner" delay={index * 0.06} duration={0.68} y={18}>
                  <span className="home-brand__number">0{index + 1}</span>
                  <h3>{brand.name[locale]}</h3>
                  <p>{brand.description[locale]}</p>
                  <span className="home-brand__mark" aria-hidden="true">
                    {brandGlyphs[index]}
                  </span>
                </Reveal>
              </li>
            ))}
          </ol>
          <a className="home-text-link home-text-link--dark" href={storyHref}>
            <span>{t('home.origin.eyebrow')}</span>
            <span className="home-text-link__line" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
