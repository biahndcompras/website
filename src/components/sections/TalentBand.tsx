import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getRouteNavigationState,
  ROUTE_PATHS,
} from '../../app/routes';
import { HOME_SECTION_IDS, getHomeAnchorHref } from '../../content/home';
import { useI18n } from '../../i18n/I18nProvider';
import Reveal from '../motion/Reveal';
import AbstractMediaSlot from './AbstractMediaSlot';

const talentFamilies = [
  'home.talent.origin',
  'home.talent.production',
  'home.talent.culinary',
  'home.talent.partners',
] as const;

export default function TalentBand() {
  const { locale, t } = useI18n();
  const storyHref = getHomeAnchorHref(HOME_SECTION_IDS.story);

  return (
    <section
      id={HOME_SECTION_IDS.talent}
      className="home-section home-talent"
      aria-labelledby="home-talent-title"
    >
      <div className="home-section__inner home-talent__inner">
        <Reveal className="home-talent__copy" duration={0.8} y={24}>
          <p className="home-eyebrow home-eyebrow--light">{t('home.talent.eyebrow')}</p>
          <h2 id="home-talent-title" className="home-section__title home-section__title--light">
            {t('home.talent.title')}
          </h2>
          <p className="home-section__intro home-section__intro--light">
            {t('home.talent.description')}
          </p>
          <div className="home-talent__actions">
            <Link
              className="home-cta home-cta--copper"
              to={ROUTE_PATHS.talento}
              state={getRouteNavigationState(locale)}
            >
              <span>{t('common.cta.viewOpportunities')}</span>
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </Link>
            <a className="home-cta home-cta--ghost" href={storyHref}>
              <span>{t('home.talent.secondaryCta')}</span>
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </a>
          </div>
          <p className="home-talent__careers-note">{t('home.talent.careersNote')}</p>
        </Reveal>

        <Reveal className="home-talent__visual" delay={0.12} duration={0.9} y={24}>
          <AbstractMediaSlot
            variant="talent"
            label={t('home.media.pendingLabel')}
            caption={t('home.media.pendingDescription')}
          >
            <div className="home-talent__visual-people" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="home-talent__visual-word" aria-hidden="true">
              BIA
            </span>
          </AbstractMediaSlot>
        </Reveal>

        <div className="home-talent__roles">
          <Reveal className="home-talent__roles-heading" duration={0.65} y={16}>
            <p>{t('home.talent.roles')}</p>
            <span aria-hidden="true" />
          </Reveal>
          <ul>
            {talentFamilies.map((familyKey, index) => (
              <li key={familyKey}>
                <Reveal delay={index * 0.05} duration={0.58} y={12}>
                  <span>0{index + 1}</span>
                  {t(familyKey)}
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="home-talent__role-note">{t('home.talent.roleNote')}</p>
        </div>
      </div>
    </section>
  );
}
