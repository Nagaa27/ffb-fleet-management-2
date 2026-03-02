// src/atoms/Button.tsx
// Atom: Base button component with variants.

import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  fullWidth = false,
  onClick,
}: ButtonProps) {
  const className = [
    styles['button'],
    styles[`button--${variant}`],
    styles[`button--${size}`],
    fullWidth ? styles['button--full'] : '',
    disabled ? styles['button--disabled'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={className}
      type={type}
      disabled={disabled}
      onClick={onClick}
      data-testid="button"
    >
      {children}
    </button>
  );
}
