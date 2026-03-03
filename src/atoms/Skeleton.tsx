// src/atoms/Skeleton.tsx
// Atom: Skeleton loading placeholder for progressive loading UX.

import styles from './Skeleton.module.css';

interface SkeletonProps {
  /** Width (CSS value). Defaults to '100%' */
  width?: string;
  /** Height (CSS value). Defaults to '1rem' */
  height?: string;
  /** Shape variant */
  variant?: 'rect' | 'circle' | 'text';
  /** Number of skeleton lines to render (only for 'text' variant) */
  lines?: number;
  /** Custom className */
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  variant = 'rect',
  lines = 1,
  className = '',
}: SkeletonProps) {
  const variantClass = variant === 'circle'
    ? styles['skeleton--circle']
    : variant === 'text'
      ? styles['skeleton--text']
      : '';

  if (variant === 'text' && lines > 1) {
    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width }}
        data-testid="skeleton"
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${styles['skeleton']} ${variantClass} ${className}`}
            style={{
              width: i === lines - 1 ? '60%' : '100%',
              height,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${styles['skeleton']} ${variantClass} ${className}`}
      style={{ width, height }}
      data-testid="skeleton"
    />
  );
}
