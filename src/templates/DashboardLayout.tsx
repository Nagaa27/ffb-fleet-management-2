// src/templates/DashboardLayout.tsx
// Template: Main app layout with sidebar + content area.

import { Outlet } from 'react-router-dom';
import { Sidebar } from '../organisms';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  return (
    <div className={styles['layout']} data-testid="dashboard-layout">
      <Sidebar />
      <main className={styles['main']}>
        <Outlet />
      </main>
    </div>
  );
}
