// src/organisms/MillList.tsx
// Organism: Mill data table with location and production info.

import { Factory, MapPin } from 'lucide-react';
import { DataTable } from './DataTable';
import type { Column } from './DataTable';
import type { Mill } from '../types';
import styles from './MillList.module.css';

interface MillListProps {
  mills: Mill[];
  loading?: boolean;
  onRowClick?: (mill: Mill) => void;
}

export function MillList({ mills, loading = false, onRowClick }: MillListProps) {
  const columns: Column<Mill>[] = [
    {
      key: 'name',
      header: 'Nama Pabrik',
      sortable: true,
      render: (m) => (
        <div className={styles['mill-cell']}>
          <Factory size={16} className={styles['mill-icon']} />
          <span className={styles['mill-name']}>{m.name}</span>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Lokasi',
      render: (m) => (
        <div className={styles['location-cell']}>
          <MapPin size={14} className={styles['location-icon']} />
          <span>{m.location.address ?? `${m.location.latitude}, ${m.location.longitude}`}</span>
        </div>
      ),
    },
    {
      key: 'contactPerson',
      header: 'Kontak',
      render: (m) => m.contactPerson,
    },
    {
      key: 'phoneNumber',
      header: 'Telepon',
      render: (m) => m.phoneNumber,
    },
    {
      key: 'avgDailyProduction',
      header: 'Produksi Harian',
      sortable: true,
      render: (m) => `${m.avgDailyProduction} ton`,
    },
  ];

  return (
    <div data-testid="mill-list">
      <DataTable
        columns={columns}
        data={mills}
        keyExtractor={(m) => m.id}
        loading={loading}
        emptyMessage="Belum ada pabrik"
        onRowClick={onRowClick}
      />
    </div>
  );
}
