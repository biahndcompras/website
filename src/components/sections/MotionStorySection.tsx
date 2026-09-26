import { useEffect, useId, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { HOME_SECTION_IDS, getHomeAnchorHref } from '../../content/home';
import { useI18n } from '../../i18n/I18nProvider';
import Reveal from '../motion/Reveal';
import {
  MOTION_STORY_CTA_VISUAL_SCALE_END,
  getMotionStoryCopyBeat,
  getMotionStoryCtaCopyOpacity,
  getMotionStoryCtaCopyShiftPx,
  getMotionStoryCtaVisualScale,
  getMotionStoryFrameInsetPx,
  getMotionStoryFrameRadiusPx,
  getMotionStoryVideoDriftPercent,
  getMotionStoryVideoScale,
  mapProgressToMotionStoryTime,
  resolveMotionStoryPosterSource,
  resolveMotionStoryVideoSource,
} from '../media/motionStoryMedia';

const CINEMATIC_STAGE_QUERY = '(min-width: 1024px)';

type MotionStoryMediaState = 'loading' | 'ready' | 'fallback';

interface MotionStoryBeatStyle {
  opacity: MotionValue<number> | number;
  y: MotionValue<number> | number;
}

/**
 * The cinematic grammar (long scroll track, sticky stage, scrub) is a desktop
 * enhancement only. Mobile and reduced motion keep a plain document flow.
 */
function useCinematicStage(): boolean {
  const [isCinematicStage, setIsCinematicStage] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const query = window.matchMedia(CINEMATIC_STAGE_QUERY);
    const syncStage = () => setIsCinematicStage(query.matches);

    syncStage();
    query.addEventListener('change', syncStage);

    return () => query.removeEventListener('change', syncStage);
  }, []);

  return isCinematicStage;
}

