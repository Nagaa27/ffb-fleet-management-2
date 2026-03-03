// src/molecules/TableSkeleton.tsx
// Molecule: Skeleton placeholder for DataTable loading state.

import { Skeleton } from '../atoms';
import styles from './TableSkeleton.module.css';

interface TableSkeletonProps {
  /** Number of rows to render */
  rows?: number;
  /** Number of columns to render */
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <div className={styles['table-skeleton']} data-testid="table-skeleton">
      {/* Header */}
      <div className={styles['skeleton-header']}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`h-${i}`} height="0.875rem" width={i === 0 ? '6rem' : '5rem'} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className={styles['skeleton-row']}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={`r-${rowIdx}-c-${colIdx}`}
              height="0.875rem"
              width={colIdx === 0 ? '8rem' : `${4 + Math.random() * 3}rem`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
