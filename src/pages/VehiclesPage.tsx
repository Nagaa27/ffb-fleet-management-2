// src/pages/VehiclesPage.tsx
// Page: Vehicle management — list, create, edit, delete.

import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchVehiclesThunk,
  createVehicleThunk,
  deleteVehicleThunk,
  selectAllVehicles,
  selectVehiclesLoading,
} from '../store/vehiclesSlice';
import { PageLayout } from '../templates';
import { Button, Input, Select, Card } from '../atoms';
import { FormField, SearchInput, ConfirmDialog } from '../molecules';
import { VehicleList } from '../organisms';
import { VehicleType } from '../types/enums';
import type { Vehicle } from '../types';
import styles from './VehiclesPage.module.css';

const vehicleSchema = z.object({
  plateNumber: z.string().min(1, 'Plat nomor wajib diisi'),
  type: z.nativeEnum(VehicleType, { errorMap: () => ({ message: 'Pilih tipe kendaraan' }) }),
  capacity: z.coerce.number().min(1, 'Kapasitas minimal 1 ton').max(12, 'Kapasitas maksimal 12 ton'),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export function VehiclesPage() {
  const dispatch = useAppDispatch();
  const vehicles = useAppSelector(selectAllVehicles);
  const loading = useAppSelector(selectVehiclesLoading);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { plateNumber: '', type: VehicleType.TRUCK_MEDIUM, capacity: 8 },
  });

  useEffect(() => {
    void dispatch(fetchVehiclesThunk());
  }, [dispatch]);

  const onSubmit = useCallback(
    async (data: VehicleFormData) => {
      await dispatch(createVehicleThunk(data)).unwrap();
      reset();
      setShowForm(false);
    },
    [dispatch, reset],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await dispatch(deleteVehicleThunk(deleteTarget.id)).unwrap();
    setDeleteTarget(null);
  }, [dispatch, deleteTarget]);

  const filteredVehicles = vehicles.filter((v: Vehicle) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      v.plateNumber.toLowerCase().includes(q) ||
      v.type.toLowerCase().includes(q) ||
      (v.driver?.name.toLowerCase().includes(q) ?? false)
    );
  });

  const vehicleTypeOptions = [
    { value: VehicleType.TRUCK_SMALL, label: 'Truk Kecil (< 8 ton)' },
    { value: VehicleType.TRUCK_MEDIUM, label: 'Truk Sedang (8-12 ton)' },
    { value: VehicleType.TRUCK_LARGE, label: 'Truk Besar (> 12 ton)' },
  ];

  return (
    <PageLayout
      title="Manajemen Kendaraan"
      subtitle="Kelola data kendaraan pengangkut TBS"
      actions={
        <Button onClick={() => { setShowForm(!showForm); }}>
          <Plus size={18} />
          {showForm ? 'Tutup Form' : 'Tambah Kendaraan'}
        </Button>
      }
    >
      {showForm && (
        <Card padding="md">
          <form
            className={styles['vehicle-form']}
            onSubmit={(e) => { void handleSubmit(onSubmit)(e); }}
          >
            <div className={styles['form-grid']}>
              <FormField label="Plat Nomor" htmlFor="plateNumber" required>
                <Input {...register('plateNumber')} placeholder="BK 1234 XX" error={errors.plateNumber?.message} />
              </FormField>
              <FormField label="Tipe Kendaraan" htmlFor="type" required>
                <Select {...register('type')} options={vehicleTypeOptions} error={errors.type?.message} />
              </FormField>
              <FormField label="Kapasitas (ton)" htmlFor="capacity" required>
                <Input type="number" {...register('capacity')} error={errors.capacity?.message} />
              </FormField>
            </div>
            <div className={styles['form-actions']}>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Card>
      )}

      <SearchInput value={search} onChange={setSearch} placeholder="Cari kendaraan..." />

      <VehicleList
        vehicles={filteredVehicles}
        loading={loading}
        onDelete={(v) => { setDeleteTarget(v); }}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Hapus Kendaraan"
        message={`Apakah Anda yakin ingin menghapus kendaraan ${deleteTarget?.plateNumber ?? ''}?`}
        variant="danger"
        confirmLabel="Hapus"
        onConfirm={() => { void handleDelete(); }}
        onCancel={() => { setDeleteTarget(null); }}
      />
    </PageLayout>
  );
}
