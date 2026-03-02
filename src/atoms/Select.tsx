// src/atoms/Select.tsx
// Atom: Select dropdown.

import { forwardRef } from 'react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error, className, ...props }, ref) => {
    const selectClass = [
      styles['select'],
      error ? styles['select--error'] : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles['select-wrapper']}>
        <select ref={ref} className={selectClass} data-testid="select" {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span className={styles['select-error']} data-testid="select-error">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
