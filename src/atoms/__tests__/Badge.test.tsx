// src/atoms/__tests__/Badge.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders label text', () => {
    render(<Badge label="Active" variant="success" />);
    expect(screen.getByTestId('badge')).toHaveTextContent('Active');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Badge label="Test" variant="success" />);
    expect(screen.getByTestId('badge')).toBeInTheDocument();

    rerender(<Badge label="Test" variant="warning" />);
    expect(screen.getByTestId('badge')).toBeInTheDocument();

    rerender(<Badge label="Test" variant="error" />);
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });
});
