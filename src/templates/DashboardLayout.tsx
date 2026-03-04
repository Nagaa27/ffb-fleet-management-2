// src/templates/DashboardLayout.tsx
// Template: Main app layout with responsive sidebar + content area.

import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from '../organisms';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className={styles['layout']} data-testid="dashboard-layout">
      {/* Mobile header with hamburger */}
      <header className={styles['mobile-header']}>
        <button
          className={styles['hamburger']}
          onClick={() => { setSidebarOpen(true); }}
          aria-label="Buka menu"
        >
          <Menu size={24} />
        </button>
        <h1 className={styles['mobile-header-title']}>FFB Fleet</h1>
        {/* Spacer for centering */}
        <div style={{ width: '2.5rem' }} />
      </header>

      {/* Sidebar overlay (mobile) */}
      <div
        className={`${styles['sidebar-overlay']} ${sidebarOpen ? styles['sidebar-overlay--open'] : ''}`}
        onClick={closeSidebar}
        role="presentation"
      />

      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <main className={styles['main']}>
        <Outlet />
        <footer className={styles['footer']}>
          <p>&copy; {new Date().getFullYear()} FFB Fleet Management System. Matius Celcius Sinaga</p>
        </footer>
      </main>
    </div>
  );
}
