// src/organisms/Sidebar.tsx
// Organism: Application sidebar navigation.

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Route,
  Truck,
  Users,
  Factory,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips', icon: Route, label: 'Trip' },
  { to: '/vehicles', icon: Truck, label: 'Kendaraan' },
  { to: '/drivers', icon: Users, label: 'Pengemudi' },
  { to: '/mills', icon: Factory, label: 'Pabrik' },
] as const;

export function Sidebar() {
  return (
    <aside className={styles['sidebar']} data-testid="sidebar">
      <div className={styles['sidebar-header']}>
        <h1 className={styles['sidebar-title']}>FFB Fleet</h1>
        <span className={styles['sidebar-subtitle']}>Management System</span>
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
