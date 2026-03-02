// src/atoms/__tests__/Spinner.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spinner } from '../Spinner';

describe('Spinner', () => {
  it('renders with status role', () => {
    render(<Spinner />);
    expect(screen.getByTestId('spinner')).toHaveAttribute('role', 'status');
  });

  it('renders with aria-label', () => {
    render(<Spinner />);
    expect(screen.getByTestId('spinner')).toHaveAttribute('aria-label', 'Loading');
  });
});
