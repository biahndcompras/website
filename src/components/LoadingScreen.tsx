import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useI18n } from '../i18n/I18nProvider';

interface LoadingScreenProps {
  onComplete: () => void;
}

const HOLD_DURATION_MS = 820;
const EXIT_DURATION_MS = 280;
const GRID_COLUMNS = 12;
const GRID_ROWS = 8;

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { t } = useI18n();
  const prefersReducedMotion = useReducedMotion() === true;
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const timer = window.setTimeout(() => {
      setIsExiting(true);
    }, HOLD_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [onComplete, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || !isExiting) {
      return;
    }

    const timer = window.setTimeout(() => {
      onComplete();
    }, EXIT_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isExiting, onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className="bia-loading-transition"
      role="status"
      aria-live="polite"
      aria-label={t('media.loading')}
      aria-busy="true"
    >
      <div className="bia-loading-transition__grid" aria-hidden="true">
        {Array.from({ length: GRID_COLUMNS * GRID_ROWS }, (_, index) => {
          const row = Math.floor(index / GRID_COLUMNS);
          const column = index % GRID_COLUMNS;
          const delay = (row + column) * 0.012;

          return (
            <motion.span
              key={`${row}-${column}`}
              className="bia-loading-transition__tile"
              initial={{ opacity: 1, scale: 1 }}
              animate={
                isExiting
                  ? { opacity: 0, scale: 0.72 }
                  : { opacity: 1, scale: 1 }
              }
              transition={{
                duration: isExiting ? EXIT_DURATION_MS / 1000 : 0.45,
                delay: isExiting ? delay : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}
      </div>

      <motion.div
        className="bia-loading-transition__content"
        animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? -8 : 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="bia-loading-transition__wordmark" aria-hidden="true">
          BIA
        </div>
        <p className="bia-loading-transition__label">{t('home.hero.eyebrow')}</p>
        <p className="bia-loading-transition__loading">{t('media.loading')}</p>
      </motion.div>
    </div>
  );
}
