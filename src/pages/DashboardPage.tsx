// src/pages/DashboardPage.tsx
// Page: Dashboard with summary stats and charts.

import { useEffect, useMemo } from 'react';
import { Truck, Users, Route, Weight } from 'lucide-react';
import { format } from 'date-fns';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDashboardThunk, selectDashboard, selectDashboardLoading } from '../store/dashboardSlice';
import { PageLayout } from '../templates';
import { Card } from '../atoms';
import { StatCard, DashboardSkeleton } from '../molecules';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector(selectDashboard);
  const loading = useAppSelector(selectDashboardLoading);

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    void dispatch(fetchDashboardThunk(today));
  }, [dispatch]);

  const VEHICLE_COLORS = ['#2563eb', '#f59e0b', '#ef4444'];
  const TRIP_COLORS = ['#6366f1', '#3b82f6', '#22c55e'];

  const vehiclePieData = useMemo(() => [
    { name: 'Aktif', value: dashboard?.activeVehicles ?? 0 },
    { name: 'Idle', value: dashboard?.idleVehicles ?? 0 },
    { name: 'Perawatan', value: dashboard?.maintenanceVehicles ?? 0 },
  ], [dashboard]);

  const tripBarData = useMemo(() => [
    { name: 'Dijadwalkan', jumlah: dashboard?.todayScheduled ?? 0 },
    { name: 'Berjalan', jumlah: dashboard?.todayInProgress ?? 0 },
    { name: 'Selesai', jumlah: dashboard?.todayCompleted ?? 0 },
  ], [dashboard]);

  return (
    <PageLayout
      title="Dashboard"
      subtitle={`Ringkasan operasional — ${format(new Date(), 'dd MMMM yyyy')}`}
    >
      {loading && !dashboard ? (
        <DashboardSkeleton />
      ) : (
        <>
      <div className={styles['stats-grid']}>
        <StatCard
          icon={Truck}
          label="Total Kendaraan"
          value={dashboard?.totalVehicles ?? 0}
          color="primary"
          trend={{
            direction: 'neutral',
            text: `${dashboard?.activeVehicles ?? 0} aktif, ${dashboard?.idleVehicles ?? 0} idle`,
          }}
        />
        <StatCard
          icon={Users}
          label="Pengemudi Tersedia"
          value={dashboard?.availableDrivers ?? 0}
          color="success"
          trend={{
            direction: 'neutral',
            text: `${dashboard?.onDutyDrivers ?? 0} bertugas`,
          }}
        />
        <StatCard
          icon={Route}
          label="Trip Hari Ini"
          value={
            (dashboard?.todayScheduled ?? 0) +
            (dashboard?.todayInProgress ?? 0) +
            (dashboard?.todayCompleted ?? 0)
          }
          color="info"
          trend={{
            direction: 'neutral',
            text: `${dashboard?.todayCompleted ?? 0} selesai, ${dashboard?.todayInProgress ?? 0} berjalan`,
          }}
        />
        <StatCard
          icon={Weight}
          label="Tonase Terkumpul"
          value={`${(dashboard?.todayCollectedTons ?? 0).toFixed(1)} ton`}
          color="warning"
          trend={{
            direction:
              (dashboard?.todayCollectedTons ?? 0) >= (dashboard?.todayTargetTons ?? 1) * 0.8
                ? 'up'
                : 'down',
            text: `Target: ${dashboard?.todayTargetTons ?? 0} ton`,
          }}
        />
      </div>

      <div className={styles['detail-grid']}>
        <Card padding="md">
          <h3 className={styles['section-title']}>Status Kendaraan</h3>
          <div className={styles['detail-list']}>
            <div className={styles['detail-row']}>
              <span className={styles['detail-label']}>Aktif</span>
              <span className={styles['detail-value']}>{dashboard?.activeVehicles ?? 0}</span>
            </div>
            <div className={styles['detail-row']}>
              <span className={styles['detail-label']}>Idle</span>
              <span className={styles['detail-value']}>{dashboard?.idleVehicles ?? 0}</span>
            </div>
            <div className={styles['detail-row']}>
              <span className={styles['detail-label']}>Perawatan</span>
              <span className={styles['detail-value']}>{dashboard?.maintenanceVehicles ?? 0}</span>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <h3 className={styles['section-title']}>Trip Hari Ini</h3>
          <div className={styles['detail-list']}>
            <div className={styles['detail-row']}>
              <span className={styles['detail-label']}>Dijadwalkan</span>
              <span className={styles['detail-value']}>{dashboard?.todayScheduled ?? 0}</span>
            </div>
            <div className={styles['detail-row']}>
              <span className={styles['detail-label']}>Berjalan</span>
              <span className={styles['detail-value']}>{dashboard?.todayInProgress ?? 0}</span>
            </div>
            <div className={styles['detail-row']}>
              <span className={styles['detail-label']}>Selesai</span>
              <span className={styles['detail-value']}>{dashboard?.todayCompleted ?? 0}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className={styles['chart-grid']}>
        <Card padding="md">
          <h3 className={styles['section-title']}>Status Kendaraan</h3>
          <div className={styles['chart-container']}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vehiclePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {vehiclePieData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={VEHICLE_COLORS[idx % VEHICLE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="md">
          <h3 className={styles['section-title']}>Trip Hari Ini</h3>
          <div className={styles['chart-container']}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tripBarData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="jumlah" radius={[4, 4, 0, 0]}>
                  {tripBarData.map((_, idx) => (
                    <Cell key={`bar-${idx}`} fill={TRIP_COLORS[idx % TRIP_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
        </>
      )}
    </PageLayout>
  );
}
