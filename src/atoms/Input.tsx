// src/atoms/Input.tsx
// Atom: Text input with label support.

import { forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    const inputClass = [
      styles['input'],
      error ? styles['input--error'] : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles['input-wrapper']}>
        <input
          ref={ref}
          className={inputClass}
          data-testid="input"
          {...props}
        />
        {error && (
          <span className={styles['input-error']} data-testid="input-error">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
