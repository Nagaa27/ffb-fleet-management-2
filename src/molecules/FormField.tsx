// src/molecules/FormField.tsx
// Molecule: Label + Input/Select wrapper for forms.

import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, required = false, error, children }: FormFieldProps) {
  return (
    <div className={styles['form-field']} data-testid="form-field">
      <label className={styles['form-label']} htmlFor={htmlFor}>
        {label}
        {required && <span className={styles['form-required']}>*</span>}
      </label>
      {children}
      {error && <span className={styles['form-error']}>{error}</span>}
    </div>
  );
}
