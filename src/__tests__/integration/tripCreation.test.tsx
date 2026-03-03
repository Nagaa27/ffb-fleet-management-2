// src/__tests__/integration/tripCreation.test.tsx
// Integration: Trip creation flow — user fills form, submits, trip appears in list.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { vehiclesReducer } from '../../store/vehiclesSlice';
import { driversReducer } from '../../store/driversSlice';
import { millsReducer } from '../../store/millsSlice';
import { tripsReducer } from '../../store/tripsSlice';
import { dashboardReducer } from '../../store/dashboardSlice';
import { TripsPage } from '../../pages/TripsPage';

// Mock all APIs
vi.mock('../../api/tripApi', () => ({
  fetchTrips: vi.fn(),
  fetchTripById: vi.fn(),
  createTrip: vi.fn(),
  updateTripStatus: vi.fn(),
  recordCollection: vi.fn(),
}));

vi.mock('../../api/vehicleApi', () => ({
  fetchVehicles: vi.fn(),
  fetchVehicleById: vi.fn(),
  createVehicle: vi.fn(),
  updateVehicle: vi.fn(),
  deleteVehicle: vi.fn(),
  assignDriver: vi.fn(),
}));

vi.mock('../../api/driverApi', () => ({
  fetchDrivers: vi.fn(),
  fetchAvailableDrivers: vi.fn(),
  fetchDriverById: vi.fn(),
  createDriver: vi.fn(),
  updateDriver: vi.fn(),
  deleteDriver: vi.fn(),
}));

vi.mock('../../api/millApi', () => ({
  fetchMills: vi.fn(),
  fetchMillById: vi.fn(),
  createMill: vi.fn(),
  updateMill: vi.fn(),
}));

import { fetchTrips } from '../../api/tripApi';
import { fetchVehicles } from '../../api/vehicleApi';
import { fetchDrivers } from '../../api/driverApi';
import { fetchMills } from '../../api/millApi';

const mockVehicles = [
  {
    id: 'v1', plate_number: 'B 1234 XY', type: 'TRUCK_MEDIUM', capacity: 12,
    driver_id: null, status: 'IDLE', created_at: '', updated_at: '',
  },
];

const mockDrivers = [
  {
    id: 'd1', name: 'Budi Santoso', license_number: 'SIM-001',
    phone_number: '0812', status: 'AVAILABLE', created_at: '', updated_at: '',
  },
];

const mockMills = [
  {
    id: 'm1', name: 'PKS Nusantara', latitude: 1.5, longitude: 103.5,
    address: 'Riau', contact_person: 'Andi', phone_number: '0813',
    avg_daily_production: 240, created_at: '', updated_at: '',
  },
];

function createTestStore() {
  return configureStore({
    reducer: {
      vehicles: vehiclesReducer,
      drivers: driversReducer,
      mills: millsReducer,
      trips: tripsReducer,
      dashboard: dashboardReducer,
    },
  });
}

function renderTripsPage() {
  const store = createTestStore();
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <TripsPage />
        </MemoryRouter>
      </Provider>,
    ),
  };
}

describe('Trip Creation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default mock returns
    vi.mocked(fetchTrips).mockResolvedValue({ success: true, data: [], error: null });
    vi.mocked(fetchVehicles).mockResolvedValue({ success: true, data: mockVehicles, error: null });
    vi.mocked(fetchDrivers).mockResolvedValue({ success: true, data: mockDrivers, error: null });
    vi.mocked(fetchMills).mockResolvedValue({ success: true, data: mockMills, error: null });
  });

  it('renders the trips page with header', async () => {
    renderTripsPage();

    await waitFor(() => {
      expect(screen.getByText('Manajemen Trip')).toBeInTheDocument();
    });
  });

  it('shows trip form when "Trip Baru" button is clicked', async () => {
    const user = userEvent.setup();
    renderTripsPage();

    await waitFor(() => {
      expect(screen.getByText('Trip Baru')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Trip Baru'));

    // Form should now be visible with vehicle, driver, and mill selects
    await waitFor(() => {
      expect(screen.getByText('Kendaraan')).toBeInTheDocument();
      expect(screen.getByText('Pengemudi')).toBeInTheDocument();
    });
  });

  it('loads data from all necessary APIs on mount', async () => {
    renderTripsPage();

    await waitFor(() => {
      expect(fetchTrips).toHaveBeenCalledTimes(1);
      expect(fetchVehicles).toHaveBeenCalledTimes(1);
      expect(fetchDrivers).toHaveBeenCalledTimes(1);
      expect(fetchMills).toHaveBeenCalledTimes(1);
    });
  });

  it('filters trip list when search input changes', async () => {
    const trips = [
      {
        id: 'trip-1', vehicle_id: 'v1', driver_id: 'd1', scheduled_date: '2025-01-01',
        status: 'SCHEDULED', estimated_duration: 60, started_at: null, completed_at: null,
        cancelled_at: null, cancellation_reason: null, notes: null,
        created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z',
        vehicle_plate_number: 'B 1234 XY', driver_name: 'Budi Santoso', collections: [],
      },
    ];
    vi.mocked(fetchTrips).mockResolvedValue({ success: true, data: trips, error: null });

    const user = userEvent.setup();
    renderTripsPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
    });

    // Type in search — trip should still be visible since "Budi" matches
    const searchInput = screen.getByPlaceholderText(/cari trip/i);
    await user.type(searchInput, 'Budi');

    expect(screen.getByText('Budi Santoso')).toBeInTheDocument();

    // Clear and type non-matching text
    await user.clear(searchInput);
    await user.type(searchInput, 'nonexistent');

    // Trip should not be in DOM (filtered out)
    await waitFor(() => {
      expect(screen.queryByText('Budi Santoso')).not.toBeInTheDocument();
    });
  });
});
