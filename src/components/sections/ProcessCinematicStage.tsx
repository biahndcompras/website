import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { biaContent } from '../../content/bia';
import type { Locale } from '../../types';
import AbstractMediaSlot from './AbstractMediaSlot';
import {
  mapProcessProgress,
  PROCESS_STEP_COUNT,
} from './processProgress';
import { getProcessVisualVariant } from './processVisuals';

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';
const COMPACT_HEIGHT_MEDIA_QUERY = '(max-height: 820px)';

export interface ProcessCinematicStageProps {
  locale: Locale;
  trailLabel: string;
  visualLabel: string;
  mediaCaption: string;
}

interface ProcessStepRowProps {
  index: number;
  locale: Locale;
  progress: MotionValue<number>;
  animated: boolean;
  active: boolean;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }

    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

function getStepEmphasis(
  progress: number,
  stepIndex: number,
  stepCount: number,
): number {
  const stepCenter = stepIndex + 0.5;
  const distanceFromCenter = Math.abs(progress * stepCount - stepCenter);

  return Math.max(0, 1 - distanceFromCenter);
}

function ProcessStepRow({
  index,
  locale,
  progress,
  animated,
  active,
}: ProcessStepRowProps) {
  const step = biaContent.processSteps[index];
  const emphasis = useTransform(progress, (nextProgress) =>
    getStepEmphasis(nextProgress, index, PROCESS_STEP_COUNT),
  );
  const opacity = useTransform(emphasis, [0, 1], [0.56, 1], { clamp: true });
  const y = useTransform(emphasis, [0, 1], [10, 0], { clamp: true });
  const dotScale = useTransform(emphasis, [0, 1], [0.82, 1.5], {
    clamp: true,
  });

  if (!step) {
    return null;
  }

  return (
    <motion.li
      className="process-cinematic__step"
      data-process-step={step.id}
      data-active={active ? 'true' : 'false'}
      style={
        animated
          ? {
              y,
              willChange: 'transform',
            }
          : undefined
      }
    >
      <motion.span
        className="process-cinematic__step-number"
        aria-hidden="true"
        style={animated ? { opacity: active ? 1 : opacity } : undefined}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.span>
      <div className="process-cinematic__step-body">
        <h3>{step.title[locale]}</h3>
        <p>{step.description[locale]}</p>
      </div>
      <motion.span
        className="process-cinematic__step-dot"
        aria-hidden="true"
        style={animated ? { scale: dotScale } : undefined}
      />
    </motion.li>
  );
}

