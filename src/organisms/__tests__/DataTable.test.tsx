// src/organisms/__tests__/DataTable.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataTable } from '../DataTable';
import type { Column } from '../DataTable';

interface TestItem {
  id: string;
  name: string;
  value: number;
}

const testData: TestItem[] = [
  { id: '1', name: 'Alpha', value: 10 },
  { id: '2', name: 'Beta', value: 20 },
  { id: '3', name: 'Gamma', value: 5 },
];

const columns: Column<TestItem>[] = [
  { key: 'name', header: 'Name', sortable: true, render: (d) => d.name },
  { key: 'value', header: 'Value', sortable: true, render: (d) => String(d.value) },
];

describe('DataTable', () => {
  it('renders all rows', () => {
    render(
      <DataTable columns={columns} data={testData} keyExtractor={(d) => d.id} />,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(
      <DataTable columns={columns} data={testData} keyExtractor={(d) => d.id} />,
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('shows empty message when data is empty', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        keyExtractor={(d) => d.id}
        emptyMessage="No items"
      />,
    );
    expect(screen.getByText('No items')).toBeInTheDocument();
  });

  it('shows skeleton when loading', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        keyExtractor={(d) => d.id}
        loading
      />,
    );
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
  });

  it('calls onRowClick when row is clicked', () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={testData}
        keyExtractor={(d) => d.id}
        onRowClick={onRowClick}
      />,
    );
    fireEvent.click(screen.getByText('Alpha'));
    expect(onRowClick).toHaveBeenCalledWith(testData[0]);
  });

  it('sorts data when column header is clicked', () => {
    render(
      <DataTable columns={columns} data={testData} keyExtractor={(d) => d.id} />,
    );
    // Click on "Name" header to sort ascending
    fireEvent.click(screen.getByText('Name'));

    const rows = screen.getAllByRole('row');
    // First row is header, so data rows start at index 1
    expect(rows[1]).toHaveTextContent('Alpha');
    expect(rows[2]).toHaveTextContent('Beta');
    expect(rows[3]).toHaveTextContent('Gamma');
  });
});
