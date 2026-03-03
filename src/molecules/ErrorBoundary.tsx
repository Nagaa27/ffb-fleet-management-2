// src/molecules/ErrorBoundary.tsx
// Molecule: Error boundary with fallback UI and recovery options.

import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../atoms';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional fallback component */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for monitoring in production
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles['error-container']} data-testid="error-boundary">
          <AlertTriangle size={48} className={styles['error-icon']} />
          <h2 className={styles['error-title']}>Terjadi Kesalahan</h2>
          <p className={styles['error-message']}>
            Maaf, terjadi masalah yang tidak terduga. Silakan coba muat ulang halaman
            atau kembali ke halaman sebelumnya.
          </p>
          {this.state.error && (
            <pre className={styles['error-details']}>
              {this.state.error.message}
            </pre>
          )}
          <div className={styles['error-actions']}>
            <Button variant="secondary" onClick={this.handleReset}>
              Coba Lagi
            </Button>
            <Button onClick={this.handleReload}>
              Muat Ulang Halaman
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
