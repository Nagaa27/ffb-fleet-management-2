// src/pages/TripsPage.tsx
// Page: Trip management — list, create, status update, detail view.

import { useEffect, useState, useCallback } from 'react';
import { Plus, Info, AlertTriangle, Package, Calendar, Truck, User, Clock, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTripsThunk, createTripThunk, updateTripStatusThunk, recordCollectionThunk, selectAllTrips, selectTripsLoading } from '../store/tripsSlice';
import { fetchVehiclesThunk, selectAllVehicles } from '../store/vehiclesSlice';
import { fetchDriversThunk, selectAllDrivers } from '../store/driversSlice';
import { fetchMillsThunk, selectAllMills } from '../store/millsSlice';
import { PageLayout } from '../templates';
import { Button, Input } from '../atoms';
import { SearchInput, FormField, StatusBadge } from '../molecules';
import { TripList, TripForm, CollectionForm } from '../organisms';
import type { TripFormData } from '../organisms';
import type { Trip } from '../types';
import { TripStatus } from '../types/enums';
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
  const [cancelTripId, setCancelTripId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

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
      if (newStatus === TripStatus.CANCELLED) {
        setCancelTripId(tripId);
        setCancelReason('');
        return;
      }
      void dispatch(updateTripStatusThunk({ id: tripId, data: { status: newStatus } }));
    },
    [dispatch],
  );

  const handleConfirmCancel = useCallback(() => {
    if (!cancelTripId || !cancelReason.trim()) return;
    void dispatch(
      updateTripStatusThunk({
        id: cancelTripId,
        data: { status: TripStatus.CANCELLED, cancellationReason: cancelReason.trim() },
      }),
    );
    setCancelTripId(null);
    setCancelReason('');
  }, [dispatch, cancelTripId, cancelReason]);

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

  const filteredTrips = trips.filter((t: Trip) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      (t.driver?.name.toLowerCase().includes(q) ?? false) ||
      (t.vehicle?.plateNumber.toLowerCase().includes(q) ?? false)
    );
  });

  const renderExpandedRow = useCallback((trip: Trip) => (
    <div className={styles['detail-section']} data-testid="trip-detail">
      <div className={styles['detail-header']}>
        <h3 className={styles['detail-title']}>
          <Info size={18} />
          Detail Trip — {trip.id.slice(0, 8)}
        </h3>
        <StatusBadge status={trip.status} />
      </div>

      {/* Trip Info Summary */}
      <div className={styles['detail-grid']}>
        <div className={styles['detail-item']}>
          <Calendar size={14} className={styles['detail-icon']} />
          <span className={styles['detail-label']}>Tanggal:</span>
          <span className={styles['detail-value']}>
            {format(parseISO(trip.scheduledDate), 'dd MMMM yyyy', { locale: idLocale })}
          </span>
        </div>
        <div className={styles['detail-item']}>
          <User size={14} className={styles['detail-icon']} />
          <span className={styles['detail-label']}>Pengemudi:</span>
          <span className={styles['detail-value']}>{trip.driver?.name ?? '—'}</span>
        </div>
        <div className={styles['detail-item']}>
          <Truck size={14} className={styles['detail-icon']} />
          <span className={styles['detail-label']}>Kendaraan:</span>
          <span className={styles['detail-value']}>{trip.vehicle?.plateNumber ?? '—'}</span>
        </div>
        <div className={styles['detail-item']}>
          <Clock size={14} className={styles['detail-icon']} />
          <span className={styles['detail-label']}>Estimasi:</span>
          <span className={styles['detail-value']}>{trip.estimatedDuration} menit</span>
        </div>
        {trip.notes && (
          <div className={styles['detail-item']}>
            <FileText size={14} className={styles['detail-icon']} />
            <span className={styles['detail-label']}>Catatan:</span>
            <span className={styles['detail-value']}>{trip.notes}</span>
          </div>
        )}
      </div>

      {/* Planned Weight Distribution */}
      {trip.collections.length > 0 && (
        <div className={styles['weight-section']}>
          <h4 className={styles['weight-title']}>
            <Package size={16} />
            Distribusi Berat ke {trip.collections.length} Pabrik
          </h4>
          <div className={styles['weight-summary']}>
            <span className={styles['weight-total']}>
              Total Rencana: {trip.collections.reduce((sum, c) => sum + c.plannedWeight, 0).toFixed(2)} ton
            </span>
            {trip.collections.some((c) => c.actualWeight !== null) && (
              <span className={styles['weight-actual-total']}>
                Total Aktual: {trip.collections.reduce((sum, c) => sum + (c.actualWeight ?? 0), 0).toFixed(2)} ton
              </span>
            )}
          </div>
          <table className={styles['weight-table']}>
            <thead>
              <tr>
                <th>Pabrik</th>
                <th>Rencana (ton)</th>
                <th>Aktual (ton)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trip.collections.map((c) => (
                <tr key={c.id} className={c.actualWeight !== null ? styles['row-recorded'] : ''}>
                  <td>{c.mill?.name ?? c.millId}</td>
                  <td>{c.plannedWeight}</td>
                  <td>{c.actualWeight !== null ? c.actualWeight : '—'}</td>
                  <td>
                    {c.actualWeight !== null
                      ? <span className={styles['status-recorded']}>Tercatat</span>
                      : <span className={styles['status-pending']}>Belum dicatat</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Collection Form — only for IN_PROGRESS trips */}
      {trip.status === TripStatus.IN_PROGRESS && (
        <CollectionForm
          tripId={trip.id}
          collections={trip.collections}
          onRecord={(tripId, millId, weight, notes) => { void handleRecordCollection(tripId, millId, weight, notes); }}
          loading={recording}
        />
      )}

      {/* Cancellation Info — only for CANCELLED trips */}
      {trip.status === TripStatus.CANCELLED && (
        <div className={styles['cancel-info']}>
          <AlertTriangle size={16} className={styles['cancel-info-icon']} />
          <div>
            <strong>Trip Dibatalkan</strong>
            {trip.cancellationReason && (
              <p className={styles['cancel-info-reason']}>Alasan: {trip.cancellationReason}</p>
            )}
            {trip.cancelledAt && (
              <p className={styles['cancel-info-date']}>
                Pada: {format(parseISO(trip.cancelledAt), 'dd MMM yyyy HH:mm', { locale: idLocale })}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  ), [recording, handleRecordCollection]);

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
        expandedTripId={selectedTripId}
        renderExpandedRow={renderExpandedRow}
      />

      {cancelTripId !== null && (
        <div className={styles['cancel-overlay']} data-testid="cancel-dialog">
          <div className={styles['cancel-dialog']}>
            <h3 className={styles['cancel-title']}>Batalkan Trip</h3>
            <p className={styles['cancel-message']}>Masukkan alasan pembatalan trip ini:</p>
            <FormField label="Alasan Pembatalan" htmlFor="cancel-reason" required>
              <Input
                value={cancelReason}
                onChange={(e) => { setCancelReason(e.target.value); }}
                placeholder="Contoh: Kendaraan rusak, cuaca buruk..."
              />
            </FormField>
            <div className={styles['cancel-actions']}>
              <Button variant="secondary" onClick={() => { setCancelTripId(null); setCancelReason(''); }}>
                Kembali
              </Button>
              <Button variant="danger" disabled={!cancelReason.trim()} onClick={handleConfirmCancel}>
                Batalkan Trip
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
