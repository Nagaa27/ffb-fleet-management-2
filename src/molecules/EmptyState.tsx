// src/molecules/EmptyState.tsx
// Molecule: Empty state placeholder.

import type { LucideIcon } from 'lucide-react';
import { PackageOpen } from 'lucide-react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className={styles['empty-state']} data-testid="empty-state">
      <Icon size={48} className={styles['empty-icon']} />
      <h3 className={styles['empty-title']}>{title}</h3>
      {description && <p className={styles['empty-description']}>{description}</p>}
      {action && <div className={styles['empty-action']}>{action}</div>}
    </div>
  );
}
