// src/atoms/Spinner.tsx
// Atom: Loading spinner.

import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div
      className={`${styles['spinner']} ${styles[`spinner--${size}`]}`}
      data-testid="spinner"
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
