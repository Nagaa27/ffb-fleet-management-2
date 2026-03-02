// src/atoms/Badge.tsx
// Atom: Status badge with color variants.

import styles from './Badge.module.css';

interface BadgeProps {
  label: string;
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ label, variant, size = 'md' }: BadgeProps) {
  const className = [
    styles['badge'],
    styles[`badge--${variant}`],
    styles[`badge--${size}`],
  ].join(' ');

  return (
    <span className={className} data-testid="badge">
      {label}
    </span>
  );
}
