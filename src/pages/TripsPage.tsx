// src/pages/TripsPage.tsx
// Page: Trip management — list, create, status update.

import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTripsThunk, createTripThunk, updateTripStatusThunk, recordCollectionThunk, selectAllTrips, selectTripsLoading } from '../store/tripsSlice';
import { fetchVehiclesThunk, selectAllVehicles } from '../store/vehiclesSlice';
import { fetchDriversThunk, selectAllDrivers } from '../store/driversSlice';
import { fetchMillsThunk, selectAllMills } from '../store/millsSlice';
import { PageLayout } from '../templates';
import { Button } from '../atoms';
import { SearchInput } from '../molecules';
import { TripList, TripForm, CollectionForm } from '../organisms';
import type { TripFormData } from '../organisms';
import type { Trip } from '../types';
import styles from './TripsPage.module.css';

export function TripsPage() {
  const dispatch = useAppDispatch();
  const trips = useAppSelector(selectAllTrips);
  const loading = useAppSelector(selectTripsLoading);
  const vehicles = useAppSelector(selectAllVehicles);
  const drivers = useAppSelector(selectAllDrivers);
  const mills = useAppSelector(selectAllMills);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    void dispatch(fetchTripsThunk({}));
    void dispatch(fetchVehiclesThunk());
    void dispatch(fetchDriversThunk());
    void dispatch(fetchMillsThunk());
  }, [dispatch]);

  const handleCreate = useCallback(
    async (data: TripFormData) => {
      setCreating(true);
      try {
        const weightPerMill: Record<string, number> = {};
        const perMill = data.plannedWeight / data.millIds.length;
        for (const id of data.millIds) {
          weightPerMill[id] = Math.round(perMill * 100) / 100;
        }
        await dispatch(
          createTripThunk({
            vehicleId: data.vehicleId,
            driverId: data.driverId,
            millIds: data.millIds,
            scheduledDate: data.scheduledDate,
            plannedWeightPerMill: weightPerMill,
            estimatedDuration: data.estimatedDuration,
            notes: data.notes,
          }),
        ).unwrap();
        setShowForm(false);
      } finally {
        setCreating(false);
      }
    },
    [dispatch],
  );

  const handleStatusChange = useCallback(
    (tripId: string, newStatus: string) => {
      void dispatch(updateTripStatusThunk({ id: tripId, data: { status: newStatus } }));
    },
    [dispatch],
  );

  const handleRecordCollection = useCallback(
    async (tripId: string, millId: string, actualWeight: number, notes?: string) => {
      setRecording(true);
      try {
        await dispatch(recordCollectionThunk({ tripId, data: { millId, actualWeight, notes } })).unwrap();
      } finally {
        setRecording(false);
      }
    },
    [dispatch],
  );

  const selectedTrip = selectedTripId ? trips.find((t: Trip) => t.id === selectedTripId) ?? null : null;

  const filteredTrips = trips.filter((t: Trip) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      (t.driver?.name.toLowerCase().includes(q) ?? false) ||
      (t.vehicle?.plateNumber.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <PageLayout
      title="Manajemen Trip"
      subtitle="Kelola jadwal dan status pengiriman TBS"
      actions={
        <Button onClick={() => { setShowForm(!showForm); }}>
          <Plus size={18} />
          {showForm ? 'Tutup Form' : 'Trip Baru'}
        </Button>
      }
    >
      {showForm && (
        <div className={styles['form-section']}>
          <TripForm
            vehicles={vehicles}
            drivers={drivers}
            mills={mills}
            onSubmit={(data) => { void handleCreate(data); }}
            loading={creating}
          />
        </div>
      )}

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Cari trip berdasarkan ID, pengemudi, atau kendaraan..."
      />

      <TripList
        trips={filteredTrips}
        loading={loading}
        onStatusChange={handleStatusChange}
        onRowClick={(trip: Trip) => { setSelectedTripId(trip.id === selectedTripId ? null : trip.id); }}
      />

      {selectedTrip && selectedTrip.status === 'IN_PROGRESS' && (
        <div className={styles['collection-section']}>
          <CollectionForm
            tripId={selectedTrip.id}
            collections={selectedTrip.collections}
            onRecord={(tripId, millId, weight, notes) => { void handleRecordCollection(tripId, millId, weight, notes); }}
            loading={recording}
          />
        </div>
      )}
    </PageLayout>
  );
}
