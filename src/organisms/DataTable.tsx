// src/organisms/DataTable.tsx
// Organism: Reusable data table with sorting and virtual scrolling for large datasets.

import { useState, useMemo, useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { EmptyState, TableSkeleton } from '../molecules';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  /** Estimated row height in px for virtual scrolling (default: 48) */
  rowHeight?: number;
  /** Enable virtual scrolling when row count exceeds this threshold (default: 100) */
  virtualThreshold?: number;
}

type SortDirection = 'asc' | 'desc';

interface SortState {
  column: string;
  direction: SortDirection;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = 'Tidak ada data',
  onRowClick,
  rowHeight = 48,
  virtualThreshold = 100,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const handleSort = useCallback((columnKey: string) => {
    setSort((prev) => {
      if (prev?.column === columnKey) {
        return prev.direction === 'asc'
          ? { column: columnKey, direction: 'desc' }
          : null;
      }
      return { column: columnKey, direction: 'asc' };
    });
  }, []);

  const sortedData = useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.column);
    if (!col) return data;
    return [...data].sort((a, b) => {
      const aVal = String(col.render(a));
      const bVal = String(col.render(b));
      const cmp = aVal.localeCompare(bVal, 'id', { numeric: true });
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [data, sort, columns]);

  const useVirtual = sortedData.length > virtualThreshold;

  const virtualizer = useVirtualizer({
    count: sortedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 20,
  });

  if (loading) {
    return <TableSkeleton rows={5} columns={columns.length} />;
  }

  if (data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  const headerRow = (
    <thead>
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={`${styles['th']} ${col.sortable ? styles['th--sortable'] : ''}`}
            style={col.width ? { width: col.width } : undefined}
            onClick={col.sortable ? () => { handleSort(col.key); } : undefined}
          >
            <span className={styles['th-content']}>
              {col.header}
              {col.sortable && sort?.column === col.key && (
                <span className={styles['sort-icon']}>
                  {sort.direction === 'asc' ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </span>
              )}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );

  if (!useVirtual) {
    return (
      <div className={styles['table-wrapper']} data-testid="data-table">
        <table className={styles['table']}>
          {headerRow}
          <tbody>
            {sortedData.map((row) => (
              <tr
                key={keyExtractor(row)}
                className={`${styles['tr']} ${onRowClick ? styles['tr--clickable'] : ''}`}
                onClick={onRowClick ? () => { onRowClick(row); } : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles['td']}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Virtual scrolling mode
  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={`${styles['table-wrapper']} ${styles['table-wrapper--virtual']}`}
      data-testid="data-table"
    >
      <table className={styles['table']}>
        {headerRow}
        <tbody
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualRow) => {
            const row = sortedData[virtualRow.index]!;
            return (
              <tr
                key={keyExtractor(row)}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={`${styles['tr']} ${styles['tr--virtual']} ${onRowClick ? styles['tr--clickable'] : ''}`}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onClick={onRowClick ? () => { onRowClick(row); } : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles['td']}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
