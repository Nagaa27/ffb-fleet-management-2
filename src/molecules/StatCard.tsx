// src/molecules/StatCard.tsx
// Molecule: Dashboard statistic card with icon, label, and value.

import type { LucideIcon } from 'lucide-react';
import { Card } from '../atoms';
import styles from './StatCard.module.css';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    text: string;
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color = 'primary',
}: StatCardProps) {
  return (
    <Card padding="md">
      <div className={styles['stat-card']} data-testid="stat-card">
        <div className={`${styles['stat-icon']} ${styles[`stat-icon--${color}`]}`}>
          <Icon size={24} />
        </div>
        <div className={styles['stat-content']}>
          <span className={styles['stat-label']}>{label}</span>
          <span className={styles['stat-value']}>{value}</span>
          {trend && (
            <span
              className={`${styles['stat-trend']} ${styles[`stat-trend--${trend.direction}`]}`}
            >
              {trend.text}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
