// src/organisms/DataTable.tsx
// Organism: Reusable data table with sorting, virtual scrolling support.

import { useState, useMemo, useCallback } from 'react';
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
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(null);

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

  if (loading) {
    return <TableSkeleton rows={5} columns={columns.length} />;
  }

  if (data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className={styles['table-wrapper']} data-testid="data-table">
      <table className={styles['table']}>
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
