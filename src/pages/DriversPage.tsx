// src/pages/DriversPage.tsx
// Page: Driver management — list, create, edit, delete.

import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchDriversThunk,
  createDriverThunk,
  deleteDriverThunk,
  selectAllDrivers,
  selectDriversLoading,
} from '../store/driversSlice';
import { PageLayout } from '../templates';
import { Button, Input, Card } from '../atoms';
import { FormField, SearchInput, ConfirmDialog } from '../molecules';
import { DriverList } from '../organisms';
import type { Driver } from '../types';
import styles from './DriversPage.module.css';

const driverSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  licenseNumber: z.string().min(1, 'No. SIM wajib diisi'),
  phoneNumber: z.string().min(1, 'No. telepon wajib diisi'),
});

type DriverFormData = z.infer<typeof driverSchema>;

export function DriversPage() {
  const dispatch = useAppDispatch();
  const drivers = useAppSelector(selectAllDrivers);
  const loading = useAppSelector(selectDriversLoading);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Driver | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: { name: '', licenseNumber: '', phoneNumber: '' },
  });

  useEffect(() => {
    void dispatch(fetchDriversThunk());
  }, [dispatch]);

  const onSubmit = useCallback(
    async (data: DriverFormData) => {
      await dispatch(createDriverThunk(data)).unwrap();
      reset();
      setShowForm(false);
    },
    [dispatch, reset],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await dispatch(deleteDriverThunk(deleteTarget.id)).unwrap();
    setDeleteTarget(null);
  }, [dispatch, deleteTarget]);

  const filteredDrivers = drivers.filter((d: Driver) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.licenseNumber.toLowerCase().includes(q) ||
      d.phoneNumber.includes(q)
    );
  });

  return (
    <PageLayout
      title="Manajemen Pengemudi"
      subtitle="Kelola data pengemudi armada"
      actions={
        <Button onClick={() => { setShowForm(!showForm); }}>
          <Plus size={18} />
          {showForm ? 'Tutup Form' : 'Tambah Pengemudi'}
        </Button>
      }
    >
      {showForm && (
        <Card padding="md">
          <form
            className={styles['driver-form']}
            onSubmit={(e) => { void handleSubmit(onSubmit)(e); }}
          >
            <div className={styles['form-grid']}>
              <FormField label="Nama Lengkap" htmlFor="name" required>
                <Input {...register('name')} placeholder="Budi Santoso" error={errors.name?.message} />
              </FormField>
              <FormField label="No. SIM" htmlFor="licenseNumber" required>
                <Input {...register('licenseNumber')} placeholder="SIM-0001" error={errors.licenseNumber?.message} />
              </FormField>
              <FormField label="No. Telepon" htmlFor="phoneNumber" required>
                <Input {...register('phoneNumber')} placeholder="0812-3456-7890" error={errors.phoneNumber?.message} />
              </FormField>
            </div>
            <div className={styles['form-actions']}>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Card>
      )}

      <SearchInput value={search} onChange={setSearch} placeholder="Cari pengemudi..." />

      <DriverList
        drivers={filteredDrivers}
        loading={loading}
        onDelete={(d) => { setDeleteTarget(d); }}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Hapus Pengemudi"
        message={`Apakah Anda yakin ingin menghapus pengemudi ${deleteTarget?.name ?? ''}?`}
        variant="danger"
        confirmLabel="Hapus"
        onConfirm={() => { void handleDelete(); }}
        onCancel={() => { setDeleteTarget(null); }}
      />
    </PageLayout>
  );
}
