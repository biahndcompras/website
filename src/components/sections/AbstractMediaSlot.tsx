import type { ReactNode } from 'react';

export type AbstractMediaVariant =
  | 'manifesto'
  | 'origin'
  | 'process'
  | 'brands'
  | 'quality'
  | 'talent';

export interface AbstractMediaSlotProps {
  variant: AbstractMediaVariant;
  label: string;
  caption?: string;
  className?: string;
  children?: ReactNode;
}

export default function AbstractMediaSlot({
  variant,
  label,
  caption,
  className = '',
  children,
}: AbstractMediaSlotProps) {
  return (
    <div
      className={`home-media-slot home-media-slot--${variant} ${className}`.trim()}
      role="img"
      aria-label={label}
      data-media-placeholder="true"
      data-media-variant={variant}
    >
      <div className="home-media-slot__grain" aria-hidden="true" />
      <div className="home-media-slot__field" aria-hidden="true">
        <span className="home-media-slot__field-line home-media-slot__field-line--one" />
        <span className="home-media-slot__field-line home-media-slot__field-line--two" />
        <span className="home-media-slot__field-dot" />
        <span className="home-media-slot__field-orbit" />
      </div>
      {children}
      <div className="home-media-slot__meta">
        <span>{label}</span>
        {caption ? <span>{caption}</span> : null}
      </div>
    </div>
  );
}
