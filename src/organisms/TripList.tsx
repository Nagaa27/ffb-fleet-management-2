// src/organisms/TripList.tsx
// Organism: Trip data table with status, driver, vehicle info and status actions.

import { Route, Calendar, Play, CheckCircle, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { DataTable } from './DataTable';
import type { Column } from './DataTable';
import { StatusBadge } from '../molecules';
import { Button } from '../atoms';
import { TripStatus } from '../types/enums';
import type { Trip } from '../types';
import styles from './TripList.module.css';

interface TripListProps {
  trips: Trip[];
  loading?: boolean;
  onRowClick?: (trip: Trip) => void;
  onStatusChange?: (tripId: string, newStatus: string) => void;
  expandedTripId?: string | null;
  renderExpandedRow?: (trip: Trip) => React.ReactNode;
}

export function TripList({ trips, loading = false, onRowClick, onStatusChange, expandedTripId, renderExpandedRow }: TripListProps) {
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
    ...(onStatusChange
      ? [
          {
            key: 'actions',
            header: 'Aksi',
            render: (t: Trip) => {
              const handleClick = (e: React.MouseEvent, status: string) => {
                e.stopPropagation();
                onStatusChange(t.id, status);
              };

              if (t.status === TripStatus.SCHEDULED) {
                return (
                  <div className={styles['action-buttons']}>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={(e) => { handleClick(e, TripStatus.IN_PROGRESS); }}
                      title="Mulai Trip"
                    >
                      <Play size={14} /> Mulai
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => { handleClick(e, TripStatus.CANCELLED); }}
                      title="Batalkan Trip"
                    >
                      <XCircle size={14} />
                    </Button>
                  </div>
                );
              }

              if (t.status === TripStatus.IN_PROGRESS) {
                return (
                  <div className={styles['action-buttons']}>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={(e) => { handleClick(e, TripStatus.COMPLETED); }}
                      title="Selesaikan Trip"
                    >
                      <CheckCircle size={14} /> Selesai
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => { handleClick(e, TripStatus.CANCELLED); }}
                      title="Batalkan Trip"
                    >
                      <XCircle size={14} />
                    </Button>
                  </div>
                );
              }

              return <span className={styles['no-action']}>—</span>;
            },
          } as Column<Trip>,
        ]
      : []),
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
        expandedKey={expandedTripId}
        renderExpandedRow={renderExpandedRow}
      />
    </div>
  );
}
