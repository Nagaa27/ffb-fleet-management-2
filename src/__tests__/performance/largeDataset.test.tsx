// src/__tests__/performance/largeDataset.test.tsx
// Performance: Verify DataTable renders 1000+ rows without exceeding time budget.

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataTable } from '../../organisms/DataTable';
import type { Column } from '../../organisms/DataTable';

interface TestRow {
  id: string;
  name: string;
  value: number;
}

function generateRows(count: number): TestRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `row-${i}`,
    name: `Item ${i}`,
    value: Math.random() * 1000,
  }));
}

const columns: Column<TestRow>[] = [
  { key: 'id', header: 'ID', render: (r) => r.id },
  { key: 'name', header: 'Name', sortable: true, render: (r) => r.name },
  { key: 'value', header: 'Value', render: (r) => r.value.toFixed(2) },
];

describe('Large Dataset Performance', () => {
  it('renders 100 rows in regular mode under 500ms', () => {
    const rows = generateRows(100);
    const start = performance.now();

    render(
      <DataTable
        columns={columns}
        data={rows}
        keyExtractor={(r) => r.id}
        virtualThreshold={200} // Force regular mode
      />,
    );

    const elapsed = performance.now() - start;
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(elapsed).toBeLessThan(500);
  });

  it('renders 1000 rows with virtualization under 1000ms', () => {
    const rows = generateRows(1000);
    const start = performance.now();

    render(
      <DataTable
        columns={columns}
        data={rows}
        keyExtractor={(r) => r.id}
        virtualThreshold={100} // Force virtual mode
      />,
    );

    const elapsed = performance.now() - start;
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    // With virtualization, only a subset of rows should be rendered
    expect(elapsed).toBeLessThan(1000);
  });

  it('renders 5000 rows with virtualization under 2000ms', () => {
    const rows = generateRows(5000);
    const start = performance.now();

    render(
      <DataTable
        columns={columns}
        data={rows}
        keyExtractor={(r) => r.id}
        virtualThreshold={100}
      />,
    );

    const elapsed = performance.now() - start;
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(elapsed).toBeLessThan(2000);
  });

  it('creates virtual scrolling container for large datasets', () => {
    const rows = generateRows(1000);

    const { container } = render(
      <DataTable
        columns={columns}
        data={rows}
        keyExtractor={(r) => r.id}
        virtualThreshold={100}
      />,
    );

    // In virtual mode, the tbody should have a height style for the total size
    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
    expect(tbody?.style.position).toBe('relative');
    // The table wrapper should have the virtual class
    const wrapper = container.querySelector('[class*="table-wrapper--virtual"]');
    expect(wrapper).toBeInTheDocument();
  });
});
