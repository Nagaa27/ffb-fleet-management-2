// src/organisms/TripForm.tsx
// Organism: Trip creation/scheduling form using React Hook Form + Zod.

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select } from '../atoms';
import { FormField } from '../molecules';
import type { Driver, Vehicle, Mill } from '../types';
import styles from './TripForm.module.css';

const tripSchema = z.object({
  vehicleId: z.string().min(1, 'Pilih kendaraan'),
  driverId: z.string().min(1, 'Pilih pengemudi'),
  scheduledDate: z.string().min(1, 'Pilih tanggal'),
  millId: z.string().min(1, 'Pilih pabrik'),
  plannedWeight: z.coerce.number().min(0.1, 'Berat harus > 0').max(12, 'Maksimal 12 ton'),
  estimatedDuration: z.coerce.number().min(1, 'Durasi harus > 0'),
  notes: z.string().optional(),
});

type TripFormData = z.infer<typeof tripSchema>;

interface TripFormProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  mills: Mill[];
  onSubmit: (data: TripFormData) => void;
  loading?: boolean;
}

export function TripForm({
  vehicles,
  drivers,
  mills,
  onSubmit,
  loading = false,
}: TripFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      vehicleId: '',
      driverId: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      millId: '',
      plannedWeight: 0,
      estimatedDuration: 60,
      notes: '',
    },
  });

  const vehicleOptions = vehicles.map((v) => ({
    value: v.id,
    label: `${v.plateNumber} (${v.type.replace('TRUCK_', '').toLowerCase()})`,
  }));

  const driverOptions = drivers.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const millOptions = mills.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  return (
    <form
      className={styles['trip-form']}
      onSubmit={(e) => { void handleSubmit(onSubmit)(e); }}
      data-testid="trip-form"
    >
      <div className={styles['form-grid']}>
        <FormField label="Kendaraan" htmlFor="vehicleId" required>
          <Controller
            name="vehicleId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={vehicleOptions}
                placeholder="Pilih kendaraan"
                error={errors.vehicleId?.message}
              />
            )}
          />
        </FormField>

        <FormField label="Pengemudi" htmlFor="driverId" required>
          <Controller
            name="driverId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={driverOptions}
                placeholder="Pilih pengemudi"
                error={errors.driverId?.message}
              />
            )}
          />
        </FormField>

        <FormField label="Tanggal" htmlFor="scheduledDate" required>
          <Input
            type="date"
            {...register('scheduledDate')}
            error={errors.scheduledDate?.message}
          />
        </FormField>

        <FormField label="Pabrik Tujuan" htmlFor="millId" required>
          <Controller
            name="millId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={millOptions}
                placeholder="Pilih pabrik"
                error={errors.millId?.message}
              />
            )}
          />
        </FormField>

        <FormField label="Berat Rencana (ton)" htmlFor="plannedWeight" required>
          <Input
            type="number"
            step="0.1"
            {...register('plannedWeight')}
            error={errors.plannedWeight?.message}
          />
        </FormField>

        <FormField label="Estimasi Durasi (menit)" htmlFor="estimatedDuration" required>
          <Input
            type="number"
            {...register('estimatedDuration')}
            error={errors.estimatedDuration?.message}
          />
        </FormField>
      </div>

      <FormField label="Catatan" htmlFor="notes">
        <Input {...register('notes')} placeholder="Catatan opsional..." />
      </FormField>

      <div className={styles['form-actions']}>
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Jadwalkan Trip'}
        </Button>
      </div>
    </form>
  );
}

export type { TripFormData };
