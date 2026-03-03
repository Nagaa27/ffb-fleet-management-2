// src/molecules/__tests__/TableSkeleton.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableSkeleton } from '../TableSkeleton';

describe('TableSkeleton', () => {
  it('renders with default props', () => {
    render(<TableSkeleton />);
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
  });

  it('renders correct number of rows', () => {
    const { container } = render(<TableSkeleton rows={3} columns={4} />);
    const rows = container.querySelectorAll('[class*="skeleton-row"]');
    expect(rows).toHaveLength(3);
  });

  it('renders a header row', () => {
    const { container } = render(<TableSkeleton rows={2} columns={3} />);
    const header = container.querySelector('[class*="skeleton-header"]');
    expect(header).toBeInTheDocument();
  });

  it('renders skeleton elements inside rows', () => {
    render(<TableSkeleton rows={2} columns={3} />);
    const skeletons = screen.getAllByTestId('skeleton');
    // header has 3 skeletons + 2 rows * 3 columns = 9 total
    expect(skeletons.length).toBe(3 + 2 * 3);
  });
});
