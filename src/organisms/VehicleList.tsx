// src/organisms/VehicleList.tsx
// Organism: Vehicle data table with status badges and actions.

import { Truck, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from './DataTable';
import type { Column } from './DataTable';
import { StatusBadge } from '../molecules';
import type { Vehicle } from '../types';
import styles from './VehicleList.module.css';

interface VehicleListProps {
  vehicles: Vehicle[];
  loading?: boolean;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  onAssignDriver?: (vehicle: Vehicle) => void;
}

const vehicleTypeLabels: Record<string, string> = {
  TRUCK_SMALL: 'Truk Kecil',
  TRUCK_MEDIUM: 'Truk Sedang',
  TRUCK_LARGE: 'Truk Besar',
};

export function VehicleList({
  vehicles,
  loading = false,
  onEdit,
  onDelete,
  onAssignDriver,
}: VehicleListProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const columns: Column<Vehicle>[] = [
    {
      key: 'plateNumber',
      header: 'Plat Nomor',
      sortable: true,
      render: (v) => (
        <div className={styles['vehicle-cell']}>
          <Truck size={16} className={styles['vehicle-icon']} />
          <span className={styles['vehicle-plate']}>{v.plateNumber}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tipe',
      sortable: true,
      render: (v) => vehicleTypeLabels[v.type] ?? v.type,
    },
    {
      key: 'capacity',
      header: 'Kapasitas',
      sortable: true,
      render: (v) => `${v.capacity} ton`,
    },
    {
      key: 'driver',
      header: 'Pengemudi',
      render: (v) => v.driver?.name ?? '—',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (v) => <StatusBadge status={v.status} size="sm" />,
    },
    {
      key: 'actions',
      header: '',
      width: '3rem',
      render: (v) => (
        <div className={styles['actions-cell']}>
          <button
            className={styles['menu-trigger']}
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === v.id ? null : v.id);
            }}
            aria-label="Menu aksi"
          >
            <MoreVertical size={16} />
          </button>
          {activeMenu === v.id && (
            <div className={styles['menu-dropdown']}>
              {onAssignDriver && (
                <button
                  className={styles['menu-item']}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssignDriver(v);
                    setActiveMenu(null);
                  }}
                >
                  Assign Pengemudi
                </button>
              )}
              {onEdit && (
                <button
                  className={styles['menu-item']}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(v);
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
                    onDelete(v);
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
    <div data-testid="vehicle-list">
      <DataTable
        columns={columns}
        data={vehicles}
        keyExtractor={(v) => v.id}
        loading={loading}
        emptyMessage="Belum ada kendaraan"
      />
    </div>
  );
}
