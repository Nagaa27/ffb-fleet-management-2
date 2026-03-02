// src/molecules/StatusBadge.tsx
// Molecule: Maps entity status enums to Badge variants.

import { Badge } from '../atoms';
import { VehicleStatus, DriverStatus, TripStatus } from '../types/enums';

type StatusType = VehicleStatus | DriverStatus | TripStatus;

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' }> = {
  // Vehicle statuses
  [VehicleStatus.IDLE]: { label: 'Idle', variant: 'neutral' },
  [VehicleStatus.ACTIVE]: { label: 'Aktif', variant: 'success' },
  [VehicleStatus.MAINTENANCE]: { label: 'Perawatan', variant: 'warning' },

  // Driver statuses
  [DriverStatus.AVAILABLE]: { label: 'Tersedia', variant: 'success' },
  [DriverStatus.ON_DUTY]: { label: 'Bertugas', variant: 'info' },
  [DriverStatus.OFF_DUTY]: { label: 'Libur', variant: 'neutral' },
  [DriverStatus.SICK_LEAVE]: { label: 'Sakit', variant: 'error' },

  // Trip statuses
  [TripStatus.SCHEDULED]: { label: 'Dijadwalkan', variant: 'info' },
  [TripStatus.IN_PROGRESS]: { label: 'Berjalan', variant: 'warning' },
  [TripStatus.COMPLETED]: { label: 'Selesai', variant: 'success' },
  [TripStatus.CANCELLED]: { label: 'Dibatalkan', variant: 'error' },
};

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) {
    return <Badge label={status} variant="neutral" size={size} />;
  }
  return <Badge label={config.label} variant={config.variant} size={size} />;
}
