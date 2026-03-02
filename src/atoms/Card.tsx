// src/atoms/Card.tsx
// Atom: Card container.

import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Card({ children, padding = 'md', className }: CardProps) {
  const cardClass = [
    styles['card'],
    styles[`card--${padding}`],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass} data-testid="card">
      {children}
    </div>
  );
}
