// src/molecules/DashboardSkeleton.tsx
// Molecule: Skeleton placeholder for dashboard loading state.

import { Card, Skeleton } from '../atoms';
import styles from './DashboardSkeleton.module.css';

export function DashboardSkeleton() {
  return (
    <div data-testid="dashboard-skeleton">
      {/* Stats skeleton */}
      <div className={styles['stats-grid']}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} padding="md">
            <div className={styles['stat-skeleton']}>
              <Skeleton variant="rect" width="2.75rem" height="2.75rem" />
              <div className={styles['stat-text']}>
                <Skeleton variant="text" width="6rem" height="0.75rem" />
                <Skeleton variant="text" width="3rem" height="1.5rem" />
                <Skeleton variant="text" width="8rem" height="0.625rem" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detail cards skeleton */}
      <div className={styles['detail-grid']}>
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} padding="md">
            <Skeleton variant="text" width="8rem" height="1.125rem" />
            <div className={styles['detail-rows']}>
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className={styles['detail-row']}>
                  <Skeleton variant="text" width="5rem" height="0.875rem" />
                  <Skeleton variant="text" width="2rem" height="0.875rem" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
