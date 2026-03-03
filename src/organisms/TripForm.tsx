// src/organisms/TripForm.tsx
// Organism: Trip creation/scheduling form using React Hook Form + Zod.
// Supports multi-mill selection for collecting from multiple PKS in one trip.

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
  millIds: z.array(z.string()).min(1, 'Pilih minimal 1 pabrik'),
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
      millIds: [] as string[],
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

        <FormField label="Pabrik Tujuan" htmlFor="millIds" required error={errors.millIds?.message}>
          <Controller
            name="millIds"
            control={control}
            render={({ field }) => (
              <div className={styles['mill-checklist']}>
                {mills.map((m) => (
                  <label key={m.id} className={styles['mill-check-item']}>
                    <input
                      type="checkbox"
                      value={m.id}
                      checked={field.value.includes(m.id)}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (e.target.checked) {
                          field.onChange([...field.value, val]);
                        } else {
                          field.onChange(field.value.filter((id: string) => id !== val));
                        }
                      }}
                    />
                    <span>{m.name}</span>
                  </label>
                ))}
                {mills.length === 0 && (
                  <span className={styles['mill-empty']}>Tidak ada pabrik</span>
                )}
              </div>
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
