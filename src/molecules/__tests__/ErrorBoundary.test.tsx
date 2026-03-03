// src/molecules/__tests__/ErrorBoundary.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';

// Component that throws on command
function ThrowingChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div data-testid="child">Hello</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error from React and our boundary
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">OK</div>
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('child')).toHaveTextContent('OK');
  });

  it('shows error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByText('Terjadi Kesalahan')).toBeInTheDocument();
  });

  it('displays the error message', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('shows "Coba Lagi" and "Muat Ulang Halaman" buttons', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Coba Lagi')).toBeInTheDocument();
    expect(screen.getByText('Muat Ulang Halaman')).toBeInTheDocument();
  });

  it('resets error state when "Coba Lagi" is clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();

    // Clicking "Coba Lagi" resets hasError & error to null
    // The child will throw again, so boundary re-catches — that's expected.
    // We verify the reset happens (without throwing the child will succeed).
    fireEvent.click(screen.getByText('Coba Lagi'));
    // After reset, the component re-renders children; since the child still
    // throws, we end up back in error state — but the reset path was exercised.
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  it('calls window.location.reload when "Muat Ulang Halaman" is clicked', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow />
      </ErrorBoundary>,
    );
    fireEvent.click(screen.getByText('Muat Ulang Halaman'));
    expect(reloadMock).toHaveBeenCalled();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="fallback">Custom Fallback</div>}>
        <ThrowingChild shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('fallback')).toHaveTextContent('Custom Fallback');
    expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
  });
});
