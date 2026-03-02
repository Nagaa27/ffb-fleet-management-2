// src/organisms/TripList.tsx
// Organism: Trip data table with status, driver, vehicle info.

import { Route, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { DataTable } from './DataTable';
import type { Column } from './DataTable';
import { StatusBadge } from '../molecules';
import type { Trip } from '../types';
import styles from './TripList.module.css';

interface TripListProps {
  trips: Trip[];
  loading?: boolean;
  onRowClick?: (trip: Trip) => void;
}

export function TripList({ trips, loading = false, onRowClick }: TripListProps) {
  const columns: Column<Trip>[] = [
    {
      key: 'id',
      header: 'ID Trip',
      render: (t) => (
        <div className={styles['trip-cell']}>
          <Route size={16} className={styles['trip-icon']} />
          <span className={styles['trip-id']}>{t.id.slice(0, 8)}</span>
        </div>
      ),
    },
    {
      key: 'scheduledDate',
      header: 'Tanggal',
      sortable: true,
      render: (t) => (
        <div className={styles['date-cell']}>
          <Calendar size={14} className={styles['date-icon']} />
          <span>{format(parseISO(t.scheduledDate), 'dd MMM yyyy', { locale: idLocale })}</span>
        </div>
      ),
    },
    {
      key: 'driver',
      header: 'Pengemudi',
      sortable: true,
      render: (t) => t.driver?.name ?? '—',
    },
    {
      key: 'vehicle',
      header: 'Kendaraan',
      render: (t) => t.vehicle?.plateNumber ?? '—',
    },
    {
      key: 'collections',
      header: 'Pabrik',
      render: (t) => `${t.collections.length} pabrik`,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (t) => <StatusBadge status={t.status} size="sm" />,
    },
  ];

  return (
    <div data-testid="trip-list">
      <DataTable
        columns={columns}
        data={trips}
        keyExtractor={(t) => t.id}
        loading={loading}
        emptyMessage="Belum ada trip"
        onRowClick={onRowClick}
      />
    </div>
  );
}