export default function MotionStorySection() {
  const { t } = useI18n();
  const environment = (
    import.meta as ImportMeta & {
      env?: Record<string, string | undefined>;
    }
  ).env;
  const videoSrc = resolveMotionStoryVideoSource(
    environment?.VITE_BIA_MOTION_STORY_VIDEO_URL,
  );
  const posterSrc = resolveMotionStoryPosterSource(
    environment?.VITE_BIA_MOTION_STORY_POSTER_URL,
  );

  const headingId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaState, setMediaState] = useState<MotionStoryMediaState>('loading');
  const [posterFailed, setPosterFailed] = useState(false);

  const prefersReducedMotion = useReducedMotion() === true;
  const isCinematicStage = useCinematicStage();
  const isMotionActive = isCinematicStage && !prefersReducedMotion;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 22,
    mass: 0.35,
  });
  const { scrollYProgress: ctaScrollProgress } = useScroll({
    target: ctaRef,
    offset: ['start end', 'center center'],
  });

  const frameInset = useTransform(smoothProgress, (progress) =>
    getMotionStoryFrameInsetPx(progress),
  );
  const frameRadius = useTransform(smoothProgress, (progress) =>
    getMotionStoryFrameRadiusPx(progress),
  );
  const filmScale = useTransform(smoothProgress, (progress) =>
    getMotionStoryVideoScale(progress),
  );
  const filmDrift = useTransform(
    smoothProgress,
    (progress) => `${getMotionStoryVideoDriftPercent(progress)}%`,
  );
  const firstBeatOpacity = useTransform(smoothProgress, (progress) =>
    getMotionStoryCopyBeat(progress, 0).opacity,
  );
  const firstBeatShift = useTransform(smoothProgress, (progress) =>
    getMotionStoryCopyBeat(progress, 0).shiftPx,
  );
  const secondBeatOpacity = useTransform(smoothProgress, (progress) =>
    getMotionStoryCopyBeat(progress, 1).opacity,
  );
  const secondBeatShift = useTransform(smoothProgress, (progress) =>
    getMotionStoryCopyBeat(progress, 1).shiftPx,
  );
  const ctaVisualScale = useTransform(ctaScrollProgress, (progress) =>
    isMotionActive
      ? getMotionStoryCtaVisualScale(progress)
      : MOTION_STORY_CTA_VISUAL_SCALE_END,
  );

  /*
    Outside the cinematic stage nothing is scroll-driven. These are explicit
    neutral values rather than `undefined`: motion never clears inline styles it
    has already written, so a desktop -> mobile resize would otherwise keep a
    stale offset, radius, scale, or opacity (a relative `inset` physically
    shifts the frame and opens a horizontal overflow).
  */
  const firstBeatStyle: MotionStoryBeatStyle = isMotionActive
    ? { opacity: firstBeatOpacity, y: firstBeatShift }
    : { opacity: 1, y: 0 };
  const secondBeatStyle: MotionStoryBeatStyle = isMotionActive
    ? { opacity: secondBeatOpacity, y: secondBeatShift }
    : { opacity: 1, y: 0 };
  const frameStyle = isMotionActive
    ? {
        top: frameInset,
        right: frameInset,
        bottom: frameInset,
        left: frameInset,
        borderRadius: frameRadius,
      }
    : { top: 0, right: 0, bottom: 0, left: 0, borderRadius: 0 };
  const filmStyle = isMotionActive
    ? { scale: filmScale, y: filmDrift }
    : { scale: 1, y: '0%' };
  const ctaVisualStyle = isMotionActive
    ? { scale: ctaVisualScale }
    : { scale: 1 };

  // Contract, not decoration: the CTA copy is never dimmed or moved by scroll.
  const ctaCopyOpacity = getMotionStoryCtaCopyOpacity(0);
  const ctaCopyShiftPx = getMotionStoryCtaCopyShiftPx(0);

  useEffect(() => {
    setMediaState('loading');
    setPosterFailed(false);
  }, [posterSrc, videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (!isMotionActive) {
      // Reduced motion and mobile keep the film on its first frame.
      try {
        video.currentTime = 0;
      } catch {
        // The poster stays available when the first frame cannot be decoded.
      }

      return;
    }

    let isSeeking = false;
    let pendingTime: number | null = null;

    const markMediaUnavailable = () => {
      pendingTime = null;
      isSeeking = false;
      setMediaState('fallback');
    };

    const seekTo = (time: number) => {
      try {
        video.currentTime = time;
        isSeeking = true;
      } catch {
        markMediaUnavailable();
      }
    };

    const isAlreadyAt = (time: number) =>
      time === 0
        ? video.currentTime === 0
        : Math.abs(video.currentTime - time) < 0.005;

    const applyProgress = (progress: number) => {
      const targetTime = mapProgressToMotionStoryTime(progress, video.duration);
      if (targetTime === null) {
        return;
      }

      if (video.seeking || isSeeking) {
        pendingTime = targetTime;
        return;
      }

      if (isAlreadyAt(targetTime)) {
        return;
      }

      seekTo(targetTime);
    };

    const handleLoadedData = () => {
      setMediaState('ready');

      try {
        video.currentTime = 0;
      } catch {
        // Browsers can briefly reject seeks while metadata settles.
      }

      applyProgress(smoothProgress.get());
    };

    const handleSeeked = () => {
      isSeeking = false;

      if (pendingTime === null) {
        return;
      }

      const timeToSeek = pendingTime;
      pendingTime = null;

      if (isAlreadyAt(timeToSeek)) {
        return;
      }

      seekTo(timeToSeek);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('error', markMediaUnavailable);

    const unsubscribe = smoothProgress.on('change', applyProgress);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('error', markMediaUnavailable);
      unsubscribe();
    };
  }, [isMotionActive, smoothProgress]);

  const ctaHref = getHomeAnchorHref(HOME_SECTION_IDS.process);
  const showPoster = Boolean(posterSrc) && !posterFailed;

  return (
    <section
      id={HOME_SECTION_IDS.motion}
      className="home-motion-story"
      aria-labelledby={headingId}
      data-media-state={mediaState}
      data-cinematic={isMotionActive ? 'true' : 'false'}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
    >
      {/*
        The scroll track itself never clips: an overflow ancestor would turn
        into the sticky scrollport and break the stage entirely.
      */}
      <div className="home-motion-story__track" ref={trackRef}>
        <div className="home-motion-story__stage">
          <motion.div
            className="home-motion-story__frame"
            role="img"
            aria-label={t('home.motion.videoLabel')}
            style={frameStyle}
          >
            <div className="home-motion-story__media">
              {showPoster ? (
                <img
                  className="home-motion-story__poster"
                  src={posterSrc}
                  alt=""
                  onError={() => setPosterFailed(true)}
                />
              ) : null}
              <motion.video
                ref={videoRef}
                className="home-motion-story__film"
                src={videoSrc}
                poster={posterSrc}
                preload="metadata"
                autoPlay={false}
                playsInline
                muted
                loop={false}
                disablePictureInPicture
                style={filmStyle}
              />
              <div className="home-motion-story__scrim" aria-hidden="true" />
            </div>
          </motion.div>

          <div className="home-motion-story__copy">
            <motion.div
              className="home-motion-story__beat"
              style={firstBeatStyle}
            >
              <p className="home-eyebrow home-eyebrow--light">
                {t('home.motion.eyebrow')}
              </p>
              <h2
                id={headingId}
                className="home-motion-story__title home-section__title--light"
              >
                {t('home.motion.title')}
              </h2>
              <p className="home-motion-story__description">
                {t('home.motion.description')}
              </p>
            </motion.div>

            <motion.div
              className="home-motion-story__beat"
              style={secondBeatStyle}
            >
              <h3 className="home-motion-story__title home-section__title--light">
                {t('home.motion.secondTitle')}
              </h3>
              <p className="home-motion-story__description">
                {t('home.motion.secondDescription')}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="home-motion-cta" ref={ctaRef}>
        <div
          className="home-motion-cta__copy"
          style={{ opacity: ctaCopyOpacity, y: ctaCopyShiftPx }}
        >
          <Reveal duration={0.7} y={20}>
            <p className="home-eyebrow home-eyebrow--light">
              {t('home.motion.ctaEyebrow')}
            </p>
            <h3 className="home-motion-cta__title">
              {t('home.motion.ctaTitle')}
            </h3>
            <p className="home-motion-cta__description">
              {t('home.motion.ctaDescription')}
            </p>
            <a
              className="home-cta home-cta--ghost home-motion-cta__link"
              href={ctaHref}
            >
              <span>{t('home.motion.ctaLinkLabel')}</span>
              <span className="home-motion-cta__line" aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        <div className="home-motion-cta__visual">
          <motion.div
            className="home-motion-cta__media"
            role="img"
            aria-label={t('home.motion.ctaVisualLabel')}
            style={ctaVisualStyle}
          >
            <img className="home-motion-cta__image" src={posterSrc} alt="" />
            <div className="home-motion-cta__scrim" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
