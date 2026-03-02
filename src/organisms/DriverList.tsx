// src/organisms/DriverList.tsx
// Organism: Driver data table with status and actions.

import { User, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from './DataTable';
import type { Column } from './DataTable';
import { StatusBadge } from '../molecules';
import type { Driver } from '../types';
import styles from './DriverList.module.css';

interface DriverListProps {
  drivers: Driver[];
  loading?: boolean;
  onEdit?: (driver: Driver) => void;
  onDelete?: (driver: Driver) => void;
}

export function DriverList({
  drivers,
  loading = false,
  onEdit,
  onDelete,
}: DriverListProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const columns: Column<Driver>[] = [
    {
      key: 'name',
      header: 'Nama',
      sortable: true,
      render: (d) => (
        <div className={styles['driver-cell']}>
          <User size={16} className={styles['driver-icon']} />
          <span className={styles['driver-name']}>{d.name}</span>
        </div>
      ),
    },
    {
      key: 'licenseNumber',
      header: 'No. SIM',
      sortable: true,
      render: (d) => d.licenseNumber,
    },
    {
      key: 'phoneNumber',
      header: 'Telepon',
      render: (d) => d.phoneNumber,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (d) => <StatusBadge status={d.status} size="sm" />,
    },
    {
      key: 'actions',
      header: '',
      width: '3rem',
      render: (d) => (
        <div className={styles['actions-cell']}>
          <button
            className={styles['menu-trigger']}
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === d.id ? null : d.id);
            }}
            aria-label="Menu aksi"
          >
            <MoreVertical size={16} />
          </button>
          {activeMenu === d.id && (
            <div className={styles['menu-dropdown']}>
              {onEdit && (
                <button
                  className={styles['menu-item']}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(d);
                    setActiveMenu(null);
                  }}
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  className={`${styles['menu-item']} ${styles['menu-item--danger']}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(d);
                    setActiveMenu(null);
                  }}
                >
                  Hapus
                </button>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div data-testid="driver-list">
      <DataTable
        columns={columns}
        data={drivers}
        keyExtractor={(d) => d.id}
        loading={loading}
        emptyMessage="Belum ada pengemudi"
      />
    </div>
  );
}
