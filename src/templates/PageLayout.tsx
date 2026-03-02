// src/templates/PageLayout.tsx
// Template: Reusable page template with header (title + actions) + content.

import styles from './PageLayout.module.css';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({ title, subtitle, actions, children }: PageLayoutProps) {
  return (
    <div className={styles['page']} data-testid="page-layout">
      <div className={styles['page-header']}>
        <div className={styles['page-header-text']}>
          <h2 className={styles['page-title']}>{title}</h2>
          {subtitle && <p className={styles['page-subtitle']}>{subtitle}</p>}
        </div>
        {actions && <div className={styles['page-actions']}>{actions}</div>}
      </div>
      <div className={styles['page-content']}>{children}</div>
    </div>
  );
}