export default function ProcessCinematicStage({
  locale,
  trailLabel,
  visualLabel,
  mediaCaption,
}: ProcessCinematicStageProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() === true;
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const isCompactHeight = useMediaQuery(COMPACT_HEIGHT_MEDIA_QUERY);
  const animated = isDesktop && !isCompactHeight && !prefersReducedMotion;
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const journeyLabel = locale === 'en' ? 'SEED / CUP' : 'SEMILLA / TAZA';
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 58,
    damping: 25,
    mass: 0.45,
  });

  const panelScaleX = useTransform(
    smoothProgress,
    [0, 0.45, 0.68, 1],
    [0.82, 1, 1, 0.94],
    { clamp: true },
  );
  const panelX = useTransform(
    smoothProgress,
    [0, 0.45, 0.68, 1],
    ['3.5%', '0%', '0%', '3%'],
    { clamp: true },
  );
  const panelY = useTransform(
    smoothProgress,
    [0, 0.65, 1],
    [0, 0, 18],
    { clamp: true },
  );
  const panelRadius = useTransform(
    smoothProgress,
    [0, 0.65, 1],
    [0, 0, 28],
    { clamp: true },
  );
  const visualScale = useTransform(
    smoothProgress,
    [0, 1],
    [1.04, 1.15],
    { clamp: true },
  );
  const visualY = useTransform(
    smoothProgress,
    [0, 1],
    ['-3%', '3%'],
    { clamp: true },
  );
  const railProgress = useTransform(
    smoothProgress,
    [0, 1],
    [0.035, 1],
    { clamp: true },
  );

  useMotionValueEvent(smoothProgress, 'change', (nextProgress) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    if (!animated) {
      track.dataset.progress = '0.0000';
      track.dataset.activeStep = '0';
      track.dataset.activeStepId = biaContent.processSteps[0]?.id ?? '';
      return;
    }

    const nextState = mapProcessProgress(nextProgress);
    track.dataset.progress = nextState.progress.toFixed(4);
    track.dataset.activeStep = String(nextState.activeStepIndex);
    track.dataset.activeStepId =
      biaContent.processSteps[nextState.activeStepIndex]?.id ?? '';
    setActiveStepIndex((currentIndex) =>
      currentIndex === nextState.activeStepIndex ? currentIndex : nextState.activeStepIndex,
    );
  });

  useEffect(() => {
    if (animated) {
      return;
    }

    setActiveStepIndex(0);
  }, [animated]);

  const layoutMode = prefersReducedMotion
    ? 'static'
    : isDesktop && !isCompactHeight
      ? 'cinematic'
      : 'stacked';
  const initialProgress = animated ? mapProcessProgress(smoothProgress.get()) : null;
  const initialActiveStep = initialProgress?.activeStepIndex ?? 0;
  const activeStep = biaContent.processSteps[initialActiveStep];
  const activeVariant = getProcessVisualVariant(animated ? activeStepIndex : 0);
  const variantTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: 0.42,
        ease: [0.16, 1, 0.3, 1] as const,
      };

  return (
    <div
      ref={trackRef}
      className="process-cinematic"
      data-process-layout={layoutMode}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      data-progress={animated ? (initialProgress?.progress ?? 0).toFixed(4) : '0.0000'}
      data-active-step={String(initialActiveStep)}
      data-active-step-id={activeStep?.id ?? ''}
      data-step-count={PROCESS_STEP_COUNT}
    >
      <div className="process-cinematic__sticky">
        <div className="process-cinematic__composition">
          <div className="process-cinematic__copy">
            <div className="process-cinematic__stage-meta" aria-hidden="true">
              <span>{journeyLabel}</span>
              <span>
                {String(initialActiveStep + 1).padStart(2, '0')} /{' '}
                {String(PROCESS_STEP_COUNT).padStart(2, '0')}
              </span>
            </div>

            <ol className="process-cinematic__steps" aria-label={trailLabel}>
              {biaContent.processSteps.map((step, index) => (
                <Fragment key={step.id}>
                  <ProcessStepRow
                    index={index}
                    locale={locale}
                    progress={smoothProgress}
                    animated={animated}
                    active={animated && index === activeStepIndex}
                  />
                </Fragment>
              ))}
            </ol>
          </div>

          <div className="process-cinematic__visual-frame">
            <motion.div
              className="process-cinematic__visual-panel"
              style={
                animated
                  ? {
                      x: panelX,
                      y: panelY,
                      scaleX: panelScaleX,
                      borderRadius: panelRadius,
                      willChange: 'transform',
                    }
                  : undefined
              }
            >
              <motion.div
                className="process-cinematic__visual-motion"
                style={
                  animated
                    ? {
                        scale: visualScale,
                        y: visualY,
                        willChange: 'transform',
                      }
                    : undefined
                }
              >
                <AbstractMediaSlot
                  variant="process"
                  label={visualLabel}
                  caption={mediaCaption}
                  className="process-cinematic__media"
                >
                  <div className="process-cinematic__visual-rings" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="process-cinematic__variants" aria-hidden="true">
                    <AnimatePresence initial={false} mode="sync">
                      <motion.div
                        key={activeVariant.id}
                        className="process-cinematic__variant"
                        data-variant={activeVariant.id}
                        data-motif={activeVariant.motif}
                        style={
                          {
                            '--process-variant-accent': activeVariant.accent,
                          } as CSSProperties
                        }
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={variantTransition}
                      >
                        <span className="process-cinematic__variant-shape process-cinematic__variant-shape--one" />
                        <span className="process-cinematic__variant-shape process-cinematic__variant-shape--two" />
                        <span className="process-cinematic__variant-shape process-cinematic__variant-shape--three" />
                        <span className="process-cinematic__variant-index">
                          {String(activeVariant.index + 1).padStart(2, '0')}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <span className="process-cinematic__visual-word" aria-hidden="true">
                    {journeyLabel}
                  </span>
                </AbstractMediaSlot>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="process-cinematic__rail" aria-hidden="true">
          <motion.span
            style={animated ? { scaleY: railProgress } : { scaleY: 1 }}
          />
        </div>
      </div>
    </div>
  );
}
