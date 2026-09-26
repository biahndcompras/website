import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  role?: string;
}

export default function Reveal({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  y = 32,
  role,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion() === true;
  const hidden = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y };
  const visible = { opacity: 1, y: 0 };
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] as const,
      };

  return (
    <motion.div
      className={className}
      role={role}
      initial={hidden}
      whileInView={visible}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={transition}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
    >
      {children}
    </motion.div>
  );
}
