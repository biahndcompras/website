import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import {
  getNextHeroMediaState,
  mapProgressToVideoTime,
  type HeroMediaState,
} from './heroMedia';

export interface ScrollVideoHeroRenderState {
  progress: MotionValue<number>;
  smoothProgress: MotionValue<number>;
  textOpacity: MotionValue<number>;
  textY: MotionValue<number>;
  mediaState: HeroMediaState;
  isReducedMotion: boolean;
}

export type ScrollVideoHeroChildren =
  | ReactNode
  | ((state: ScrollVideoHeroRenderState) => ReactNode);

export interface ScrollVideoHeroProps {
  videoSrc: string;
  posterSrc?: string;
  title: string;
  description: string;
  children?: ScrollVideoHeroChildren;
  eyebrow?: string;
  scrollCue?: string;
  videoAriaLabel?: string;
  className?: string;
  scrollClassName?: string;
  onMediaStateChange?: (state: HeroMediaState) => void;
}

const defaultScrollClassName = 'h-[400vh]';

export default function ScrollVideoHero({
  videoSrc,
  posterSrc,
  title,
  description,
  children,
  eyebrow,
  scrollCue = 'Scroll',
  videoAriaLabel = 'BIA institutional film',
  className = '',
  scrollClassName = defaultScrollClassName,
  onMediaStateChange,
}: ScrollVideoHeroProps) {
  const scrollRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [mediaState, setMediaState] = useState<HeroMediaState>('loading');
  const [posterFailed, setPosterFailed] = useState(false);
  const prefersReducedMotion = useReducedMotion() === true;

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 22,
    mass: 0.35,
  });
  const reducedProgress = useMotionValue(0);
  const textProgress = prefersReducedMotion ? reducedProgress : smoothProgress;
  const textOpacity = useTransform(
    textProgress,
    [0, 0.16, 0.72, 1],
    [1, 1, 0, 0],
    { clamp: true },
  );
  const textY = useTransform(
    textProgress,
    [0, 0.16, 0.72, 1],
    [0, 0, -48, -48],
    { clamp: true },
  );

  useEffect(() => {
    setMediaState('loading');
    setPosterFailed(false);
  }, [posterSrc, videoSrc]);

  useEffect(() => {
    onMediaStateChange?.(mediaState);
  }, [mediaState, onMediaStateChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    let isSeeking = false;
    let pendingTime: number | null = null;
    let latestProgress = scrollYProgress.get();

    const markMediaUnavailable = () => {
      pendingTime = null;
      isSeeking = false;
      video.pause();
      setMediaState((currentState) =>
        getNextHeroMediaState(currentState, 'error'),
      );
    };

    const seekTo = (time: number) => {
      try {
        video.currentTime = time;
        isSeeking = true;
      } catch {
        markMediaUnavailable();
      }
    };

    const performSeek = (progress: number) => {
      if (prefersReducedMotion) {
        pendingTime = null;
        return;
      }

      const targetTime = mapProgressToVideoTime(progress, video.duration);
      if (targetTime === null) {
        return;
      }

      if (video.seeking || isSeeking) {
        pendingTime = targetTime;
        return;
      }

      if (
        targetTime === 0
          ? video.currentTime === 0
          : Math.abs(video.currentTime - targetTime) < 0.005
      ) {
        return;
      }

      seekTo(targetTime);
    };

    const handleLoadedData = () => {
      setMediaState((currentState) =>
        getNextHeroMediaState(currentState, 'loadeddata'),
      );

      try {
        video.currentTime = 0;
      } catch {
        // Some browsers can briefly reject seeks while media metadata settles.
      }

      performSeek(latestProgress);
    };

    const handleSeeked = () => {
      isSeeking = false;

      if (pendingTime !== null) {
        const timeToSeek = pendingTime;
        pendingTime = null;

        if (prefersReducedMotion) {
          return;
        }

        if (
          timeToSeek === 0
            ? video.currentTime === 0
            : Math.abs(video.currentTime - timeToSeek) < 0.005
        ) {
          return;
        }

        seekTo(timeToSeek);
      }
    };

    const handleError = markMediaUnavailable;

    if (prefersReducedMotion) {
      pendingTime = null;
      isSeeking = false;
      video.pause();

      try {
        video.currentTime = 0;
      } catch {
        // The still fallback remains available if the first frame cannot load.
      }
    }

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('error', handleError);

    const unsubscribe = prefersReducedMotion
      ? () => undefined
      : scrollYProgress.on('change', (nextProgress) => {
          latestProgress = nextProgress;
          performSeek(nextProgress);
        });

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('error', handleError);
      unsubscribe();
    };
  }, [prefersReducedMotion, scrollYProgress]);

  const renderState: ScrollVideoHeroRenderState = {
    progress: scrollYProgress,
    smoothProgress,
    textOpacity,
    textY,
    mediaState,
    isReducedMotion: prefersReducedMotion,
  };
  const childContent =
    typeof children === 'function' ? children(renderState) : children;
  const showPoster = Boolean(posterSrc) && !posterFailed;

  return (
    <section
      ref={scrollRef}
      className={`relative w-full bg-[#082a49] ${scrollClassName} ${className}`.trim()}
      data-media-state={mediaState}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      data-video-autoplay="false"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div
        className={`sticky top-0 flex w-full items-center overflow-hidden px-5 pb-20 pt-28 sm:px-10 sm:pb-24 sm:pt-32 lg:px-16 lg:pb-28 lg:pt-36 ${
          prefersReducedMotion ? 'h-[100svh]' : 'h-screen'
        }`}
      >
        <div className="absolute inset-0 isolate overflow-hidden bg-[#082a49]">
          <div
            className="absolute inset-0 overflow-hidden bg-[#082a49]"
            aria-hidden="true"
            style={{
              backgroundColor: '#082a49',
              backgroundImage:
                'radial-gradient(circle at 28% 32%, rgba(66, 143, 184, 0.42), transparent 38%), linear-gradient(135deg, #0b3557 0%, #061b31 100%)',
            }}
          >
            {showPoster ? (
              <img
                key={posterSrc}
                src={posterSrc}
                alt=""
                className="h-full w-full object-cover opacity-80"
                onError={() => setPosterFailed(true)}
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(4,19,34,0.82),rgba(4,19,34,0.38)_52%,rgba(4,19,34,0.2))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(3,14,27,0.32)_100%)]" />
          </div>

          <motion.video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            preload="metadata"
            autoPlay={false}
            playsInline
            muted
            loop={false}
            disablePictureInPicture
            aria-label={videoAriaLabel}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-500"
            style={{
              opacity: mediaState === 'ready' ? 1 : 0,
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-6xl">
          <motion.div
            style={{
              opacity: textOpacity,
              y: textY,
              willChange: prefersReducedMotion ? 'auto' : 'transform, opacity',
            }}
          >
            {eyebrow ? (
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70 sm:mb-7 sm:text-xs">
                {eyebrow}
              </p>
            ) : null}
            <h1
              id={titleId}
              className="max-w-5xl text-[clamp(3.25rem,9vw,8.25rem)] font-light leading-[0.9] tracking-[-0.055em] text-[#f5f0e7]"
            >
              {title}
            </h1>
            <p
              id={descriptionId}
              className="mt-6 max-w-xl text-sm font-light leading-relaxed text-white/75 sm:mt-8 sm:max-w-2xl sm:text-base"
            >
              {description}
            </p>
          </motion.div>
          {childContent ? <div className="mt-8 sm:mt-10">{childContent}</div> : null}
        </div>

        {scrollCue ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-5 sm:px-10 sm:pb-8 lg:px-16 lg:pb-10">
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.22em] text-white/60">
              <span>{scrollCue}</span>
              <span className="h-px w-12 bg-white/45" aria-hidden="true" />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
