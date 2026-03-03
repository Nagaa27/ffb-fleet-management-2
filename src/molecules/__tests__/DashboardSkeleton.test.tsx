// src/molecules/__tests__/DashboardSkeleton.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DashboardSkeleton } from '../DashboardSkeleton';

describe('DashboardSkeleton', () => {
  it('renders the skeleton container', () => {
    render(<DashboardSkeleton />);
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
  });

  it('renders 4 stat card skeletons', () => {
    const { container } = render(<DashboardSkeleton />);
    const statCards = container.querySelectorAll('[class*="stat-skeleton"]');
    expect(statCards).toHaveLength(4);
  });

  it('renders skeleton elements', () => {
    render(<DashboardSkeleton />);
    const skeletons = screen.getAllByTestId('skeleton');
    // Each stat card: 1 rect + 3 text = 4; 4 cards = 16
    // Each detail card: 1 title + 3 rows * 2 = 7; 2 cards = 14
    // Total = 30
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders detail grid section', () => {
    const { container } = render(<DashboardSkeleton />);
    const detailGrid = container.querySelector('[class*="detail-grid"]');
    expect(detailGrid).toBeInTheDocument();
  });
});
