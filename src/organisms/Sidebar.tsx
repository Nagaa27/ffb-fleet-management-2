// src/organisms/Sidebar.tsx
// Organism: Application sidebar navigation with responsive mobile support.

import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Route,
  Truck,
  Users,
  Factory,
  X,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips', icon: Route, label: 'Trip' },
  { to: '/vehicles', icon: Truck, label: 'Kendaraan' },
  { to: '/drivers', icon: Users, label: 'Pengemudi' },
  { to: '/mills', icon: Factory, label: 'Pabrik' },
] as const;

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <aside
      className={`${styles['sidebar']} ${isOpen ? styles['sidebar--open'] : ''}`}
      data-testid="sidebar"
    >
      <div className={styles['sidebar-header']}>
        <div className={styles['sidebar-header-text']}>
          <h1 className={styles['sidebar-title']}>FFB Fleet</h1>
          <span className={styles['sidebar-subtitle']}>Management System</span>
        </div>
        {onClose && (
          <button
            className={styles['sidebar-close']}
            onClick={onClose}
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className={styles['sidebar-nav']}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `${styles['nav-link']} ${isActive ? styles['nav-link--active'] : ''}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
