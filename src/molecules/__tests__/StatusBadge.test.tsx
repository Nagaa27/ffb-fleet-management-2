// src/molecules/__tests__/StatusBadge.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from '../StatusBadge';
import { VehicleStatus, DriverStatus, TripStatus } from '../../types/enums';

describe('StatusBadge', () => {
  it('renders vehicle active status', () => {
    render(<StatusBadge status={VehicleStatus.ACTIVE} />);
    expect(screen.getByTestId('badge')).toHaveTextContent('Aktif');
  });

  it('renders vehicle idle status', () => {
    render(<StatusBadge status={VehicleStatus.IDLE} />);
    expect(screen.getByTestId('badge')).toHaveTextContent('Idle');
  });

  it('renders vehicle maintenance status', () => {
    render(<StatusBadge status={VehicleStatus.MAINTENANCE} />);
    expect(screen.getByTestId('badge')).toHaveTextContent('Perawatan');
  });

  it('renders driver available status', () => {
    render(<StatusBadge status={DriverStatus.AVAILABLE} />);
    expect(screen.getByTestId('badge')).toHaveTextContent('Tersedia');
  });

  it('renders driver on duty status', () => {
    render(<StatusBadge status={DriverStatus.ON_DUTY} />);
    expect(screen.getByTestId('badge')).toHaveTextContent('Bertugas');
  });

  it('renders trip scheduled status', () => {
    render(<StatusBadge status={TripStatus.SCHEDULED} />);
    expect(screen.getByTestId('badge')).toHaveTextContent('Dijadwalkan');
  });

  it('renders trip completed status', () => {
    render(<StatusBadge status={TripStatus.COMPLETED} />);
    expect(screen.getByTestId('badge')).toHaveTextContent('Selesai');
  });

  it('renders trip cancelled status', () => {
    render(<StatusBadge status={TripStatus.CANCELLED} />);
    expect(screen.getByTestId('badge')).toHaveTextContent('Dibatalkan');
  });
});
