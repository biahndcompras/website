import { useRef, type ReactNode } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type UseScrollOptions,
} from 'motion/react';

type ParallaxOffset = NonNullable<UseScrollOptions['offset']>;

export interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  offset?: ParallaxOffset;
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export default function ParallaxLayer({
  children,
  className = '',
  strength = 28,
  offset = ['start end', 'end start'],
  stiffness = 90,
  damping = 24,
  mass = 0.45,
}: ParallaxLayerProps) {
  const target = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({ target, offset });
  const resolvedStrength = Number.isFinite(strength)
    ? Math.min(80, Math.abs(strength))
    : 0;
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [resolvedStrength, -resolvedStrength],
  );
  const smoothY = useSpring(rawY, { stiffness, damping, mass });
  const stillY = useTransform(scrollYProgress, [0, 1], [0, 0]);

  return (
    <motion.div
      ref={target}
      className={className}
      style={{
        y: prefersReducedMotion ? stillY : smoothY,
        willChange: prefersReducedMotion ? 'auto' : 'transform',
      }}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
    >
      {children}
    </motion.div>
  );
}
